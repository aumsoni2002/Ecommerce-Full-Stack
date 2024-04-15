import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EcommerceFormService } from '../../services/ecommerce-form.service';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CustomValidators } from '../../Validators/custom-validators';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { Router } from '@angular/router';
import { Order } from '../../common/order';
import { OrderItem } from '../../common/order-item';
import { Purchase } from '../../common/purchase';
import { environment } from '../../../environments/environment.development';
import { PaymentInfo } from '../../common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];
  country: Country;
  defaultCountry: Country;

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  defaultState: string;
  defaultBillingState: string;

  storage: Storage = sessionStorage;

  // Initializing Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = '';

  isDisabled: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private eCommerceFormService: EcommerceFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {}

  // Getters for FormControls
  // Customers
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }
  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }
  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  // Shipping Address
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');
  }
  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');
  }
  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');
  }
  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');
  }
  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');
  }

  // Billing Address
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');
  }
  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');
  }
  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');
  }
  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');
  }
  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');
  }

  // Credit Card
  get creditCardType() {
    return this.checkoutFormGroup.get('creditCard.cardType');
  }
  get creditCardNameOnCard() {
    return this.checkoutFormGroup.get('creditCard.nameOnCard');
  }
  get creditCardNumber() {
    return this.checkoutFormGroup.get('creditCard.cardNumber');
  }
  get creditCardSecurityCode() {
    return this.checkoutFormGroup.get('creditCard.securityCode');
  }
  get creditCardExpirationMonth() {
    return this.checkoutFormGroup.get('creditCard.expirationMonth');
  }
  get creditCardExpirationYear() {
    return this.checkoutFormGroup.get('creditCard.expirationYear');
  }

  ngOnInit(): void {
    // Setting-up Stripe payment form
    this.setupStripePaymentForm();

    // reading the user's email from web browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);
    const theFirstName = JSON.parse(this.storage.getItem('userFirstName')!);
    const theLastName = JSON.parse(this.storage.getItem('userLastName')!);
    const streetAddress = JSON.parse(this.storage.getItem('streetAddress')!);
    const city = JSON.parse(this.storage.getItem('city')!);
    this.defaultState = JSON.parse(this.storage.getItem('state')!);
    const zipCode = JSON.parse(this.storage.getItem('zipCode')!);
    const countryCode = JSON.parse(this.storage.getItem('countryCode')!);

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl(theFirstName, [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl(theLastName, [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl(theEmail, [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl(streetAddress, [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl(city, [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl(zipCode, [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl('', [
          Validators.required,
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
      }),
      creditCard: this.formBuilder.group({
        // cardType: new FormControl('', [Validators.required]),
        // nameOnCard: new FormControl('', [
        //   Validators.required,
        //   Validators.minLength(2),
        //   CustomValidators.notOnlyWhiteSpace,
        // ]),
        // cardNumber: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{16}'),
        // ]),
        // securityCode: new FormControl('', [
        //   Validators.required,
        //   Validators.pattern('[0-9]{3}'),
        // ]),
        // expirationMonth: new FormControl(new Date().getMonth() + 1),
        // expirationYear: new FormControl(new Date().getFullYear()),
      }),
    });

    // Populate drop-down for the input expirationMonth
    // First we need the current month to send it our service method.
    // Now below javascript method to get current month is 0 based which it gives number from 0 to 11, that is why we need to add 1 to it.
    // const startMonth: number = new Date().getMonth() + 1;
    // this.eCommerceFormService
    //   .getCreditCardMonths(startMonth)
    //   .subscribe((data) => {
    //     this.creditCardMonths = data;
    //   });

    // // Populate drop-down for the input expirationYear
    // this.eCommerceFormService.getCreditCardYears().subscribe((data) => {
    //   this.creditCardYears = data;
    // });

    // Populate drop-down for the input countries
    this.eCommerceFormService.getCountries().subscribe((data) => {
      this.countries = data;

      // Find country name from countries array
      this.country = this.countries.find((c) => c.code === countryCode);
      if (this.country) {
        this.defaultCountry = this.country; // Set defaultCountry
      }
    });

    // calling reviewCartDetails write after the component gets instantiated
    this.reviewCartDetails();
  }

  setupStripePaymentForm() {
    // get a handle to stripe elements
    var elements = this.stripe.elements();

    // Create a card element ... and hide the zip-code field
    this.cardElement = elements.create('card', { hidePostalCode: true });

    // Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');

    // Add event binding for the 'change' event on the card element
    this.cardElement.on('change', (event: any) => {
      // get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textContent = '';
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textContent = event.error.message;
      }
    });
  }

  copyShippingAddressToBillingAddress(event: Event) {
    const isChecked = (<HTMLInputElement>event.target).checked;
    if (isChecked) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
      this.defaultBillingState = this.defaultState;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
      this.defaultBillingState = '';
    }
  }

  // handleMonthsAndYears() {
  //   // first we need to have to access to creditCard FormGroup then we can have access to its FormControl 'expirationYear'
  //   const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

  //   const currentYear: number = new Date().getFullYear();
  //   const selectedYear: number = Number(
  //     creditCardFormGroup.value.expirationYear
  //   );

  //   // Now that we have the current year and the selected year, we can check if the year that user has selected is current year, we will
  //   // only show remaining months of the year. If it is a future year, we will show all 12 months.
  //   let startMonth: number;
  //   if (currentYear === selectedYear) {
  //     startMonth = new Date().getMonth() + 1; // In javascript the months given by this built-in library are 0 based.
  //   } else {
  //     startMonth = 1;
  //   }
  //   this.eCommerceFormService
  //     .getCreditCardMonths(startMonth)
  //     .subscribe((data) => {
  //       this.creditCardMonths = data;
  //     });
  //   // console.log(creditCardFormGroup.value.expirationYear);
  //   if (
  //     creditCardFormGroup.value.expirationMonth <= new Date().getMonth() &&
  //     currentYear === selectedYear
  //   ) {
  //     const expirationMonthControl = this.checkoutFormGroup.get(
  //       'creditCard.expirationMonth'
  //     );
  //     expirationMonthControl.patchValue(new Date().getMonth() + 1);
  //   }
  // }

  // Showing states as per the user selected country
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;

    this.eCommerceFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup.get('state').setValue(data[0]);
    });
  }

  // Below method gets the total price and total quantity by subscribing to an event of cart-service
  reviewCartDetails() {
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }

  // Below methods reset the cart once the order has been successfully placed
  resetCart() {
    // Resetting cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();

    // Resetting the form
    this.checkoutFormGroup.reset();

    // navigate back to the product page
    this.router.navigateByUrl('/products');
  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // Setting up the order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // Getting all cart items
    const cartItems = this.cartService.cartItems;

    // Putting/Converting all cartItems to orderItems
    let orderItems: OrderItem[] = cartItems.map(
      (tempCartItem) => new OrderItem(tempCartItem)
    );

    // Setting up the purchase
    let purchase = new Purchase();

    // Populating 'customer' for the purchase
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Populating 'shippingAddress' for the purchase
    purchase.shippingAddress =
      this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingCountry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // Populating 'billingAddress' for the purchase
    purchase.billingAddress =
      this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingCountry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;

    // Populating 'order' and 'orderItems' for the purchase
    purchase.order = order;
    purchase.orderItems = orderItems;

    // Computing payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = 'USD';
    this.paymentInfo.receiptEmail = purchase.customer.email;

    // Calling REST API via the CheckoutService
    // this.checkoutService.placeOrder(purchase).subscribe({
    //   next: (response) => {
    //     alert(
    //       `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
    //     );

    //     // Once the order has been placed, we will reset the cart
    //     this.resetCart();
    //   },
    //   error: (err) => {
    //     alert(`There was an error while placing your order: ${err.message}`);
    //   },
    // });

    // if the filled form is valid then
    // - create payment intent
    // - confirm card payment
    // - place order

    if (
      !this.checkoutFormGroup.invalid &&
      this.displayError.textContent === ''
    ) {
      this.isDisabled = true;
      this.checkoutService
        .createPaymentIntent(this.paymentInfo)
        .subscribe((paymentIntentResponse) => {
          this.stripe
            .confirmCardPayment(
              paymentIntentResponse.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                  billing_details: {
                    email: purchase.customer.email,
                    name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                    address: {
                      line1: purchase.billingAddress.street,
                      city: purchase.billingAddress.city,
                      state: purchase.billingAddress.state,
                      postal_code: purchase.billingAddress.zipCode,
                      country: this.billingAddressCountry.value.code,
                    },
                  },
                },
              },
              { handleActions: false }
            )
            .then((result: any) => {
              if (result.error) {
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
              } else {
                // call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(
                      `Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`
                    );

                    // reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: any) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  },
                });
              }
            });
        });
    } else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
  }
}

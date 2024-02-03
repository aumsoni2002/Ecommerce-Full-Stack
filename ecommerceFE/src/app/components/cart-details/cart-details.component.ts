import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Getting Cart Items from the cartService into our empty cartItems Array to show it on Cart Details Page.
    this.cartItems = this.cartService.cartItems;

    // Getting total price by subscribing to the totalPrice event which we created in cartService
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    // Getting total quantity by subscribing to the totalPrice event which we created in cartService
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    // Computing cart total price and total quantity
    this.cartService.computeCartTotals();
  }

  // Below method increases the quantity of a product
  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  // Below method decreases the quantity of a product
  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);
  }

  // Below method will remove the product from the cart regardless of its quantity
  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }
}

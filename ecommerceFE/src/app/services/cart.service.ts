import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Below is practically our Shopping Cart which is an array of CartItem Objects
  // We have to keep updating this one as this is the one and only copy that we have
  cartItems: CartItem[] = [];

  // Below are the subjects it contains those data that we want to send it to another component through an Observable.
  // Subject is a subclass of Observable. We can use subjects to publish events/ send data to any part of our application.
  // The event will be sent to all those parts that have subscribed for this subject.
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  // we will me making use of session storage to store the cart items so that if the user refreshes the page, the cart does not loose all the items.
  // storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {
    // upon instantiating a component, we must first get all the cart items from the session storage and put them back into the cart
    // reading data from storage
    // the data is always stored in the form of JSON in local or session storage so we must parse it first to make use of it.
    let data = JSON.parse(this.storage.getItem('cartItems'));

    // If there is some cart items in the session storage, we will put them in the cartItems array.
    if (data != null) {
      this.cartItems = data;

      // Now that we have the data in the cartItems array, we will call the computeCartTotals to again show that data in cart status.
      this.computeCartTotals();
    }
  }

  // Below is the main method for adding a new or existing product to the cart.
  // The method first takes the product and does below following tasks
  // 1. If our Shopping Cart that is our 'cartItems' array is empty, the method will simply push the product our 'cartItems' array
  // 2. If our Shopping Cart that is our 'cartItems' array is not empty:
  //    a. If the product exists in our 'cartItems' array, The method will simply increase that particular product's quantity by one.
  //    b. If the product does not exist in our 'cartItems' array, the method will simply push the product our 'cartItems' array
  addToCart(theCartItem: CartItem) {
    let alreadyExistInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    // If there are products in the Cart, we will check if our new coming product is already in the cart or not.
    if (this.cartItems.length > 0) {
      // for (let tempCartItem of this.cartItems) {
      //   // checking if the coming new product is already in the cart, we will simply increase that product's quantity by one.
      //   if (tempCartItem.id === theCartItem.id) {
      //     existingCartItem = tempCartItem; // here we are accessing the product which is in the cart to increase the value.
      //     break; // if the product is found in cart we will have the access first and break the loop;
      //   }
      // }

      // Below find method of array will go through each item of the array and check if the id matches, it will return that element
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id
      );

      // If the product exist in the cart, we will change the value for 'alreadyExistInCart' to true for future use.
      if (existingCartItem != undefined) {
        alreadyExistInCart = true;
      }
    }

    // If the product exists in the cart, we will just increase the quantity by one.
    if (alreadyExistInCart === true) {
      existingCartItem.quantity++;
    } else {
      // if the product does not exist in the cart, we will simply push the whole product in the cart
      this.cartItems.push(theCartItem);
    }

    // Now that we have updated our cart, it is time to send updated cart data to those who subscribed for this data.
    this.computeCartTotals();
  }

  // below method does the addition for price and quantity between the new products and the products that are already in the cart.
  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue =
        totalPriceValue + currentCartItem.unitPrice * currentCartItem.quantity;
      totalQuantityValue = totalQuantityValue + currentCartItem.quantity;
    }

    // Now that we have the updated total price and total quantity, we can send the data to those who subscribed for this data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Console logging Cart data for debugging purpose
    this.logCartData(totalPriceValue, totalQuantityValue);

    // persisting cart items into the session storage
    this.persistCartItems();
  }

  // Below method just console log the items in the Cart
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the Cart');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}, subTotalPrice: ${subTotalPrice}`
      );
    }
    console.log(
      `totalPrice: ${totalPriceValue.toFixed(
        2
      )}, totalQuantity: ${totalQuantityValue}`
    );
    console.log('----');
  }

  // Below method takes a cart item and decreases its quantity by one
  // If there is only 1 quantity of that product, it calls the remove method to remove the product from the cart
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;
    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex(
      (tempCartItem) => tempCartItem.id === theCartItem.id
    );

    if (itemIndex > -1) {
      console.log('remove called');
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

  persistCartItems() {
    // the local or session storage only stores JSON Format data, so must convert any data to JSON format before saving inside it.
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }
}

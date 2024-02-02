import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrl: './cart-status.component.css',
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    // Subscribe for Cart's total price
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });

    // Subscribe for Cart's total quantity
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }
}

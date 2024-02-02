// We have created this model class for only those properties of a product that we need to be in the cart.
// The another purpose of this model class is to also have a quantity property created and sent into the cart

import { Product } from './product';

export class CartItem {
  id: string;
  name: string;
  imageUrl: string;
  unitPrice: number;

  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;

    this.quantity = 1;
  }
}

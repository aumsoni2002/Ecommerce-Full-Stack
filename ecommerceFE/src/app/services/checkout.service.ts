import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private httpClient: HttpClient) {}

  // below method sends an object of type 'Purchase' to the backend by hitting POST call to 'purchaseUrl' and returns an observable of type any
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { PaymentInfo } from '../common/payment-info';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = environment['eCommerceApiUrl'] + '/checkout/purchase';
  private paymentIntentUrl =
    environment['eCommerceApiUrl'] + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) {}

  // below method sends an object of type 'Purchase' to the backend by hitting POST call to 'purchaseUrl' and returns an observable of type any
  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
      this.paymentIntentUrl,
      paymentInfo
    );
  }
}

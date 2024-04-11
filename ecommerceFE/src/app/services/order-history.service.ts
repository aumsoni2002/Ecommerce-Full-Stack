import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderHistoryService {
  private orderUrl = environment['eCommerceApiUrl'] + '/orders';

  constructor(private httpClient: HttpClient) {}

  /*
  Below function does the HTTP GET Call to the backend REST API 'orderHistoryUrl' and returns an Observable
  of type GetResponseOrderHistory. Now upon calling that REST API, we are getting list of orders done by a user
  in the form of JSON. But to unwrap the JSON and make use of it in our Angular Front-End, we are 
  mapping/converting it into an array of type 'OrderHistory' class through the help of GetResponseOrderHistory. 

  */
  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {
    // Below is the URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}

interface GetResponseOrderHistory {
  _embedded: {
    orders: OrderHistory[];
  };
}

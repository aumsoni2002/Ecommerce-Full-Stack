import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Promise<HttpEvent<any>> {
    // only add the access token for secures tokens
    const theEndpoint = environment['eCommerceApiUrl'] + '/orders';
    const securedEndpoints = [theEndpoint];

    // In below if statement, we are checking if the above 'securedEndpoints' are same as the backend's exposed REST API for showing all
    // orders. If both are same then we are sending the access token so that we can have access to their resource.
    if (securedEndpoints.some((url) => request.urlWithParams.includes(url))) {
      // get the access token
      const accessToken = this.oktaAuth.getAccessToken();

      // clone the request and add new header with access token
      // The reason that we had to clone the request is because, the request is immutable and we can modify the original request.
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken,
        },
      });
    }
    // here we are saying that go ahead and continue with the work of other interceptors that are in chain and if there are no
    // other interceptors in the chain then simply make a call to the REST API.
    return await lastValueFrom(next.handle(request));
  }
}

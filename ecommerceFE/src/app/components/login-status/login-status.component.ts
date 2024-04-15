import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrl: './login-status.component.css',
})
export class LoginStatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  userFullName: string = '';
  userAddress: any = {};
  storage: Storage = sessionStorage;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe((result) => {
      this.isAuthenticated = result.isAuthenticated!;
      this.getUserDetails();
    });
  }

  getUserDetails() {
    // get the user details only if they are authenticated
    // we are fetching the user details from the user's claims
    if (this.isAuthenticated) {
      this.oktaAuth.getUser().then((response) => {
        this.userFullName = response.name as string;

        // retrieve the user's information from authentication response
        const theEmail = response.email;
        const theFirstName = response.given_name;
        const theLastName = response.family_name;

        // Access individual attributes of the address object
        const address: any = response['address'];
        this.userAddress = {
          streetAddress: address?.street_address,
          city: address?.locality,
          state: address?.region,
          zipCode: address?.postal_code,
          countryCode: address?.country,
        };

        // storing the response's email into the web browser storage
        this.storage.setItem('userEmail', JSON.stringify(theEmail));
        this.storage.setItem('userFirstName', JSON.stringify(theFirstName));
        this.storage.setItem('userLastName', JSON.stringify(theLastName));

        this.storage.setItem(
          'streetAddress',
          JSON.stringify(this.userAddress.streetAddress)
        );
        this.storage.setItem('city', JSON.stringify(this.userAddress.city));
        this.storage.setItem('state', JSON.stringify(this.userAddress.state));
        this.storage.setItem(
          'zipCode',
          JSON.stringify(this.userAddress.zipCode)
        );
        this.storage.setItem(
          'countryCode',
          JSON.stringify(this.userAddress.countryCode)
        );
      });
    }
  }

  logout() {
    // terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
    this.storage.removeItem('userEmail');
    this.storage.removeItem('userFirstName');
    this.storage.removeItem('userLastName');
    this.storage.removeItem('streetAddress');
    this.storage.removeItem('city');
    this.storage.removeItem('state');
    this.storage.removeItem('zipCode');
    this.storage.removeItem('countryCode');
  }
}

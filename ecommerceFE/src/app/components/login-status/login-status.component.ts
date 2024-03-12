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
      });
    }
  }

  logout() {
    // terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import myAppConfig from '../../config/my-app-config';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import OktaSignIn from '@okta/okta-signin-widget';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  oktaSignin: any;

  // Here we have injected the okta signin entity, to make use of it, we need to instantiate a new OktaSignIn object
  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
    this.oktaSignin = new OktaSignIn({
      logo: 'assets/images/logo-png.png',
      baseUrl: myAppConfig.oidc.issuer.split('/oauth2')[0], // give me all characters that are before '/oauth2'
      clientId: myAppConfig.oidc.clientId,
      redirectUri: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true, // proof key for code exchange, it means that we are going to make use of dynamic secrets for passing the information between our app and authorization server
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
      // features: {
      //   registration: true, // Enable Self Service Registration
      // },
    }); 
  }
  ngOnInit(): void {
    // this will remove any previous signed in user.
    this.oktaSignin.remove();

    // Below method will render the sign-in widget on the page.
    this.oktaSignin.renderEl(
      {
        el: '#okta-sign-in-widget', // this tells angular to render the element that has this id.
      },
      // when user attempts to login, we will check response and is its success, we will let the user sign-in with redirect
      (response: any) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      // In an event that there was an error during sign-in then we will simply throw an error
      (error: any) => {
        throw error;
      }
    );
  }
}

export default {
  oidc: {
    clientId: '0oafiu3q5zZJwoeN75d7', // this is the public identifier of our client app.
    issuer: 'https://dev-64721201.okta.com/oauth2/default', // Issue of tokens, the URL that we will use when authorizing Okta Authorization Server
    redirectUri: 'https://localhost:4200/login/callback', // we will send the user to this url, once they are logged in.
    scopes: ['openid', 'profile', 'email', 'address'], // The scope provides access to information about the user.
    // openid: required for authentication requests
    // profile: user's first name, last name, phone etc.
    // email: user's email address
  },
};

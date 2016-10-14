import {Provider, Request} from 'oauth2-client-js';
import {foodsoftUrl, foodsoftClientId, foodsoftAccessToken} from './config';

export default class OAuthProvider {

  constructor(rootUrl, clientId) {
    this._provider = new Provider({
      id: 'foodsoft',
      authorization_url: foodsoftUrl + '/oauth/authorize',
    });
    this._metadata = null;
  }

  request(href = window.location.href) {
    const parts = href.split('#', 1);
    const request = new Request({
      client_id: foodsoftClientId,
      redirect_uri: parts[0],
      metadata: parts[1], // remember current location
    });
    this._provider.remember(request);
    window.location.href = this._provider.requestToken(request);
    // unreachable code
  }

  respond(hash = window.location.hash) {
    if (!hash) { return; }
    try {
      const response = this._provider.parse(hash);
      if (!response) { return; }
      window.location.hash = response._metadata || ''; // restore current location
      return response;
    } catch(e) { /* it's ok if no access_token is found */ }
  }

  getAccessToken() {
    return foodsoftAccessToken || this._provider.getAccessToken();
  }

}

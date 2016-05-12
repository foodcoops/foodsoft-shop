import {Provider, Request} from 'oauth2-client-js';
import rest, {rootUrl} from './rest';

export default class OAuthProvider {

  constructor(rootUrl, clientId) {
    this._provider = new Provider({
      id: 'foodsoft',
      authorization_url: rootUrl + '/oauth/authorize',
    });
    this._clientId = clientId;
    this._metadata = null;
  }

  request(href = window.location.href) {
    const parts = href.split('#', 1);
    const request = new Request({
      client_id: this._clientId,
      redirect_uri: parts[0],
      metadata: parts[1], // remember current location
    });
    this._provider.remember(request);
    window.location.href = this._provider.requestToken(request);
    // unreachable code
  }

  respond(hash = window.location.hash) {
    if (!hash) { return; }
    const response = this._provider.parse(hash);
    if (!response) { return; }
    this._metadata = response.metadata;
    return response;
  }

  getAccessToken() {
    return this._provider.getAccessToken();
  }

  getMetadata() {
    return this._metadata;
  }

}

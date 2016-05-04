import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {rootUrl} from './rest';
import rest from './rest';
import store from './store';
import Layout from './layout';
import Orders from './orders';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Layout>
          <Orders />
        </Layout>
      </Provider>
    );
  }
};

// basic OAuth2 login using implicit flow
// @todo move to separate file or use external library
let token = null;
const urlparams = qs.parse(window.location.hash.substr(1));

if (urlparams.access_token) {
  // (try to) hide token from url (safer and more beautiful)
  try { window.history.replaceState(null, null, '#'); } catch(e) { window.location.hash = '#'; }
  // retrieve token from url
  const nonce = localStorage.getItem('oauth2.nonce');
  if (!nonce) { throw 'No oauth2.nonce found in localStorage, did you initiate the OAuth2 flow from the app?'; }
  if (!urlparams.state) { throw 'OAuth2 state missing in fragment'; }
  if (urlparams.state !== nonce) { throw 'OAuth2 state from fragment does not match stored nonce'; }
  if (urlparams.token_type !== 'bearer') { throw 'OAuth2 token_type bearer expected in fragment'; }
  token = urlparams.access_token;
  localStorage.removeItem('oauth2.nonce');
}

if (token) {
  // we have a token, now render the app
  store.getState().user.accessToken = token; // @todo fix terrrrrible hack, sorry!
  ReactDOM.render(<App />, document.getElementById('app'));

} else {
  // no token, request a new one
  const nonce = new Date().getTime() + Math.random();
  localStorage.setItem('oauth2.nonce', nonce);
  window.location.href = rootUrl + '/oauth/authorize?' + qs.stringify({
    client_id: null, // @todo make this configurable through env or so
    response_type: 'token',
    state: nonce,
    redirect_uri: window.location.href
  });
}

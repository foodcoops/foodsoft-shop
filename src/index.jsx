import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { currentLocale } from 'i18n';
import moment from 'moment';

import OAuth from './oauth';
import store from './store/store';

import Layout from './containers/layout';
import Loading from './containers/loading';
import Orders from './containers/orders';

const App = ({store}) => (
  <Provider store={store}>
    <Loading>
      <Layout>
        <Orders />
      </Layout>
    </Loading>
  </Provider>
);

// handle OAuth2 login
const oauth = new OAuth();
oauth.respond();
// @todo use action here, this is terrible
const accessToken = oauth.getAccessToken();

if (!accessToken) {
  // no token, redirect without rendering app
  oauth.request();

} else {
  // store access token and setup app
  store.getState().user.accessToken = accessToken;
  // @todo set initial route/state from window.location.hash

  // setup l10n, ok if it fails
  try { moment.locale(currentLocale(), require(`moment/locale/${currentLocale()}.js`)); } catch(e) { }

  // render app
  ReactDOM.render(<App store={store} />, document.getElementById('app'));
}

import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import OAuth from './oauth';
import store from './store/store';

import Layout from './containers/layout';
import Orders from './containers/orders';

const App = ({store}) => (
  <Provider store={store}>
    <Layout>
      <Orders />
    </Layout>
  </Provider>
);

// handle OAuth2 login
const oauth = new OAuth();
oauth.respond();
// @todo use action here, this is terrible
store.getState().user.accessToken = oauth.getAccessToken();
// @todo set initial route/state from window.location.hash

// render app
ReactDOM.render(<App store={store} />, document.getElementById('app'));

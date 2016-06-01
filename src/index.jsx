import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';

import {currentLocale} from 'i18n';
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
store.getState().user.accessToken = oauth.getAccessToken();
// @todo set initial route/state from window.location.hash

// setup l10n, ok if it fails
try { moment.locale(currentLocale(), require(`moment/locale/${currentLocale()}.js`)); } catch(e) { }

// render app
ReactDOM.render(<App store={store} />, document.getElementById('app'));

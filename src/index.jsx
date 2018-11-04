import qs from 'qs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import moment from 'moment';
import { currentLocale } from 'i18n-js';
import i18nInit from './lib/i18n_init';

import OAuth from './oauth';
import store from './store';
import rootSaga from './sagas';
import { setAccessToken } from './actions/user';

import Layout from './containers/layout';
import Loading from './containers/loading';
import OrdersOpen from './containers/orders_open';

i18nInit();
store.runSaga(rootSaga);

const App = ({store}) => (
  <Provider store={store}>
    <Loading>
      <Router>
        <Layout>
          <Switch>
            <Redirect path='/' exact to='/open' />
            <Route exact path='/open' component={OrdersOpen} />
            <Route exact path='/open/by/:ordered(all|member)' component={OrdersOpen} />
            <Route exact path='/open/article_categories/:article_category_id' component={OrdersOpen} />
            <Route exact path='/open/orders/:order_id' component={OrdersOpen} />
          </Switch>
        </Layout>
      </Router>
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
  store.dispatch(setAccessToken(accessToken));
  // @todo set initial route/state from window.location.hash

  // setup l10n, ok if it fails
  try { moment.locale(currentLocale(), require(`moment/locale/${currentLocale()}.js`)); } catch(e) { }

  // render app
  ReactDOM.render(<App store={store} />, document.getElementById('app'));
}

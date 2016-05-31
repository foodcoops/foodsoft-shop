import reduxApi, {transformers} from 'redux-api';
import {appName, appVersion, foodsoftUrl} from '../config';
import restFetch from './rest_fetch';
import icrud from './rest_icrud';

// @see https://github.com/lexich/redux-api/issues/25
function options(url, params, getState) {
  const {user: {accessToken}} = getState();
  let headers = {
    'User-Agent': `${navigator.userAgent} ${appName}/${appVersion}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  };
  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken;
  }
  return {headers: headers};
};

export default reduxApi({
  user: {
    url: '/api/v1/user'
  },
  orders: {
    url: '/api/v1/orders'
  },
  categories: {
    url: '/api/v1/article_categories'
  },
  order_articles: {
    url: '/api/v1/order_articles/(:id)',
    transformer: icrud.transformer,
    helpers: {
      get: icrud.helpers.get,
    }
  },
  group_order_articles: {
    url: '/api/v1/group_order_articles/(:id)',
    transformer: icrud.transformer,
    helpers: icrud.helpers
  }
}).use('fetch', restFetch(fetch))
  .use('options', options)
  .use('rootUrl', foodsoftUrl);

import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

// default development url
// @todo get from some config
export const rootUrl = 'http://localhost:3002/f';

// @see https://github.com/lexich/redux-api/issues/25
function options(url, params, getState) {
  const {user: {accessToken}} = getState();
  let headers = {
    'User-Agent': 'foodsoft-shop', // @todo add version
    'Accept': 'application/json'
  };
  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken;
  }
  return {headers: headers};
};

// use upper-case method names to avoid CORS problems
function restFetch(url, options) {
  if (options.method) { options.method = options.method.toUpperCase(); }
  return fetch(url, options);
}

export default reduxApi({
  user: {
    url: '/api/v1/user'
  },
  orders: {
    url: '/api/v1/orders',
    transformer: transformers.array
  },
  categories: {
    url: '/api/v1/article_categories',
    transformer: transformers.array
  },
  order_articles: {
    url: '/api/v1/order_articles',
    transformer: transformers.array
  },
  group_order_articles: {
    url: '/api/v1/group_order_articles/(:id)',
    crud: true,
    transformer: transformers.array
  }
}).use('fetch', adapterFetch(restFetch))
  .use('options', options)
  .use('rootUrl', rootUrl);

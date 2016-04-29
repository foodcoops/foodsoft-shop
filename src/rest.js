import reduxApi, {transformers} from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

// @todo get from parameter or using OAuth2
const access_token = null;

// @see https://github.com/lexich/redux-api/issues/25
function options() {
  let headers = {
    'User-Agent': 'foodsoft-shop', // @todo add version
    'Accept': 'application/json'
  };
  if (access_token) {
    headers['Authorization'] = 'Bearer ' + access_token;
  }
  return {headers: headers};
};

export default reduxApi({
  user: {
    url: '/api/v1/user',
    options: options
  },
  orders: {
    url: '/api/v1/orders',
    transformer: transformers.array,
    options: options
  },
  categories: {
    url: '/api/v1/article_categories',
    transformer: transformers.array,
    options: options
  },
  order_articles: {
    url: '/api/v1/order_articles',
    transformer: transformers.array,
    options: options
  },
  group_order_articles: {
    url: '/api/v1/group_order_articles',
    transformer: transformers.array,
    options: options
  }
}).use('fetch', adapterFetch(fetch))
  .use('rootUrl', 'http://localhost:3000/f'); // default development url

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
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
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

function icrudTransformer(data, prevData, action) {
  if (/* @todo check success && */ action && action.request) {
    const method = action.request.params && action.request.params.method;
    const id = action.request.pathvars && action.request.pathvars.id;
    if (method === 'POST') {
      return prevData.concat(data);
    } else if (method === 'PATCH' || ((!method || method === 'GET') && id)) {
      return prevData.map((o) => o.id === id ? data : o);
    } else if (method === 'DELETE') {
      return prevData.filter((o) => o.id !== id);
    }
  }
  return transformers.array(data, prevData, action);
}

const crudHelpers = {
  get: function(id, cb) {
    return [{id: id}, cb];
  },
  create: function(attrs, cb) {
    return [{}, {body: JSON.stringify(attrs), method: 'POST'}, cb];
  },
  update: function(id, attrs, cb) {
    return [{id: id}, {body: JSON.stringify(attrs), method: 'PATCH'}, cb];
  },
  destroy: function(id, cb) {
    return [{id: id}, {method: 'DELETE'}, cb];
  }
};

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
    url: '/api/v1/order_articles/(:id)',
    transformer: icrudTransformer,
    helpers: {
      get: crudHelpers.get
    }
  },
  group_order_articles: {
    url: '/api/v1/group_order_articles/(:id)',
    transformer: icrudTransformer,
    helpers: crudHelpers
  }
}).use('fetch', adapterFetch(restFetch))
  .use('options', options)
  .use('rootUrl', rootUrl);

import reduxApi, {transformers} from 'redux-api';
import OAuth from '../oauth';
import {appName, appVersion, foodsoftUrl} from '../config';

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

function restFetch(fetch) {
  return function(url, options) {
    // workaround: use upper-case method names to avoid CORS problems
    if (options.method) { options.method = options.method.toUpperCase(); }
    // workaround: allow api to return 204 - https://github.com/lexich/redux-api/issues/63
    return fetch(url, options).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        if (resp.status !== 204) {
          return resp.json();
        }
      } else if (resp.status === 401) {
        // need (re-)authentication
        new OAuth().request();
        // unreachable code
      } else {
        // @todo handle errors
      }
    });
  }
}

// assumes response object has +data+ root key
function icrudTransformer(data, prevData, action) {
  if (/* @todo check success && */ action && action.request) {
    const method = action.request.params && action.request.params.method;
    const id = action.request.pathvars && action.request.pathvars.id;
    if (method === 'POST') {
      return {...prevData, data: prevData.data.concat(data.data)};
    } else if (method === 'PATCH' || ((!method || method === 'GET') && id)) {
      return {...prevData, data: prevData.data.map((o) => o.id === id ? data.data : o)};
    } else if (method === 'DELETE') {
      return {...prevData, data: prevData.data.filter((o) => o.id !== id)};
    }
  }
  return transformers.object(data, prevData, action);
}

// assumes request object expects attributes in a +data+ root key
const crudHelpers = {
  get: function(id, cb) {
    return [{id: id}, cb];
  },
  create: function(attrs, cb) {
    return [{}, {body: JSON.stringify({data: attrs}), method: 'POST'}, cb];
  },
  update: function(id, attrs, cb) {
    return [{id: id}, {body: JSON.stringify({data: attrs}), method: 'PATCH'}, cb];
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
    url: '/api/v1/orders'
  },
  categories: {
    url: '/api/v1/article_categories'
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
}).use('fetch', restFetch(fetch))
  .use('options', options)
  .use('rootUrl', foodsoftUrl);

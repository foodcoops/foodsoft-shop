import reduxApi, {async, transformers} from 'redux-api';
import OAuth from '../oauth';
import {appName, appVersion, foodsoftUrl} from '../config';
import {actions as notifs} from 're-notif';

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
        throw new Error(`Error: ${resp.statusText} (status ${resp.status})`);
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

const rest = reduxApi({
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


// add error handling to each action
// we need to detect the callback (last argument) and hook that
// @todo discuss at redux-api how to make this cleaner

function withErrorHandler(actionCreator, key) {
  return function() {
    const callback = typeof(arguments[arguments.length-1]) === 'function' ? arguments[arguments.length-1] : undefined;
    const creatorArgs = callback ? [...arguments].slice(0, -1) : arguments;
    return (dispatch) => {
      dispatch(actionCreator(...creatorArgs, (error, data) => {
        error && dispatch(notifs.notifSend({message: error.message, kind: 'danger', dismissAfter: 3000}));
        callback && callback(error, data);
      }));
    };
  };
}

export default {...rest, actions: Object.keys(rest.actions).reduce(
  (memo1, key1) => { return {...memo1, [key1]: Object.keys(rest.actions[key1]).reduce(
    (memo2, key2) => { return {...memo2, [key2]: withErrorHandler(rest.actions[key1][key2], key1+'.'+key2) }; }, {}
  )}}, {}
)};

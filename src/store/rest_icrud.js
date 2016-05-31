import {transformers} from 'redux-api';

// assumes response object has +data+ root key
export function transformer(data, prevData, action) {
  if (action && action.request) {
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
};

// assumes request object expects attributes in a +data+ root key
export const helpers = {
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

export default {transformer, helpers};

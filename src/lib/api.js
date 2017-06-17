import { merge } from 'lodash';
import fetch from 'isomorphic-fetch';
import { appName, appVersion, foodsoftUrl } from '../config';
import store from '../store';

const defaultRequestOptions = {
  headers: {
    'User-Agent': `${navigator.userAgent} ${appName}/${appVersion}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

function authOptions() {
  const accessToken = store.getState().user.accessToken;
  if (accessToken) {
    return {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      credentials: 'include'
    };
  } else {
    return {};
  }
}

export function get(endpoint) {
  return req(endpoint, {});
}

export function post(endpoint, payload = {}) {
  return req(endpoint, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function put(endpoint, payload = {}) {
  return req(endpoint, {
    method: 'PUT',
    body: JSON.stringify(payload)
  });
}

export function patch(endpoint, payload = {}) {
  return req(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function del(endpoint) {
  return req(endpoint, { method: 'DELETE' });
}

// This is where the actual request happens
function req(endpoint, options) {
  const url = (
      endpoint.startsWith('https://') ||
      endpoint.startsWith('http://')
    )
    ? endpoint
    : foodsoftUrl + endpoint;
  const fetchOptions = merge({},
    defaultRequestOptions,
    url.startsWith(foodsoftUrl) ? authOptions() : {},
    options
  );
  return fetch(url, fetchOptions)
    .then(response => {
      if (options.method === 'DELETE' && response.ok) {
        return Promise.resolve({ json: '', response });
      }
      return response.json()
        .then(json => ({ json, response }))
        .catch(e => ({ json: '', response }));
    })
    .then(({ json, response }) => {
      if (!response.ok) throw json;
      return json;
    });
}
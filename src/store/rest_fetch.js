import OAuth from '../oauth';

import {t} from 'i18n';
const T = (s, opts) => t('errors.'+s, opts);

export default function(fetch) {
  return function(url, options) {
    return fetch(url, options).then((resp) => {
      if (resp.status >= 200 && resp.status < 300) {
        if (resp.status !== 204 /* no content */) {
          return resp.json();
        }
      } else if (resp.status === 401) {
        // need (re-)authentication
        // @todo make it more flexible what to do here
        new OAuth().request();
        // unreachable code
        throw new Error(T('authentication_required'));
      } else {
        // throw error with message from json when available
        const defaultDescription = T('general', {text: resp.statusText, code: resp.status});
        return resp.json().then((json) => {
          throw new Error(json.error_description || defaultDescription);
        }, () => {
          throw new Error(defaultDescription);
        });
      }
    });
  }
}

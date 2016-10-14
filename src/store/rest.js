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
    transformer: icrud.transformer,
    helpers: {
      get: icrud.helpers.get,
    }
  },
  group_order_articles: {
    url: '/api/v1/group_order_articles/(:id)',
    transformer: icrud.transformer,
    helpers: {
      change(oa, goa, data) {
        const goa_q = data.quantity !== undefined ? data.quantity : (goa || {}).quantity;
        const goa_t = data.tolerance !== undefined ? data.tolerance : (goa || {}).tolerance;

        // @todo perhaps change api to only work with order_article_id and get rid of group_order_articles
        if (goa) {
          if (goa_q === 0 && goa_t === 0) {
            // amounts are zero, destroy it
            // (we could update it too, but the response would be that it's deleted, we can't understand that response from update)
            return icrud.helpers.destroy(goa.id, () => {
              this.dispatch(rest.actions.order_articles.get(goa.order_article_id));
            });
          } else {
            // update existing group_order_article
            return icrud.helpers.update(goa.id, data, (error) => {
              error || this.dispatch(rest.actions.order_articles.get(goa.order_article_id));
            });
          }
        } else if (goa_q > 0 || goa_t > 0) {
          // no existing group_order_article, create one
          return icrud.helpers.create({...data, order_article_id: oa.id}, (error) => {
            error || this.dispatch(rest.actions.order_articles.get(oa.id));
          });
        }
      }
    },
  }
}).use('fetch', restFetch(fetch))
  .use('options', options)
  .use('rootUrl', foodsoftUrl);

export default rest;

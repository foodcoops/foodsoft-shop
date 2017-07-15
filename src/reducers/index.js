import { combineReducers } from 'redux';

import loading from './loading';
import notifications from './notifications';
import user from './user';
import config from './config';
import filter from './filter';
import categories from './categories';
import orders from './orders';
import order_articles from './order_articles';
import group_order_articles from './group_order_articles';

export default combineReducers({
  loading,
  notifications,
  user,
  config,
  filter,
  categories,
  orders,
  order_articles,
  group_order_articles,
});

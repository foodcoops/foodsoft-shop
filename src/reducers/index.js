import { combineReducers } from 'redux';
import { reducer as notifs } from 'redux-notifications';

import loading from './loading';
import user from './user';
import filter from './filter';
import categories from './categories';
import orders from './orders';
import order_articles from './order_articles';
import group_order_articles from './group_order_articles';

export default combineReducers({
  notifs,
  loading,
  user,
  filter,
  categories,
  orders,
  order_articles,
  group_order_articles,
});

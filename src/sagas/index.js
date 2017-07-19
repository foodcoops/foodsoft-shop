import { all, fork } from 'redux-saga/effects';

import notifications from './notifications';
import user from './user';
import config from './config';
import navigation from './navigation';
import filter from './filter';
import categories from './categories';
import orders from './orders';
import orderArticles from './order_articles';
import groupOrderArticles from './group_order_articles';

export default function* rootSaga() {
  // @see https://github.com/redux-saga/redux-saga/issues/178
  // @todo all are cancelled right now if there is an error :/ - maybe use spawn()?
  yield all([
    fork(notifications),
    fork(user),
    fork(config),
    fork(navigation),
    fork(filter),
    fork(categories),
    fork(orders),
    fork(orderArticles),
    fork(groupOrderArticles),
  ]);
}

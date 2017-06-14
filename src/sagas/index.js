import { fork } from 'redux-saga/effects';

import user from './user';
import categories from './categories';
import orders from './orders';
import orderArticles from './order_articles';
import groupOrderArticles from './group_order_articles';

export default function* rootSaga() {
  // @see https://github.com/redux-saga/redux-saga/issues/178
  // @todo all are cancelled right now if there is an error :/
  yield [
    fork(user),
    fork(categories),
    fork(orders),
    fork(orderArticles),
    fork(groupOrderArticles),
  ];
}

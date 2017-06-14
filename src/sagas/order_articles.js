import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_ORDER_ARTICLES, FETCH_ORDER_ARTICLES_REQUEST, FETCH_ORDER_ARTICLES_SUCCESS, FETCH_ORDER_ARTICLES_FAILURE } from '../actions/order_articles';

function* fetchOrderArticles() {
  yield put({ type: FETCH_ORDER_ARTICLES_REQUEST });
  const r = yield call(get, `/api/v1/order_articles`);

  if (r.data) {
    yield put({ type: FETCH_ORDER_ARTICLES_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_ORDER_ARTICLES_FAILURE });
  }
}

export default function* orderArticlesSaga() {
  yield takeEvery(FETCH_ORDER_ARTICLES, fetchOrderArticles);
}

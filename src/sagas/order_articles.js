import { merge } from 'lodash';
import { stringify } from 'qs';
import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import {
  FETCH_ORDER_ARTICLES,
  FETCH_ORDER_ARTICLES_REQUEST,
  FETCH_ORDER_ARTICLES_SUCCESS,
  FETCH_ORDER_ARTICLES_FAILURE,
  FETCH_ORDER_ARTICLE,
  FETCH_ORDER_ARTICLE_REQUEST,
  FETCH_ORDER_ARTICLE_SUCCESS,
  FETCH_ORDER_ARTICLE_FAILURE
} from '../actions/order_articles';

function* fetchOrderArticles({ payload }) {
  yield put({ type: FETCH_ORDER_ARTICLES_REQUEST, payload });
  const fullPayload = merge({}, { q: { orders_state_eq: 'open' } }, payload);
  const fullQuery = fullPayload ? ('?' + stringify(fullPayload)) : '';
  try {
    const r = yield call(get, `/api/v1/order_articles${fullQuery}`);
    yield put({ type: FETCH_ORDER_ARTICLES_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_ORDER_ARTICLES_FAILURE, payload: e });
  }
}

// fetches a single order article and updates it in the current list
// not for fetching one from scratch, just for updating it
function* fetchOrderArticle({ id }) {
  yield put({ type: FETCH_ORDER_ARTICLE_REQUEST });
  try {
    const r = yield call(get, `/api/v1/order_articles/${id}`);
    yield put({ type: FETCH_ORDER_ARTICLE_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_ORDER_ARTICLE_FAILURE, payload: e });
  }
}

export default function* orderArticlesSaga() {
  yield takeEvery(FETCH_ORDER_ARTICLES, fetchOrderArticles);
  yield takeLatest(FETCH_ORDER_ARTICLE, fetchOrderArticle);
}

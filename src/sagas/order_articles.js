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

function* fetchOrderArticles() {
  yield put({ type: FETCH_ORDER_ARTICLES_REQUEST });
  const r = yield call(get, `/api/v1/order_articles`);

  if (r.data) {
    yield put({ type: FETCH_ORDER_ARTICLES_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_ORDER_ARTICLES_FAILURE });
  }
}

// fetches a single order article and updates it in the current list
// not for fetching one from scratch, just for updating it
function* fetchOrderArticle({ id }) {
  yield put({ type: FETCH_ORDER_ARTICLE_REQUEST });
  const r = yield call(get, `/api/v1/order_articles/${id}`);

  if (r.data) {
    yield put({ type: FETCH_ORDER_ARTICLE_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_ORDER_ARTICLE_FAILURE });
  }
}

export default function* orderArticlesSaga() {
  yield takeEvery(FETCH_ORDER_ARTICLES, fetchOrderArticles);
  yield takeEvery(FETCH_ORDER_ARTICLE, fetchOrderArticle);
}

import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get, patch } from '../lib/api';

import {
  FETCH_GROUP_ORDER_ARTICLES,
  FETCH_GROUP_ORDER_ARTICLES_REQUEST,
  FETCH_GROUP_ORDER_ARTICLES_SUCCESS,
  FETCH_GROUP_ORDER_ARTICLES_FAILURE,
  UPDATE_GROUP_ORDER_ARTICLE,
  UPDATE_GROUP_ORDER_ARTICLE_REQUEST,
  UPDATE_GROUP_ORDER_ARTICLE_SUCCESS,
  UPDATE_GROUP_ORDER_ARTICLE_FAILURE
} from '../actions/group_order_articles';

function* fetchGroupOrderArticles() {
  yield put({ type: FETCH_GROUP_ORDER_ARTICLES_REQUEST });
  const r = yield call(get, '/api/v1/group_order_articles?per_page=-1'); // get all items

  if (r.data) {
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_FAILURE });
  }
}

function* updateGroupOrderArticle({ id, payload }) {
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_REQUEST, id, payload });
  const r = yield call(patch, `/api/v1/group_order_articles/${id}`, {data: payload});

  if (r.data) {
    yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_SUCCESS, payload: r });
  } else {
    yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_FAILURE });
  }
}

export default function* groupOrderArticlesSaga() {
  yield takeEvery(FETCH_GROUP_ORDER_ARTICLES, fetchGroupOrderArticles);
  yield takeLatest(UPDATE_GROUP_ORDER_ARTICLE, updateGroupOrderArticle);
}

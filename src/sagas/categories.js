import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_CATEGORIES, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from '../actions/categories';

function* fetchCategories(params) {
  yield put({ type: FETCH_CATEGORIES_REQUEST });
  const r = yield call(get, `/api/v1/article_categories?q[orders_state_eq]=open`);

  if (r.data) {
    yield put({ type: FETCH_CATEGORIES_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_CATEGORIES_FAILURE });
  }
}

export default function* categoriesSaga() {
  yield takeEvery(FETCH_CATEGORIES, fetchCategories);
}

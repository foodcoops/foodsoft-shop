import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_CATEGORIES, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from '../actions/categories';

function* fetchCategories(params) {
  yield put({ type: FETCH_CATEGORIES_REQUEST });
  try {
    const r = yield call(get, `/api/v1/article_categories?q[orders_state_eq]=open`);
    yield put({ type: FETCH_CATEGORIES_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_CATEGORIES_FAILURE, payload: e });
  }
}

export default function* categoriesSaga() {
  yield takeEvery(FETCH_CATEGORIES, fetchCategories);
}

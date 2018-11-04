import { stringify } from 'qs';
import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_CATEGORIES, FETCH_CATEGORIES_REQUEST, FETCH_CATEGORIES_SUCCESS, FETCH_CATEGORIES_FAILURE } from '../actions/categories';

function* fetchCategories({ payload }) {
  yield put({ type: FETCH_CATEGORIES_REQUEST, payload });
  const query = payload ? ('?' + stringify(payload)) : '';
  try {
    const r = yield call(get, `/api/v1/article_categories${query}`);
    yield put({ type: FETCH_CATEGORIES_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_CATEGORIES_FAILURE, payload: e });
  }
}

export default function* categoriesSaga() {
  yield takeEvery(FETCH_CATEGORIES, fetchCategories);
}

import { call, put, fork, select, takeEvery, takeLatest } from 'redux-saga/effects';

import { REPLACE_FILTER, UPDATE_FILTER } from '../actions/filter';
import { FETCH_ORDER_ARTICLES } from '../actions/order_articles';

function* applyFilter() {
  const { page, search, ...otherFilter } = yield select(state => state.filter);

  const searchFilter = search ? {article_name_or_article_note_or_article_manufacturer_cont: search} : {};
  const filter = {...searchFilter, ...otherFilter};
  const params = page ? {q: filter, page} : {q: filter};

  yield put({ type: FETCH_ORDER_ARTICLES, payload: params });
}

export default function* filterSaga() {
  // @todo takeLatest of any of these
  yield takeLatest(REPLACE_FILTER, applyFilter);
  yield takeLatest(UPDATE_FILTER, applyFilter);
}

import { call, put, race, select, take, takeEvery, takeLatest } from 'redux-saga/effects';

import { REPLACE_FILTER, REPLACE_FILTER_SUCCESS } from '../actions/filter';
import { FETCH_ORDER_ARTICLES, FETCH_ORDER_ARTICLES_SUCCESS } from '../actions/order_articles';

function fetchAction(newFilter) {
  const { page, search, ...otherFilter } = newFilter;

  const searchFilter = search ? { article_name_or_article_note_or_article_manufacturer_cont: search } : {};
  const filter = { ...searchFilter, ...otherFilter };
  const params = page ? { q: filter, page } : { q: filter };

  return { type: FETCH_ORDER_ARTICLES, payload: params };
}

function *replaceFilter(action) {
  const newFilter = action.payload;

  yield put(fetchAction(newFilter));
  yield take(FETCH_ORDER_ARTICLES_SUCCESS);
  yield put({ type: REPLACE_FILTER_SUCCESS, payload: newFilter });
}

export default function* filterSaga() {
  yield takeLatest(REPLACE_FILTER, replaceFilter);
}

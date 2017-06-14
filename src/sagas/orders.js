import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_ORDERS, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE } from '../actions/orders';

function* fetchOrders() {
  yield put({ type: FETCH_ORDERS_REQUEST });
  const r = yield call(get, `/api/v1/orders`);

  if (r.data) {
    yield put({ type: FETCH_ORDERS_SUCCESS, payload: r });
  } else {
    yield put({ type: FETCH_ORDERS_FAILURE });
  }
}

export default function* ordersSaga() {
  yield takeEvery(FETCH_ORDERS, fetchOrders);
}

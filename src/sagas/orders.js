import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_ORDERS, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE } from '../actions/orders';

function* fetchOrders() {
  yield put({ type: FETCH_ORDERS_REQUEST });
  try {
    const r = yield call(get, `/api/v1/orders?q[state_eq]=open`);
    yield put({ type: FETCH_ORDERS_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_ORDERS_FAILURE, payload: e });
  }
}

export default function* ordersSaga() {
  yield takeLatest(FETCH_ORDERS, fetchOrders);
}

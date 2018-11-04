import { stringify } from 'qs';
import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import { FETCH_ORDERS, FETCH_ORDERS_REQUEST, FETCH_ORDERS_SUCCESS, FETCH_ORDERS_FAILURE } from '../actions/orders';

function* fetchOrders({ payload }) {
  yield put({ type: FETCH_ORDERS_REQUEST, payload });
  const query = payload ? ('?' + stringify(payload)) : '';
  try {
    const r = yield call(get, `/api/v1/orders${query}`);
    yield put({ type: FETCH_ORDERS_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_ORDERS_FAILURE, payload: e });
  }
}

export default function* ordersSaga() {
  yield takeLatest(FETCH_ORDERS, fetchOrders);
}

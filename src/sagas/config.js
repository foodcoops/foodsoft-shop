import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../lib/api';

import { FETCH_CONFIG, FETCH_CONFIG_REQUEST, FETCH_CONFIG_SUCCESS, FETCH_CONFIG_FAILURE } from '../actions/config';

function* fetchConfig() {
  yield put({ type: FETCH_CONFIG_REQUEST });
  try {
    const r = yield call(api.get, `/api/v1/config`);
    yield put({ type: FETCH_CONFIG_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_CONFIG_FAILURE, payload: e });
  }
}

export default function* configSaga() {
  yield takeLatest(FETCH_CONFIG, fetchConfig);
}

import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../lib/api';

import { FETCH_NAVIGATION, FETCH_NAVIGATION_REQUEST, FETCH_NAVIGATION_SUCCESS, FETCH_NAVIGATION_FAILURE } from '../actions/navigation';

function* fetchNavigation() {
  yield put({ type: FETCH_NAVIGATION_REQUEST });
  try {
    const r = yield call(api.get, `/api/v1/navigation`);
    yield put({ type: FETCH_NAVIGATION_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_NAVIGATION_FAILURE, payload: e });
  }
}

export default function* configSaga() {
  yield takeLatest(FETCH_NAVIGATION, fetchNavigation);
}

import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { get } from '../lib/api';

import {
  FETCH_CURRENT_USER,
  FETCH_CURRENT_USER_REQUEST,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_FAILURE
} from '../actions/user';

function* fetchCurrentUser() {
  yield put({ type: FETCH_CURRENT_USER_REQUEST });
  try {
    const r = yield call(get, `/api/v1/user`);
    yield put({ type: FETCH_CURRENT_USER_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_CURRENT_USER_FAILURE, payload: e });
  }
}

export default function* userSaga() {
  // yield takeEvery(LOGIN, login);
  // yield takeEvery(LOGOUT, logout);
  yield takeEvery(FETCH_CURRENT_USER, fetchCurrentUser);
}

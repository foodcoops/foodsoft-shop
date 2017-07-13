import { delay } from 'redux-saga';
import { call, put, fork, takeEvery, takeLatest } from 'redux-saga/effects';
import { NOTIFICATION, NOTIFICATION_SHOW, NOTIFICATION_HIDE } from '../actions/notifications';

let lastId = 0;

function* notify(action) {
  const id = lastId++;
  yield put({ type: NOTIFICATION_SHOW, payload: { ...action.payload, id } });
  yield call(delay, 3000);
  yield put({ type: NOTIFICATION_HIDE, payload: { id } });
}

export default function* notificationSaga() {
  yield takeEvery(NOTIFICATION, notify);
}

import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { get, patch } from '../lib/api';

import {
  FETCH_GROUP_ORDER_ARTICLES,
  FETCH_GROUP_ORDER_ARTICLES_REQUEST,
  FETCH_GROUP_ORDER_ARTICLES_SUCCESS,
  FETCH_GROUP_ORDER_ARTICLES_FAILURE,
  UPDATE_GROUP_ORDER_ARTICLE,
  UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST,
  UPDATE_GROUP_ORDER_ARTICLE_REQUEST,
  UPDATE_GROUP_ORDER_ARTICLE_SUCCESS,
  UPDATE_GROUP_ORDER_ARTICLE_FAILURE
} from '../actions/group_order_articles';
import {
  FETCH_ORDER_ARTICLE,
  INTERNAL_UPDATE_ORDER_ARTICLE_OPTIMIST
} from '../actions/order_articles';

function* fetchGroupOrderArticles() {
  yield put({ type: FETCH_GROUP_ORDER_ARTICLES_REQUEST });
  try {
    const r = yield call(get, '/api/v1/group_order_articles?per_page=-1'); // get all items
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_FAILURE, payload: e });
  }
}

function* updateGroupOrderArticle({ id, payload }) {
  // first do optimistic update
  const goaOld = yield select(state => state.group_order_articles.data.find(o => o.id === id));
  const order_article_id = goaOld.order_article_id;
  const oaOld  = yield select(state => state.order_articles.data.find(o => o.id === order_article_id));
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST, id, payload });
  const goaNew = yield select(state => state.group_order_articles.data.find(o => o.id === id));
  // also update order_article totals
  // @todo do not use delta, as repetition can cause an optimistic update to be lost
  yield put({ type: INTERNAL_UPDATE_ORDER_ARTICLE_OPTIMIST, id: order_article_id, payload: {
    delta: {
      quantity: goaNew.quantity - goaOld.quantity,
      tolerance: goaNew.tolerance - goaOld.tolerance
    }
  }});
  // now that order_article is updated, update group_order_article result
  const oaNew  = yield select(state => state.order_articles.data.find(o => o.id === order_article_id))
  const result = goaOld.result + (oaNew.units_to_order - oaOld.units_to_order) * oaNew.article.unit_quantity;
  const total_price = goaNew.quantity * (goaOld.total_price / goaOld.quantity); // derive price from previous sum :/
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST, id, payload: { result, total_price } });

  // then perform _debounced_ update at remote end
  yield call(delay, 800);
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_REQUEST, id, payload });
  const r = yield call(patch, `/api/v1/group_order_articles/${id}`, { data: payload });

  try {
    yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_SUCCESS, payload: r });
    // also fetch order_article, just to be sure
    // (algorithm on server may be slightly different than optimistic update here)
    yield put({ type: FETCH_ORDER_ARTICLE, id: r.data.order_article_id });
  } catch(e) {
    yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_FAILURE, payload: e });
  }
}

export default function* groupOrderArticlesSaga() {
  yield takeEvery(FETCH_GROUP_ORDER_ARTICLES, fetchGroupOrderArticles);
  yield takeLatest(UPDATE_GROUP_ORDER_ARTICLE, updateGroupOrderArticle);
}

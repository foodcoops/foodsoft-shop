import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import api from '../lib/api';

import {
  FETCH_GROUP_ORDER_ARTICLES,
  FETCH_GROUP_ORDER_ARTICLES_REQUEST,
  FETCH_GROUP_ORDER_ARTICLES_SUCCESS,
  FETCH_GROUP_ORDER_ARTICLES_FAILURE,
  CREATE_GROUP_ORDER_ARTICLE,
  CREATE_GROUP_ORDER_ARTICLE_OPTIMIST,
  CREATE_GROUP_ORDER_ARTICLE_REQUEST,
  CREATE_GROUP_ORDER_ARTICLE_SUCCESS,
  CREATE_GROUP_ORDER_ARTICLE_FAILURE,
  UPDATE_GROUP_ORDER_ARTICLE,
  UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST,
  UPDATE_GROUP_ORDER_ARTICLE_REQUEST,
  UPDATE_GROUP_ORDER_ARTICLE_SUCCESS,
  UPDATE_GROUP_ORDER_ARTICLE_FAILURE
} from '../actions/group_order_articles';
import {
  FETCH_ORDER_ARTICLE,
  FETCH_ORDER_ARTICLE_SUCCESS,
  INTERNAL_UPDATE_ORDER_ARTICLE_OPTIMIST
} from '../actions/order_articles';

function* fetchGroupOrderArticles() {
  yield put({ type: FETCH_GROUP_ORDER_ARTICLES_REQUEST });
  try {
    const r = yield call(api.get, '/api/v1/group_order_articles?per_page=-1'); // get all items
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: FETCH_GROUP_ORDER_ARTICLES_FAILURE, payload: e });
  }
}

let lastOptimistId = 1;
function* createGroupOrderArticle({ payload }) {
  // first do optimistc update
  const id = `optimist:${lastOptimistId++}`;
  const order_article_id = payload.order_article_id;
  const oaOld  = yield select(state => state.order_articles.data.find(o => o.id === order_article_id));
  yield put({ type: CREATE_GROUP_ORDER_ARTICLE_OPTIMIST, payload: { ...payload, id } });
  const goaNew = payload;
  // also update order_article totals
  yield put({ type: INTERNAL_UPDATE_ORDER_ARTICLE_OPTIMIST, id: order_article_id, payload: {
    delta: {
      quantity: payload.quantity || 0,
      tolerance: payload.tolerance || 0
    }
  }});
  // now that order_article is updated, update group_order_article result
  const oaNew  = yield select(state => state.order_articles.data.find(o => o.id === order_article_id))
  const result = (oaNew.units_to_order - oaOld.units_to_order) * oaNew.article.unit_quantity;
  const total_price = goaNew.quantity * oaNew.price;
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST, id, payload: { result, total_price } });

  // don't debounce since the buttons are disabled until we have an id
  yield put({ type: CREATE_GROUP_ORDER_ARTICLE_REQUEST, id, payload });
  const r = yield call(api.post, '/api/v1/group_order_articles', { group_order_article: payload });

  try {
    yield put({ type: CREATE_GROUP_ORDER_ARTICLE_SUCCESS, payload: r, id });
    // also update order_article that is received along with the group_order_article
    yield put({ type: FETCH_ORDER_ARTICLE_SUCCESS, payload: r });
  } catch(e) {
    yield put({ type: CREATE_GROUP_ORDER_ARTICLE_FAILURE, payload: e, id });
    // @todo re-fetch (all?) goas to get consistent state
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
  const total_price = goaNew.quantity * oaNew.price;
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_OPTIMIST, id, payload: { result, total_price } });

  // then perform _debounced_ update at remote end
  const del = goaNew.quantity === 0 && goaNew.tolerance === 0;
  yield call(delay, 800);
  yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_REQUEST, id, payload, del })
  try {
    if (del) {
      const r = yield call(api.del, `/api/v1/group_order_articles/${id}`);
      yield put({ type: FETCH_ORDER_ARTICLE_SUCCESS, payload: r });
      yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_SUCCESS, payload: { group_order_article: { id } }, del });
    } else {
      const r = yield call(api.patch, `/api/v1/group_order_articles/${id}`, { group_order_article: payload });
      yield put({ type: FETCH_ORDER_ARTICLE_SUCCESS, payload: r });
      yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_SUCCESS, payload: r, del });
    }
  } catch(e) {
    yield put({ type: UPDATE_GROUP_ORDER_ARTICLE_FAILURE, payload: e, del });
    // @todo re-fetch (all?) goas to get consistent state
  }
}

export default function* groupOrderArticlesSaga() {
  yield takeEvery(FETCH_GROUP_ORDER_ARTICLES, fetchGroupOrderArticles);
  yield takeEvery(CREATE_GROUP_ORDER_ARTICLE, createGroupOrderArticle);
  yield takeLatest(UPDATE_GROUP_ORDER_ARTICLE, updateGroupOrderArticle);
}

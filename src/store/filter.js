// Redux store for selected filter
import {stringify} from 'qs';
import rest from './rest';

/** Actions **/

const syncOrderArticles = (dispatch, getState) => {
  const {page, ...filter} = getState().filter;
  const params = page ? {q: filter, page} : {q: filter};
  // @todo something like window.location.hash = '?' + stringify(filter);
  dispatch(rest.actions.order_articles.reset('sync'));
  dispatch(rest.actions.order_articles.sync(params));
};

const clear = () => replace({});

const replace = (filter) => (dispatch, getState) => {
  dispatch({type: 'REPLACE_FILTER', data: filter});
  syncOrderArticles(dispatch, getState);
};

const update = (filter = {}) => (dispatch, getState) => {
  dispatch({type: 'UPDATE_FILTER', data: filter});
  syncOrderArticles(dispatch, getState);
};

export const actions = {clear, replace, update};

/** Reducer **/

const initialState = {};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REPLACE_FILTER':
      return action.data;
    case 'UPDATE_FILTER':
      return {...state, ...action.data};
    default:
      return state;
  }
}

export default {actions, reducer};

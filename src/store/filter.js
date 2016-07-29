// Redux store for selected filter
import {stringify} from 'qs';
import rest from './rest';

/** Actions **/

const syncOrderArticles = (dispatch, state, action) => {
  // get filter after action (but don't update it yet)
  //   we use +state.filter+ here because state is the _full_ state (not just the filter)
  //   this makes it required to mount this store on +filter+.
  const {page, search, ...otherFilter} = reducer(state.filter || {}, action);
  const searchFilter = search ? {article_name_or_article_note_or_article_manufacturer_cont: search} : {};
  const filter = {...searchFilter, ...otherFilter};
  const params = page ? {q: filter, page} : {q: filter};

  // @todo something like window.location.hash = '?' + stringify(filter);
  dispatch(rest.actions.order_articles.reset('sync'));
  dispatch(rest.actions.order_articles.sync(params)).then(() => {
    // on success, update filter
    dispatch(action);
  });
};

const clear = () => replace({});

const replace = (filter) => (dispatch, getState) => {
  syncOrderArticles(dispatch, getState(), {type: 'REPLACE_FILTER', data: filter});
};

const update = (filter = {}) => (dispatch, getState) => {
  syncOrderArticles(dispatch, getState(), {type: 'UPDATE_FILTER', data: filter});
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

// need to expose this store as +filter+ (see above)
export default {actions, reducer};

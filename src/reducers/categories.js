import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE
} from '../actions/categories';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export default function orders(state = initialState, action) {
  switch(action.type) {
    case FETCH_CATEGORIES_REQUEST:
      return { ...state, data: [], total: 0, loading: true };
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        data: action.payload.article_categories,
        total: action.payload.article_categories.length, // server supplies all items
        loading: false
      };
    case FETCH_CATEGORIES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

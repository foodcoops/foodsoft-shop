import {
  FETCH_ORDER_ARTICLES_REQUEST,
  FETCH_ORDER_ARTICLES_SUCCESS,
  FETCH_ORDER_ARTICLES_FAILURE
} from '../actions/order_articles';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export default function order_articles(state = initialState, action) {
  switch(action.type) {
    case FETCH_ORDER_ARTICLES_REQUEST:
      return { ...state, data: [], total: 0, loading: true };
    case FETCH_ORDER_ARTICLES_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.meta.total_count,
        pages: action.payload.meta.total_pages,
        loading: false
      };
    case FETCH_ORDER_ARTICLES_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

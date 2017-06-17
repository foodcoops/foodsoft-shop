import {
  FETCH_ORDER_ARTICLES_REQUEST,
  FETCH_ORDER_ARTICLES_SUCCESS,
  FETCH_ORDER_ARTICLES_FAILURE,
  FETCH_ORDER_ARTICLE_REQUEST,
  FETCH_ORDER_ARTICLE_SUCCESS,
  FETCH_ORDER_ARTICLE_FAILURE
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
    case FETCH_ORDER_ARTICLE_FAILURE:
      return { ...state, loading: false };
    case FETCH_ORDER_ARTICLES_REQUEST:
      return { ...state, loading: true };
    case FETCH_ORDER_ARTICLE_SUCCESS:
      const newItem = action.payload.data;
      const data = state.data.map(o => o.id === newItem.id ? newItem : o);
      return { ...state, data, loading: false };
    default:
      return state;
  }
}

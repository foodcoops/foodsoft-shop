import {
  FETCH_GROUP_ORDER_ARTICLES_REQUEST,
  FETCH_GROUP_ORDER_ARTICLES_SUCCESS,
  FETCH_GROUP_ORDER_ARTICLES_FAILURE,
  UPDATE_GROUP_ORDER_ARTICLE_REQUEST,
  UPDATE_GROUP_ORDER_ARTICLE_SUCCESS,
  UPDATE_GROUP_ORDER_ARTICLE_FAILURE
} from '../actions/group_order_articles';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export default function group_order_articles(state = initialState, action) {
  switch(action.type) {
    case FETCH_GROUP_ORDER_ARTICLES_REQUEST:
      return { ...state, data: [], total: 0, loading: true };
    case FETCH_GROUP_ORDER_ARTICLES_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.data.length, // no meta because per_page=-1
        loading: false
      };
    case FETCH_GROUP_ORDER_ARTICLES_FAILURE:
    case UPDATE_GROUP_ORDER_ARTICLE_FAILURE:
      return { ...state, loading: false };
    case UPDATE_GROUP_ORDER_ARTICLE_REQUEST:
      return { ...state, loading: true };
    case UPDATE_GROUP_ORDER_ARTICLE_SUCCESS:
      const newItem = action.payload.data;
      const data = state.data.map((o) => o.id === newItem.id ? newItem : o);
      return { ...state, data, loading: false };
    default:
      return state;
  }
}

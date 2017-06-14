import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_SUCCESS,
  FETCH_ORDERS_FAILURE
} from '../actions/orders';

const initialState = {
  data: [],
  total: 0,
  loading: false,
};

export default function orders(state = initialState, action) {
  switch(action.type) {
    case FETCH_ORDERS_REQUEST:
      return { ...state, data: [], total: 0, loading: true };
    case FETCH_ORDERS_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        total: action.payload.meta.total_count,
        pages: action.payload.meta.total_pages,
        loading: false
      };
    case FETCH_ORDERS_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

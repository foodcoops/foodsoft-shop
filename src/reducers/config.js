import {
  FETCH_CONFIG_REQUEST,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_FAILURE
} from '../actions/config';

const initialState = {
  data: {},
  loading: false,
};

export default function config(state = initialState, action) {
  switch(action.type) {
    case FETCH_CONFIG_REQUEST:
      return { ...state, data: {}, loading: true };
    case FETCH_CONFIG_SUCCESS:
      return { ...state, data: action.payload.data, loading: false };
    case FETCH_CONFIG_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

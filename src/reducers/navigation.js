import {
  FETCH_NAVIGATION_REQUEST,
  FETCH_NAVIGATION_SUCCESS,
  FETCH_NAVIGATION_FAILURE
} from '../actions/navigation';

const initialState = {
  data: [],
  loading: false,
};

export default function config(state = initialState, action) {
  switch(action.type) {
    case FETCH_NAVIGATION_REQUEST:
      return { ...state, data: [], loading: true };
    case FETCH_NAVIGATION_SUCCESS:
      return { ...state, data: action.payload.data, loading: false };
    case FETCH_NAVIGATION_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

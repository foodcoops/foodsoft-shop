import {
  LOGIN_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
  LOGOUT_REQUEST,
  LOGOUT_FAILURE,
  FETCH_CURRENT_USER_REQUEST,
  FETCH_CURRENT_USER_SUCCESS,
  FETCH_CURRENT_USER_FAILURE,
  GET_ACCESS_TOKEN_SUCCESS
} from '../actions/user';

const initialState = {
  id: null,
  name: '',
  email: '',
  loading: false,
  loggedIn: false,
  accessToken: null
};

export default function user(state = initialState, action) {
  switch(action.type) {
    case GET_ACCESS_TOKEN_SUCCESS:
      return { ...state, loggedIn: true, accessToken: action.payload };
    case FETCH_CURRENT_USER_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, loading: true };
    case LOGIN_SUCCESS:
      return { ...action.payload.user, loading: false, loggedIn: true };
    case FETCH_CURRENT_USER_SUCCESS:
      return { ...state, ...action.payload.user, loading: false, loggedIn: true };
    case FETCH_CURRENT_USER_FAILURE:
    case LOGIN_FAILURE:
      return { ...initialState, loading: false };
    case LOGOUT_REQUEST:
    case LOGOUT_SUCCESS:
      return { ...initialState };
    case LOGOUT_FAILURE:
      return { ...state, loading: false };
    default:
      return state;
  }
}

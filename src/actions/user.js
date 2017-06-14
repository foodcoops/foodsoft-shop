export const LOGIN = 'LOGIN';
export const LOGIN_REQUEST = `${LOGIN}_REQUEST`;
export const LOGIN_SUCCESS = `${LOGIN}_SUCCESS`;
export const LOGIN_FAILURE = `${LOGIN}_FAILURE`;

export const LOGOUT = 'LOGOUT';
export const LOGOUT_REQUEST = `${LOGOUT}_REQUEST`;
export const LOGOUT_SUCCESS = `${LOGOUT}_SUCCESS`;
export const LOGOUT_FAILURE = `${LOGOUT}_FAILURE`;

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const FETCH_CURRENT_USER_REQUEST = `${FETCH_CURRENT_USER}_REQUEST`;
export const FETCH_CURRENT_USER_SUCCESS = `${FETCH_CURRENT_USER}_SUCCESS`;
export const FETCH_CURRENT_USER_FAILURE = `${FETCH_CURRENT_USER}_FAILURE`;

export const GET_ACCESS_TOKEN_SUCCESS = 'GET_ACCESS_TOKEN_SUCCESS';

// @todo login + logout

export function fetchCurrentUser() {
  return { type: FETCH_CURRENT_USER };
}

export function setAccessToken(accessToken) {
  return { type: GET_ACCESS_TOKEN_SUCCESS, payload: accessToken };
}
export const FETCH_CONFIG = 'FETCH_CONFIG';
export const FETCH_CONFIG_REQUEST = `${FETCH_CONFIG}_REQUEST`;
export const FETCH_CONFIG_SUCCESS = `${FETCH_CONFIG}_SUCCESS`;
export const FETCH_CONFIG_FAILURE = `${FETCH_CONFIG}_FAILURE`;

export function fetchConfig() {
  return { type: FETCH_CONFIG };
}

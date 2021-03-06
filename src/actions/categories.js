export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';
export const FETCH_CATEGORIES_REQUEST = `${FETCH_CATEGORIES}_REQUEST`;
export const FETCH_CATEGORIES_SUCCESS = `${FETCH_CATEGORIES}_SUCCESS`;
export const FETCH_CATEGORIES_FAILURE = `${FETCH_CATEGORIES}_FAILURE`;

export function fetchCategories(query) {
  return { type: FETCH_CATEGORIES, payload: { q: query } };
}

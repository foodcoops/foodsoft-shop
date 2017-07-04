export const REPLACE_FILTER = 'REPLACE_FILTER';
export const REPLACE_FILTER_SUCCESS = 'CHANGE_FILTER_SUCCESS';

export function replaceFilter(filter) {
  return { type: REPLACE_FILTER, payload: filter };
}

export function clearFilter() {
  return { type: REPLACE_FILTER, payload: {} };
}

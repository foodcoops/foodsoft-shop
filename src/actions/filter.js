export const REPLACE_FILTER = 'REPLACE_FILTER';
export const UPDATE_FILTER = 'REPLACE_FILTER';

export function replaceFilter(filter) {
  return { type: REPLACE_FILTER, payload: filter };
}

export function updateFilter(filter) {
  return { type: UPDATE_FILTER, payload: filter };
}

export function clearFilter() {
  return { type: REPLACE_FILTER, payload: {} };
}

export const FETCH_ORDERS = 'FETCH_ORDERS';
export const FETCH_ORDERS_REQUEST = `${FETCH_ORDERS}_REQUEST`;
export const FETCH_ORDERS_SUCCESS = `${FETCH_ORDERS}_SUCCESS`;
export const FETCH_ORDERS_FAILURE = `${FETCH_ORDERS}_FAILURE`;

export function fetchOrders() {
  return { type: FETCH_ORDERS };
}

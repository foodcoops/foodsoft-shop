export const NOTIFICATION = 'NOTIFICATION';
export const NOTIFICATION_SHOW = `${NOTIFICATION}_SHOW`;
export const NOTIFICATION_HIDE = `${NOTIFICATION}_HIDE`;

export function notify(message, opts) {
  return { type: NOTIFICATION, payload: { message, ...opts } };
}

export function success(message, opts) {
  return notify(message, { kind: 'success', ...opts });
}

export function info(message, opts) {
  return notify(message, { kind: 'info', ...opts });
}

export function warning(message, opts) {
  return notify(message, { kind: 'warning', ...opts });
}

export function danger(message, opts) {
  return notify(message, { kind: 'danger', ...opts });
}

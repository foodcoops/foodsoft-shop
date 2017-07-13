import {
  NOTIFICATION_SHOW,
  NOTIFICATION_HIDE
} from '../actions/notifications';

const initialState = [];

export default function notifications(state = initialState, action) {
  switch(action.type) {
    case NOTIFICATION_SHOW:
      // if message was found before, replace old one with new
      const i = state.findIndex(o => o.message === action.payload.message);
      if (i >= 0) {
        return [].concat(state.slice(0, i), [action.payload], state.slice(i+1));
      } else {
        return [].concat(state, [action.payload]);
      }
    case NOTIFICATION_HIDE:
      // remove indicated id
      return state.filter(o => o.id !== action.payload.id);
    default:
      return state;
  }
}

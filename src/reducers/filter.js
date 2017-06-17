import {
  REPLACE_FILTER,
  UPDATE_FILTER
} from '../actions/filter';

const initialState = {};

export default function filter(state = initialState, action) {
  switch (action.type) {
    case REPLACE_FILTER:
      return action.payload;
    case UPDATE_FILTER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

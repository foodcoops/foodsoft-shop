import {
  REPLACE_FILTER,
  REPLACE_FILTER_SUCCESS
} from '../actions/filter';

const initialState = {};

export default function filter(state = initialState, action) {
  switch (action.type) {
    case REPLACE_FILTER_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}

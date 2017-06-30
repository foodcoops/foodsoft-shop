
import { UPDATE_LOADING } from '../actions/loading';

const initialState = false;

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOADING:
      return action.payload;
    default:
      return state;
  }
}

const initialState = {};

export default function filter(state = initialState, action) {
  switch (action.type) {
    case 'REPLACE_FILTER':
      return action.data;
    case 'UPDATE_FILTER':
      return { ...state, ...action.data };
    default:
      return state;
  }
}

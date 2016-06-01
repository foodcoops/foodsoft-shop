import rest from './rest';

const initialState = false;

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE':
      return action.data;
    default:
      return state;
  }
};

export const update = (newState) => {
  return {type: 'UPDATE', data: newState};
};

export const getListener = store => () => {
  const state = store.getState();
  const loading = Object.keys(rest.reducers).reduce((memo, key) => memo || state[key].loading, false);
  loading === state.loading || store.dispatch(update(loading));
};

export default {getListener, reducer};

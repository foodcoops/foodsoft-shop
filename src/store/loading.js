import { UPDATE_LOADING } from '../actions/loading';

export default function getLoadingListener(store) {
  return function() {
    const state = store.getState();
    const loading = Object.keys(state).reduce((memo, key) => memo || (key !== 'loading' && state[key].loading), false);
    loading === state.loading || store.dispatch({ type: UPDATE_LOADING, payload: loading });
  }
}

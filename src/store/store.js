import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rest from './rest';
import {reducer as loading, getListener as getLoadingListener} from './loading';
import {reducer as filter} from './filter';
import {reducer as notifs, actions as notifActions} from 'redux-notifications';

// show notification on redux-api errors
const errorNotif = store => next => action => {
  if (/^@@redux-api@.*_fail/.test(action.type)) {
     const { error } = action;
     error && next(notifActions.notifSend({message: error.message, kind: 'danger', dismissAfter: 3000}));
  }
  return next(action);
};

const createStoreWithMiddleware = applyMiddleware(errorNotif, thunk)(createStore);
const reducer = combineReducers({...rest.reducers, filter, notifs, loading});
const store = createStoreWithMiddleware(reducer);
store.subscribe(getLoadingListener(store));

export default store;

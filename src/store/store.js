import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rest from './rest';
import {reducer as filter} from './filter';
import {reducer as notifs} from 're-notif';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers({...rest.reducers, filter, notifs});
const store = createStoreWithMiddleware(reducer);

export default store;

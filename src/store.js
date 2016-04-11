import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rest from './rest';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers(rest.reducers);
const store = createStoreWithMiddleware(reducer);

export default store;

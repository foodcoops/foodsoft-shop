import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import rest from './rest';
import {reducer as filter} from './filter';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
const reducer = combineReducers({...rest.reducers, filter});
const store = createStoreWithMiddleware(reducer);

export default store;

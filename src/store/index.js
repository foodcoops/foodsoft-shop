import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { END } from 'redux-saga';
import rootReducer from '../reducers';
import getLoadingListener from './loading';
import { isDev } from '../config';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (isDev) {
  // require inside conditional to allow file-size reduction in production
  const createLogger = require('redux-logger').createLogger;
  const logger = createLogger();
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

store.runSaga = sagaMiddleware.run;
store.close = () => store.dispatch(END);

store.subscribe(getLoadingListener(store));

export default store;

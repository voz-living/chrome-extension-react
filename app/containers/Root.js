import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import App from './App';
import reducer from '../reducers';

const logger = createLogger({
  level: 'log',
});

const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);

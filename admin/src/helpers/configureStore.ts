import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Map } from 'immutable';

import rootReducer from '../state/reducers';

const configureStore = () => {
  const initialStoreState = Map();

  const enhancers = [];
  const middlewares = [
    thunkMiddleware,
  ];

  const storeEnhancers = compose(
    applyMiddleware(...middlewares),
    ...enhancers,
  );

  const store = createStore(
    rootReducer,
    initialStoreState,
    storeEnhancers,
  );

  return store;
};

export default configureStore;

export const store = configureStore();

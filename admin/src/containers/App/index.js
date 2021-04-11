/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Provider } from 'react-redux';

import { store } from "../../helpers/configureStore";
import Main from '../Main';

const App = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

export default App;

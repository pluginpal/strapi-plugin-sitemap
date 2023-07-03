/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Provider } from 'react-redux';
import { CheckPagePermissions } from '@strapi/helper-plugin';

import { store } from '../../helpers/configureStore';
import pluginPermissions from '../../permissions';
import Main from '../Main';

const App = () => {
  return (
    <CheckPagePermissions permissions={pluginPermissions.settings}>
      <Provider store={store}>
        <Main />
      </Provider>
    </CheckPagePermissions>
  );
};

export default App;

/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from '@strapi/helper-plugin';
import { useDispatch } from 'react-redux';

import pluginId from '../../helpers/pluginId';
import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import ContainerFluid from '../../components/Container';
import CollectionURLs from '../../screens/CollectionURLs';
import CustomURLs from '../../screens/CustomURLs';
import Settings from '../../screens/Settings';
import { getContentTypes, getSettings, hasSitemap } from '../../state/actions/Sitemap';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
    dispatch(getContentTypes());
    dispatch(hasSitemap());
  }, [dispatch]);

  return (
    <ContainerFluid>
      <Header />
      <Tabs />
      <Switch>
        <Route path={`/plugins/${pluginId}/url-patterns`} component={CollectionURLs} exact />
        <Route path={`/plugins/${pluginId}/custom-urls`} component={CustomURLs} exact />
        <Route path={`/plugins/${pluginId}/settings`} component={Settings} exact />
        <Route component={NotFound} />
      </Switch>
    </ContainerFluid>
  );
};

export default App;

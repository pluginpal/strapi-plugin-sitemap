/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Info from '../../components/Info';

import { getAllowedFields, getContentTypes, getSettings, hasSitemap } from '../../state/actions/Sitemap';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSettings());
    dispatch(getContentTypes());
    dispatch(hasSitemap());
    dispatch(getAllowedFields());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Info />
      <Tabs />
    </div>
  );
};

export default App;

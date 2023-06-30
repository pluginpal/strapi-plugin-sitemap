/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNotification } from '@strapi/helper-plugin';

import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Info from '../../components/Info';

import { getAllowedFields, getContentTypes, getSettings, getSitemapInfo, getLanguages } from '../../state/actions/Sitemap';
import Loader from '../../components/Loader';

const App = () => {
  const loading = useSelector((state) => state.getIn(['sitemap', 'loading'], false));

  const dispatch = useDispatch();
  const toggleNotification = useNotification();

  useEffect(() => {
    dispatch(getSettings(toggleNotification));
    dispatch(getLanguages(toggleNotification));
    dispatch(getContentTypes(toggleNotification));
    dispatch(getSitemapInfo(toggleNotification));
    dispatch(getAllowedFields(toggleNotification));
  }, [dispatch]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <Loader fullPage />}
      <Header />
      <Info />
      <Tabs />
    </div>
  );
};

export default App;

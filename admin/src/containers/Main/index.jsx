/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNotification } from '@strapi/helper-plugin';

import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Info from '../../components/Info';

import { getAllowedFields, getContentTypes, getSettings, getSitemapInfo, getLanguages } from '../../state/actions/Sitemap';
import Loader from '../../components/Loader';
import axios from "axios";

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
  const [locale, setLocale] = useState()
  const [checkedLocale, setCheckedLocale] = useState()

  const getLocales = async () => {
    const result =
        await axios.get('/api/sitemap/settings')

    const localeKey = Object.keys(result.data.contentTypes)
    const locales = localeKey.length > 0  ? Object.keys(result.data.contentTypes[localeKey].languages) : []

    setLocale(locales)
    setCheckedLocale(locales[0])
  }
  return (
    <div style={{ position: 'relative' }}>
      {loading && <Loader fullPage />}
      <Header getLocales={getLocales}/>
      <Info getLocales={getLocales} locale={locale} checkedLocale={checkedLocale} setCheckedLocale={setCheckedLocale}/>
      <Tabs />
    </div>
  );
};

export default App;

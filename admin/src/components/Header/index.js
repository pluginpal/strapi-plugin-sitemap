/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { isEmpty } from 'lodash';
import { Map } from 'immutable';
import { Header } from '@buffetjs/custom';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import openWithNewTab from '../../helpers/openWithNewTab';
import { submit, discardAllChanges, generateSitemap } from '../../state/actions/Sitemap';

const HeaderComponent = () => {
  const settings = useSelector((state) => state.getIn(['sitemap', 'settings'], Map()));
  const initialData = useSelector((state) => state.getIn(['sitemap', 'initialData'], Map()));
  const sitemapPresence = useSelector((state) => state.getIn(['sitemap', 'sitemapPresence'], Map()));
  const dispatch = useDispatch();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);
  const settingsComplete = settings.get('hostname') && !isEmpty(settings.get('contentTypes'))
    || settings.get('hostname') && !isEmpty(settings.get('customEntries'))
    || settings.get('hostname') && settings.get('includeHomepage');

  const { formatMessage } = useIntl();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(settings.toJS()));
  };

  const actions = [
    {
      label: formatMessage({ id: 'sitemap.Button.Cancel' }),
      onClick: () => dispatch(discardAllChanges()),
      color: 'cancel',
      type: 'button',
      hidden: disabled,
    },
    {
      label: formatMessage({ id: 'sitemap.Button.Save' }),
      onClick: handleSubmit,
      color: 'success',
      type: 'submit',
      hidden: disabled,
    },
    {
      color: 'none',
      label: formatMessage({ id: 'sitemap.Header.Button.SitemapLink' }),
      className: 'buttonOutline',
      onClick: () => openWithNewTab('/sitemap.xml'),
      type: 'button',
      key: 'button-open',
      hidden: !disabled || !settingsComplete || !sitemapPresence,
    },
    {
      label: formatMessage({ id: 'sitemap.Header.Button.Generate' }),
      onClick: () => dispatch(generateSitemap()),
      color: 'primary',
      type: 'button',
      hidden: !disabled || !settingsComplete,
    },
  ];

  const headerProps = {
    title: {
      label: formatMessage({ id: 'sitemap.Header.Title' }),
    },
    content: formatMessage({ id: 'sitemap.Header.Description' }),
    actions: actions,
  };

  return (
    <Header {...headerProps} />
  );
};

export default memo(HeaderComponent);

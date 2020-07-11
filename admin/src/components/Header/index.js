/*
 *
 * HeaderComponent
 *
 */

import React, { memo } from 'react';
import { isEmpty } from 'lodash';
import { Header } from '@buffetjs/custom';
import { useGlobalContext } from 'strapi-helper-plugin';
import openWithNewTab from '../../utils/openWithNewTab';

const HeaderComponent = (props) => {
  const disabled = 
    JSON.stringify(props.settings) === JSON.stringify(props.initialData);
  const settingsComplete = 
    props.settings.hostname && !isEmpty(props.settings.contentTypes) ||
    props.settings.hostname && !isEmpty(props.settings.customEntries) ||
    props.settings.hostname && props.settings.includeHomepage;

  const globalContext = useGlobalContext();

  const actions = [
    {
      label: globalContext.formatMessage({ id: 'sitemap.Button.Cancel' }),
      onClick: props.onCancel,
      color: 'cancel',
      type: 'button',
      hidden: disabled,
    },
    {
      label: globalContext.formatMessage({ id: 'sitemap.Button.Save' }),
      onClick: props.onSubmit,
      color: 'success',
      type: 'submit',
      hidden: disabled
    },
    {
      color: 'none',
      label: globalContext.formatMessage({ id: 'sitemap.Header.Button.SitemapLink' }),
      className: 'buttonOutline',
      onClick: () => openWithNewTab('/sitemap.xml'),
      type: 'button',
      key: 'button-open',
      hidden: !disabled || !settingsComplete || !props.sitemapPresence
    },
    {
      label: globalContext.formatMessage({ id: 'sitemap.Header.Button.Generate' }),
      onClick: props.generateSitemap,
      color: 'primary',
      type: 'button',
      hidden: !disabled || !settingsComplete
    },
  ];

  const headerProps = {
    title: {
      label: globalContext.formatMessage({ id: 'sitemap.Header.Title' }),
    },
    content: globalContext.formatMessage({ id: 'sitemap.Header.Description' }),
    actions: actions,
  };
  
  return (
    <Header {...headerProps} />
  );
};

export default memo(HeaderComponent);

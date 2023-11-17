import React, {useEffect, useState} from 'react';

import { Map } from 'immutable';
import { useIntl } from 'react-intl';
import { useSelector, useDispatch } from 'react-redux';

import { useNotification } from '@strapi/helper-plugin';
import { Typography, Box, Button, Link, SingleSelect, SingleSelectOption } from '@strapi/design-system';

import { generateSitemap } from '../../state/actions/Sitemap';
import { formatTime } from '../../helpers/timeFormat';
import axios from "axios";

const Info = ({getLocales, locale, checkedLocale, setCheckedLocale}) => {
  const hasHostname = useSelector((state) => state.getIn(['sitemap', 'initialData', 'hostname'], Map()));
  const sitemapInfo = useSelector((state) => state.getIn(['sitemap', 'info'], Map()));
  const dispatch = useDispatch();
  const toggleNotification = useNotification();
  const { formatMessage } = useIntl();

  const updateDate = new Date(sitemapInfo.get('updateTime'));

  // Format month, day and time.
  const month = updateDate.toLocaleString('en', { month: 'numeric' });
  const day = updateDate.toLocaleString('en', { day: 'numeric' });
  const year = updateDate.getFullYear().toString().slice(2);
  const time = formatTime(updateDate, true);

  const content = () => {
      useEffect(async () => {
         getLocales();
      }, [])

    if (!hasHostname) {
      return (
        <div>
          <Typography variant="delta" style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoHostname.Title', defaultMessage: 'Set your hostname' })}
          </Typography>
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.NoHostname.Description', defaultMessage: 'Before you can generate the sitemap you have to specify the hostname of your website.' })}
            </Typography>
            <Button
              onClick={() => {
                document.getElementById('tabs-2-tab').click();
                setTimeout(() => document.querySelector('input[name="hostname"]').focus(), 0);
              }}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.GoToSettings', defaultMessage: 'Go to settings' })}
            </Button>
          </div>
        </div>
      );
    } else if (sitemapInfo.size === 0 || locale?.length === 0) {
        return (
        <div>
          <Typography variant="delta" style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.NoSitemap.Title', defaultMessage: 'No sitemap XML present' })}
          </Typography>
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.NoSitemap.Description', defaultMessage: 'Generate your first sitemap XML with the button below.' })}
            </Typography>
            <Button
              onClick={() => dispatch(generateSitemap(toggleNotification))}
              variant="secondary"
              style={{ marginTop: '15px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate', defaultMessage: 'Generate sitemap' })}
            </Button>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <Typography variant="delta" style={{ marginBottom: '10px' }}>
            {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.Title', defaultMessage: 'Sitemap XML is present' })}
          </Typography>
          <div>
            <Typography variant="omega">
              {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.LastUpdatedAt', defaultMessage: 'Last updated at:' })}
            </Typography>
            <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
              {`${month}/${day}/${year} - ${time}`}
            </Typography>
          </div>
          {sitemapInfo.get('sitemaps') === 0 ? (
            <div style={{ marginBottom: '15px' }}>
              <Typography variant="omega">
                {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.AmountOfURLs', defaultMessage: 'Amount of URLs:' })}
              </Typography>
              <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
                {sitemapInfo.get('urls')}
              </Typography>
            </div>
          ) : (
            <div style={{ marginBottom: '15px' }}>
              <Typography variant="omega">
                {formatMessage({ id: 'sitemap.Info.SitemapIsPresent.AmountOfSitemaps', defaultMessage: 'Amount of URLs:' })}
              </Typography>
              <Typography variant="omega" fontWeight="bold" style={{ marginLeft: '5px' }}>
                {sitemapInfo.get('sitemaps')}
              </Typography>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'end', gap: 20 }}>
            <Button
              onClick={async () => {
                 const result = await dispatch(generateSitemap(toggleNotification))
                  result?.type === "success" ? getLocales() : null
              }}
              variant="secondary"
              style={{ marginRight: '10px' }}
            >
              {formatMessage({ id: 'sitemap.Header.Button.Generate', defaultMessage: 'Generate sitemap' })}
            </Button>

            <SingleSelect label="Locale" value={checkedLocale} onChange={setCheckedLocale}>
                {locale && locale.map((value) => (
                    <SingleSelectOption value={value}>{value}</SingleSelectOption>
                ))}
            </SingleSelect>

            <Link
              href={
                  checkedLocale
                      ? strapi.backendURL +
                      sitemapInfo.get('location')
                       .replace(/^\/api\/sitemap\//, '/api/sitemap/' + checkedLocale + '/')
                      : strapi.backendURL + sitemapInfo.get('location')
              }
              target="_blank"
            >
              {formatMessage({ id: 'sitemap.Header.Button.SitemapLink', defaultMessage: 'Go to the sitemap' })}
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <Box paddingLeft={8} paddingRight={8}>
      <Box
        background="neutral0"
        hasRadius
        paddingTop={4}
        paddingBottom={4}
        paddingLeft={5}
        paddingRight={5}
        shadow="filterShadow"
      >
        {content()}
      </Box>
    </Box>
  );
};

export default Info;

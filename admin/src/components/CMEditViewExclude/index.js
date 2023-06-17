import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import { Box, Divider, Typography, Stack, Checkbox } from '@strapi/design-system';

import getTrad from '../../helpers/getTrad';

const CMEditViewExclude = () => {
  const [sitemapSettings, setSitemapSettings] = useState({});
  const { formatMessage } = useIntl();
  const { slug, modifiedData, onChange } = useCMEditViewDataManager();

  const getSitemapSettings = async () => {
    const settings = await request('/sitemap/settings/', { method: 'GET' });
    setSitemapSettings(settings);
  };

  useEffect(() => {
    getSitemapSettings();
  }, []);

  if (!sitemapSettings.contentTypes) return null;
  if (!sitemapSettings.contentTypes[slug]) return null;

  return (
    <Box paddingTop={6}>
      <Typography textColor="neutral600" variant="sigma">
        {formatMessage({ id: getTrad('plugin.name'), defaultMessage: 'Sitemap' })}
      </Typography>
      <Box paddingTop={2} paddingBottom={6}>
        <Divider />
      </Box>
      <Stack size={2}>
        <Box>
          <Checkbox
            onValueChange={(value) => {
              onChange({ target: { name: 'sitemap_exclude', value } });
            }}
            value={modifiedData.sitemap_exclude}
            name="exclude-from-sitemap"
          >
            {formatMessage({ id: getTrad('EditView.ExcludeFromSitemap'), defaultMessage: 'Exclude from sitemap' })}
          </Checkbox>
        </Box>
      </Stack>
    </Box>
  );
};

export default CMEditViewExclude;

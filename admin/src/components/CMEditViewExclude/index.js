import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import { Box } from '@strapi/design-system/Box';
import { Divider } from '@strapi/design-system/Divider';
import { TableLabel } from '@strapi/design-system/Text';
import { Stack } from '@strapi/design-system/Stack';
import { Checkbox } from '@strapi/design-system/Checkbox';

import getTrad from '../../helpers/getTrad';

const CMEditViewExclude = () => {
  const [sitemapSettings, setSitemapSettings] = useState({});
  const { formatMessage } = useIntl();
  const { slug, modifiedData, onChange } = useCMEditViewDataManager();

  const getSitemapSettings = async () => {
    const settings = await request('/sitemap/settings/', { method: 'GET' });
    setSitemapSettings(settings);
  };

  useEffect(async () => {
    getSitemapSettings();
  }, []);

  if (!sitemapSettings.contentTypes) return null;
  if (!sitemapSettings.contentTypes[slug]) return null;

  return (
    <Box paddingTop={6}>
      <TableLabel textColor="neutral600">
        {formatMessage({ id: getTrad('plugin.name'), defaultMessage: 'Sitemap' })}
      </TableLabel>
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
            Exclude from sitemap
          </Checkbox>
        </Box>
      </Stack>
    </Box>
  );
};

export default CMEditViewExclude;

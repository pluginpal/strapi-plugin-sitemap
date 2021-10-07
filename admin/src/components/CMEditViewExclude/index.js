import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { useCMEditViewDataManager, request } from '@strapi/helper-plugin';
import { Box } from '@strapi/parts/Box';
import { Divider } from '@strapi/parts/Divider';
import { TableLabel } from '@strapi/parts/Text';
import { Stack } from '@strapi/parts/Stack';
import { Checkbox } from '@strapi/parts/Checkbox';

import getTrad from '../../helpers/getTrad';

const CMEditViewExclude = () => {
  const [sitemapSettings, setSitemapSettings] = useState({});
  const { formatMessage } = useIntl();
  const { slug, initialData } = useCMEditViewDataManager();

  const getSitemapSettings = async () => {
    const settings = await request('/sitemap/settings/', { method: 'GET' });
    setSitemapSettings(settings);
  };

  useEffect(async () => {
    getSitemapSettings();
  }, []);

  if (!sitemapSettings.contentTypes) return null;
  if (!sitemapSettings.contentTypes[slug]) return null;

  const excludeEntry = async () => {
    await request(
      '/sitemap/settings/exclude',
      { method: 'PUT', body: { model: slug, id: initialData.id } },
    );
    getSitemapSettings();
  };

  const getExcludedValue = () => {
    if (!sitemapSettings.contentTypes[slug].excluded) return false;
    return sitemapSettings.contentTypes[slug].excluded.includes(initialData.id);
  };

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
            onValueChange={() => {
              excludeEntry();
            }}
            value={getExcludedValue()}
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

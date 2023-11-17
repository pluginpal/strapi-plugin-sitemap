import React from 'react';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import CollectionURLs from '../../tabs/CollectionURLs';
// import CustomURLs from '../../tabs/CustomURLs';
import Settings from '../../tabs/Settings';

const SitemapTabs = () => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={8}>
      <TabGroup
        id="tabs"
        label="Main tabs"
      >
        <Tabs>
          <Tab>{formatMessage({ id: 'sitemap.Settings.CollectionTitle', defaultMessage: 'URL bundles' })}</Tab>
          {/*<Tab>{formatMessage({ id: 'sitemap.Settings.CustomTitle', defaultMessage: 'Custom URLs' })}</Tab>*/}
          <Tab>{formatMessage({ id: 'sitemap.Settings.SettingsTitle', defaultMessage: 'Settings' })}</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <CollectionURLs />
          </TabPanel>
          {/*<TabPanel>*/}
          {/*  <CustomURLs />*/}
          {/*</TabPanel>*/}
          <TabPanel>
            <Box padding={6} background="neutral0" shadow="filterShadow">
              <Settings />
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  );
};

export default SitemapTabs;

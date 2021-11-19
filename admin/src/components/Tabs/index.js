import React from 'react';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/design-system/Tabs';
import { Box } from '@strapi/design-system/Box';
import CollectionURLs from '../../tabs/CollectionURLs';
import CustomURLs from '../../tabs/CustomURLs';
import Settings from '../../tabs/Settings';

const SitemapTabs = () => {
  return (
    <Box padding={8}>
      <TabGroup
        id="tabs"
        label="Main tabs"
      >
        <Tabs>
          <Tab>URL bundles</Tab>
          <Tab>Custom URLs</Tab>
          <Tab>Settings</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <Box padding={6} background="neutral0">
              <CollectionURLs />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box padding={6} background="neutral0">
              <CustomURLs />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box padding={6} background="neutral0">
              <Settings />
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  );
};

export default SitemapTabs;

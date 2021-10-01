import React from 'react';
import { Tabs, Tab, TabGroup, TabPanels, TabPanel } from '@strapi/parts/Tabs';
import { Box } from '@strapi/parts/Box';
import CollectionURLs from '../../tabs/CollectionURLs';
import CustomURLs from '../../tabs/CustomURLs';
import Settings from '../../tabs/Settings';

const SitemapTabs = () => {
  return (
    <Box padding={8}>
      <TabGroup id="tabs">
        <Tabs>
          <Tab>URL bundles</Tab>
          <Tab>Custom URLs</Tab>
          <Tab>Settings</Tab>
        </Tabs>
        <TabPanels>
          <TabPanel>
            <Box padding={4} background="neutral0">
              <CollectionURLs />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box padding={4} background="neutral0">
              <CustomURLs />
            </Box>
          </TabPanel>
          <TabPanel>
            <Box padding={4} background="neutral0">
              <Settings />
            </Box>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Box>
  );
};

export default SitemapTabs;

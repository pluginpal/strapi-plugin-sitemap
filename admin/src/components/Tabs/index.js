import React from 'react';
import { HeaderNav } from 'strapi-helper-plugin';
import pluginId from '../../helpers/pluginId';

const Tabs = () => {
  return (
    <HeaderNav
      links={[
        {
          name: 'URL patterns',
          to: `/plugins/${pluginId}/url-patterns`,
        },
        {
          name: 'Custom URLs',
          to: `/plugins/${pluginId}/custom-urls`,
        },
        {
          name: 'Settings',
          to: `/plugins/${pluginId}/settings`,
        },
      ]}
      style={{ marginTop: '4.6rem' }}
    />
  );
};

export default Tabs;

import React from 'react';
import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import App from './containers/App';
import Initializer from './containers/Initializer';
import trads from './translations';

function Comp(props) {
  return <App {...props} />;
}

export default strapi => {
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    layout: null,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: Comp,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
  };

  return strapi.registerPlugin(plugin);
};

import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginPkg from '../../package.json';
import pluginId from './helpers/pluginId';
import pluginIcon from './components/PluginIcon';
import CMEditViewExclude from './components/CMEditViewExclude';
import pluginPermissions from './permissions';
// import getTrad from './helpers/getTrad';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const { name } = pluginPkg.strapi;

export default {
  register(app) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });

    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: pluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: 'Sitemap',
      },
      Component: async () => {
        const component = await import(
          /* webpackChunkName: "sitemap-settings-page" */ './containers/App'
        );

        return component;
      },
      permissions: pluginPermissions['menu-link'],
    });
  },
  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'informations', {
      name: 'sitemap-exclude-filter-edit-view',
      Component: CMEditViewExclude,
    });
  },
  async registerTrads({ locales }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "sitemap-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};

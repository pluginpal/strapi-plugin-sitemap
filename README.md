<h1 style="text-align: center;">
	Strapi sitemap plugin
</h1>

<p style="text-align: center; margin-top: 0;">Create a highly customizable sitemap XML in Strapi CMS.</p>

<p style="text-align: center;">
  <a href="https://www.npmjs.org/package/strapi-plugin-sitemap">
    <img src="https://img.shields.io/npm/v/strapi-plugin-sitemap/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-sitemap">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-sitemap" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap">
    <img src="https://img.shields.io/github/workflow/status/boazpoolman/strapi-plugin-sitemap/Tests/master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap">
    <img src="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>

## ✨ Features

- 🌍 **Multilingual** (Implements `rel="alternate"` for the translations of a page)
- ♻️ **Auto-updating** (Uses lifecycle methods to keep the sitemap XML up-to-date)
- 🗃️ **URL bundles** (Bundle URLs by type and add them to the sitemap XML)
- 🎉 **Dynamic paths** (Implements URL patterns in which you can inject dynamic fields)
- ⚙️ **Custom URLs** (URLs of pages which are not managed in Strapi)
- 💅 **Styled with XSL** (Human readable XML styling)

## ⏳ Installation

Install the plugin in your Strapi project.

```bash
# using yarn
yarn add strapi-plugin-sitemap

# using npm
npm install strapi-plugin-sitemap --save
```

After successful installation you have to rebuild the admin UI so it'll include this plugin. To rebuild and restart Strapi run:

```bash
# using yarn
yarn build --clean
yarn develop

# using npm
npm run build --clean
npm run develop
```

The **Sitemap** plugin should appear in the **Plugins** section of Strapi sidebar after you run app again.

Enjoy 🎉

## 🖐 Requirements

Complete installation requirements are the exact same as for Strapi itself and can be found in the [Strapi documentation](https://strapi.io/documentation).

**Supported Strapi versions**:

- Strapi v4.0.0-beta.2 (recently tested)
- Strapi v4.x
- Strapi v3.6.x (use `strapi-plugin-sitemap@1.2.5`)

(This plugin may work with older Strapi versions, but these are not tested nor officially supported at this time.)

**We recommend always using the latest version of Strapi to start your new projects**.

## 💡 Usage
With this plugin you have full control over which URLs you add to your sitemap XML. Go to the admin section of the plugin and start adding URLs. Here you will find that there are two ways to add URLs to the sitemap. With **URL bundles** and **Custom URLs**.

### URL bundles
A URL bundle is a set of URLs grouped by type. When adding a URL bundle to the sitemap you can define a **URL pattern** which will be used to generate all URLs in this bundle. (Read more about URL patterns below)

URLs coming from a URL bundle will get the following XML attributes:

- `<loc>`
- `<lastmod>`
- `<priority>`
- `<changefreq>`

### Custom URLs
A custom URL is meant to add URLs to the sitemap which are not managed in Strapi. It might be that you have custom route like `/account` that is hardcoded in your front-end. If you'd want to add such a route (URL) to the sitemap you can add it as a custom URL.

Custom URLs will get the following XML attributes:

- `<loc>`
- `<priority>`
- `<changefreq>`

## 🔌 URL pattern
To create dynamic URLs this plugin uses **URL patterns**. A URL pattern is used when adding URL bundles to the sitemap and has the following format:

```
/pages/[my-uid-field]
```

Fields can be injected in the pattern by escaping them with `[]`.

The following fields types are by default allowed in a pattern:

- id
- uid

*Allowed field types can be altered with the `allowedFields` config. Read more about it below.*

## 🌍 Multilingual

When adding a URL bundle of a type which has localizations enabled you will be presented with a language dropdown in the settings form. You can now set a different URL pattern for each language.

For each localization of a page the `<url>` in the sitemap XML will get an extra attribute:

- `<xhtml:link rel="alternate">`

This implementation is based on [Google's guidelines](https://developers.google.com/search/docs/advanced/crawling/localized-versions) on localized sitemaps.

## ⚙️ Settings
Settings can be changed in the admin section of the plugin. In the last tab (Settings) you will find the settings as described below.

### Hostname (required)

The hostname is the URL of your website. It will be used as the base URL of all URLs added to the sitemap XML. It is required to generate the XML file.

###### Key: `hostname`

> `required:` YES | `type:` string | `default:` ''

### Exclude drafts

When using the draft/publish functionality in Strapi this setting will make sure that all draft pages are excluded from the sitemap. If you want to have the draft pages in the sitemap anyways you can disable this setting.

###### Key: `excludeDrafts`

> `required:` NO | `type:` bool | `default:` true

### Include homepage

This setting will add a default `/` entry to the sitemap XML when none is present. The `/` entry corresponds to the homepage of your website.

###### Key: `includeHomepage`

> `required:` NO | `type:` bool | `default:` true

## 🔧 Config
Config can be changed in the `config/plugins.js` file in your Strapi project.
You can overwrite the config like so:

```
module.exports = ({ env }) => ({
  'sitemap': {
    enabled: true,
    config: {
      autoGenerate: true,
      allowedFields: ['id', 'uid'],
      excludedTypes: [],
    },
  },
});
```

### Auto generate

When adding URL bundles to your sitemap XML, and auto generate is set to true, the plugin will utilize the lifecycle methods to regenerate the sitemap  on `create`, `update` and `delete` for pages of the URL bundles type. This way your sitemap will always be up-to-date when making content changes.

You might want to disable this setting if your experiencing performance issues. You could alternatively create a cronjob in which you generate the sitemap XML periodically. Like so:

```
// Generate the sitemap every 12 hours
'0 */12 * * *': () => {
	strapi.plugin('sitemap').service('sitemap').createSitemap();
},
```

###### Key: `autoGenerate `

> `required:` NO | `type:` bool | `default:` true

### Allowed fields
When defining a URL pattern you can populate it with dynamic fields. The fields allowed in the pattern are specified by type. By default only the field types `id` and `uid` are allowed in the pattern, but you can alter this setting to allow more field types in the pattern.

*If you are missing a key field type of which you think it should be allowed by default please create an issue and explain why it is needed.*

###### Key: `allowedFields `

> `required:` NO | `type:` array | `default:` `['id', 'uid']`

### Excluded types
This setting is just here for mere convenience. When adding a URL bundle to the sitemap you can specify the type for the bundle. This will show all types in Strapi, however some types should never be it's own page in a website and are therefor excluded in this setting.

All types in this array will not be shown as an option when selecting the type of a URL bundle. 

###### Key: `excludedTypes `

> `required:` NO | `type:` array | `default:` `['admin::permission', 'admin::role', 'admin::api-token', 'plugin::i18n.locale', 'plugin::users-permissions.permission', 'plugin::users-permissions.role']`

## 🤝 Contributing

Feel free to fork and make a pull request of this plugin. All the input is welcome!

## ⭐️ Show your support

Give a star if this project helped you.

## 🔗 Links

- [NPM package](https://www.npmjs.com/package/strapi-plugin-sitemap)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-sitemap)

## 🌎 Community support

- For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/).
- You can contact me on the Strapi Discord [channel](https://discord.strapi.io/).

## 📝 Resources

- [MIT License](LICENSE.md)

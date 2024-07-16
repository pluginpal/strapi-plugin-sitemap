<div align="center">
<h1>Strapi sitemap plugin</h1>
	
<p style="margin-top: 0;">Create a highly customizable sitemap XML in Strapi CMS.</p>
	
<p>
  <a href="https://www.npmjs.org/package/strapi-plugin-sitemap">
    <img src="https://img.shields.io/npm/v/strapi-plugin-sitemap/latest.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-sitemap">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-sitemap" alt="Monthly download on NPM" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap">
    <img src="https://img.shields.io/github/actions/workflow/status/boazpoolman/strapi-plugin-sitemap/tests.yml?branch=master" alt="CI build status" />
  </a>
  <a href="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap">
    <img src="https://codecov.io/gh/boazpoolman/strapi-plugin-sitemap/coverage.svg?branch=master" alt="codecov.io" />
  </a>
</p>
</div>

## ✨ Features

- **Multilingual** (Implements `rel="alternate"` with `@strapi/plugin-i18n`)
- **URL bundles** (Bundle URLs by type and add them to the sitemap XML)
- **Dynamic paths** (Implements URL patterns in which you can inject dynamic fields)
- **Virtual sitemap** (Sitemaps served from the database)
- **Cron regeneration** (Automatically scheduled cron job for regeneration)
- **Sitemap indexes** (Paginated sitemap indexes for large URL sets)
- **Exclude URLs** (Exclude specified URLs from the sitemap)
- **Custom URLs** (URLs of pages which are not managed in Strapi)
- **CLI** (CLI for sitemap generation)
- **Styled with XSL** (Human readable XML styling)

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
yarn build
yarn develop

# using npm
npm run build
npm run develop
```

The **Sitemap** plugin should now appear in the **Settings** section of your Strapi app.

Enjoy 🎉

## 🖐 Requirements

Complete installation requirements are the exact same as for Strapi itself and can be found in the [Strapi documentation](https://strapi.io/documentation).

**Supported Strapi versions**:

- Strapi ^4.11.4 (use `strapi-plugin-sitemap@^3`)
- Strapi ^4.5.x (use `strapi-plugin-sitemap@^2`)

(This plugin may work with older Strapi versions, but these are not tested nor officially supported.)

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
/pages/[category.slug]/[my-uid-field]
```

Fields can be injected in the pattern by escaping them with `[]`.

Also relations can be queried in the pattern like so: `[relation.fieldname]`.

The following field types are by default allowed in a pattern:

- `id`
- `uid`

*Allowed field types can be altered with the `allowedFields` config. Read more about it below.*

## 🌍 Multilingual

When adding a URL bundle of a type which has localizations enabled you will be presented with a language dropdown in the settings form. You can now set a different URL pattern for each language.

For each localization of a page the `<url>` in the sitemap XML will get an extra attribute:

- `<xhtml:link rel="alternate">`

This implementation is based on [Google's guidelines](https://developers.google.com/search/docs/advanced/crawling/localized-versions) on localized sitemaps.

## 🔗 Sitemap index

Large sitemaps (larger then 45.000 urls) will automatically be split up in to seperate sitemaps. <br />
A sitemap index will be created that links to all the different sitemap chunks. <br />
That sitemap index will be accessible on the default `/api/sitemap/index.xml` location.

It is required to set the `url` in the `./config/server.js` file in your Strapi installation.
That will be used to create the links to the different chunks.

You can alter the 45.000 magic number through plugin config.

## 🤖 Robots.txt

To make sure search engines are able to find the sitemap XML create a `robots.txt` file in the front-end of your website and add the following line:

```
Sitemap: https://your-strapi-domain.com/api/sitemap/index.xml
```

Read more about the `robots.txt` file [here](https://developers.google.com/search/docs/advanced/robots/create-robots-txt).

## 📺 CLI

This plugin comes with it's own `strapi-sitemap` CLI.
You can add it to your project like so:

```
"scripts": {
  // ...
  "sitemap": "strapi-sitemap"
},
```

You can now run the `generate` command like so:

```bash
# using yarn
yarn sitemap generate

# using npm
npm run sitemap generate
```

## ⚙️ Settings
Settings can be changed in the admin section of the plugin. In the last tab (Settings) you will find the settings as described below.

### Hostname (required)

The hostname is the URL of your website. It will be used as the base URL of all URLs added to the sitemap XML. It is required to generate the XML file.

###### Key: `hostname`

> `required:` YES | `type:` string | `default:` ''

### Hostname overrides

If you are using this plugin in a multilingual Strapi project you will be presented with a 'Hostname overrides' setting.
With this setting you can set a specific hostname per language.

This is handy for when you have a URL structure like this:

- https://en.domain.com (english domain)
- https://nl.domain.com (dutch domain)
- https://de.domain.com (german domain)

###### Key: `hostname_overrides`

> `required:` NO | `type:` object | `default:` {}

### Exclude drafts

When using the draft/publish functionality in Strapi this setting will make sure that all draft pages are excluded from the sitemap. If you want to have the draft pages in the sitemap anyways you can disable this setting.

###### Key: `excludeDrafts`

> `required:` NO | `type:` bool | `default:` true

### Include homepage

This setting will add a default `/` entry to the sitemap XML when none is present. The `/` entry corresponds to the homepage of your website.

###### Key: `includeHomepage`

> `required:` NO | `type:` bool | `default:` true

### Default language URL (x-default)

This setting will add an additionnal `<link />` tag into each sitemap urls bundles with value `hreflang="x-default"` and the path of your choice. The hreflang x-default value is used to specify the language and region neutral URL for a piece of content when the site doesn't support the user's language and region. For example, if a page has hreflang annotations for English and Spanish versions of a page along with an x-default value pointing to the English version, French speaking users are sent to the English version of the page due to the x-default annotation. The x-default page can be a language and country selector page, the page where you redirect users when you have no content for their region, or just the version of the content that you consider default. 

###### Key: `defaultLanguageUrlType`

> `required:` NO | `type:` string | `default:` ''

## 🔧 Config
Config can be changed in the `config/plugins.js` file in your Strapi project.
You can overwrite the config like so:

```
module.exports = ({ env }) => ({
  // ...
  'sitemap': {
    enabled: true,
    config: {
      cron: '0 0 0 * * *',
      limit: 45000,
      xsl: true,
      autoGenerate: false,
      caching: true,
      allowedFields: ['id', 'uid'],
      excludedTypes: [],
    },
  },
});
```
### CRON

To make sure the sitemap stays up-to-date this plugin will automatically schedule a cron job that generates the sitemap for you. That cron job is configured to run once a day at 00:00.

If you want to change the cron interval you can alter the `cron` setting.

###### Key: `cron `

> `required:` NO | `type:` bool | `default:` 0 0 0 * * *

### Limit

When creating large sitemaps (50.000+ URLs) you might want to split the sitemap in to chunks that you bring together in a sitemap index.

The limit is there to specify the maximum amount of URL a single sitemap may hold. If you try to add more URLs to a single sitemap.xml it will automatically be split up in to chunks which are brought together in a single sitemap index.

###### Key: `limit `

> `required:` NO | `type:` int | `default:` 45000

### XSL

This plugin ships with some XSL files to make your sitemaps human readable. It adds some styling and does some reordering of the links.

These changes are by no means a requirement for your sitemap to be valid. It is really just there to make your sitemap look pretty.

If you have a large sitemap you might encounter performance issues when accessing the sitemap.xml from the browser. In that case you can disable the XSL to fix these issues.

###### Key: `xsl `

> `required:` NO | `type:` bool | `default:` true

### Auto generate

Alternatively to using cron to regenerate your sitemap, this plugin offers an automatic generation feature that will generate the sitemap through lifecycle methods. On `create`, `update` and `delete` this plugin will do a full sitemap regeneration. This way your sitemap will always be up-to-date when making content changes.

If you have a large sitemap the regeneration becomes an expensive task. Because of that this setting is disabled by default and it is not recommended to enable it for sitemaps with more than 1000 links.

Also the search engines don't even crawl your sitemap that often, so generating it once a day through cron should be suffecient.

###### Key: `autoGenerate `

> `required:` NO | `type:` bool | `default:` false

### Caching

This setting works together with the `autoGenerate` setting. When enabled a JSON representation of the current sitemap will be stored in the database. Then, whenever the sitemap is being regenerated through lifecycles, the cache will be queried to build the sitemap instead of querying all individual (unchanged) pages.

###### Key: `caching `

> `required:` NO | `type:` bool | `default:` true

### Allowed fields
When defining a URL pattern you can populate it with dynamic fields. The fields allowed in the pattern can be manipulated with this setting. Fields can be specified either by type or by name. By default the plugin allows `id` and `uid`.

*If you are missing a key field type of which you think it should be allowed by default please create an issue and explain why it is needed.*

###### Key: `allowedFields `

> `required:` NO | `type:` array | `default:` `['id', 'uid']`

### Excluded types
This setting is just here for mere convenience. When adding a URL bundle to the sitemap you can specify the type for the bundle. This will show all types in Strapi, however some types should never be it's own page in a website and are therefor excluded in this setting.

All types in this array will not be shown as an option when selecting the type of a URL bundle. 

The format of the types should look something like `api::test.api`.
To see all the types you can choose from, run `strapi content-types:list`.

###### Key: `excludedTypes `

> `required:` NO | `type:` array

### Exclude invalid relations relational objects
This setting allow you to exclude invalid entries when the pattern is not valid for the entry

Example : You have added a `slug` property to the configuration entry `allowedFields`.
If a content doesn't have the field `slug` filled, no entry in the sitemap will be generated for this content (to avoid duplicate content)

###### Key: `discardInvalidRelations `

> `required:` NO | `type:` boolean

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

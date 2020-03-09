# Strapi Plugin Sitemap

A plugin for [Strapi](http://strapi.io/) to generate a customizable sitemap. Provide settings per content type for a sitemap that fits your needs. 

This plugin uses the UID field type to fetch URLs, and therefor expects a Strapi version of `3.0.0-beta.19.1` or higher.

## Installation

Use `npm` or `yarn` to install and build the plugin.

	yarn add strapi-plugin-sitemap
	yarn build
	yarn develop

## Configuration

Before you can generate the sitemap you need to specify what you want to be in it. In the admin section of the plugin you can add content types to the sitemap . For each content type you can also specify `changeFreq` and `priority` of the sitemap entries. Lastly you also need to set the `hostname` of your website. 

After saving the settings and generating the sitemap, it will be written in the `/public` folder of your Strapi project, making it available at `http://localhost:1337/sitemap.xml`. 

![Setup Strapi sitemap](https://api.boazpoolman.nl/uploads/99cebc3da2ad4a7dbc6ce493deee7673.gif)

## Optional (but recommended)

1. Add the `sitemap.xml` to the `.gitignore` of your project.

2. As of writing this the Strapi lifecycle methods are not stable and can't be used to regenerate the sitemap after a change of a URL. So to make sure your sitemap is up-to-date you can add a cron job where you run the `createSitemap()` service periodically.

## Cron job

	// Generate the sitemap every 12 hours
	'0 */12 * * *': () => {
	    strapi.plugins.sitemap.services.sitemap.createSitemap();
	},
	
## Resources

- [MIT License](LICENSE.md)

## Links

- [NPM package](https://www.npmjs.com/package/strapi-plugin-sitemap)
- [GitHub repository](https://github.com/boazpoolman/strapi-plugin-sitemap)

## ⭐️ Show your support

Give a star if this project helped you

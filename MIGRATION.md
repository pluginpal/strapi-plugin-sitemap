
<h1>Migration guides</h1>
	
## From 2.x to 3.x

### Requirements

You need to be running **Strapi v4.11.4 or higher** to run v3.

### Migration steps

The following manual steps will have to be done when migrating.

##### 1. Sitemap location change

The path for accessing the sitemap has changed. <br />
Starting from v3, the sitemap can be accessed with the following new path:

```
GET /api/sitemap/index.xml
```


This new path has to be **updated** in your **robots.txt** and in **Google Search Console**.

##### 2. Folder removal

The public sitemap folder has become redundant. <br />
The following folder can be removed from your Strapi instance:

```
/public/sitemap
```

##### 3. Regenerate sitemap

You have to do a one-time manual sitemap re-generation.

### Notable changes

The following thing have been introduced or updated.

#### Virtual sitemaps

As of v3, the plugin will **store the sitemap.xml in the database**, instead of storing it in the public folder. <br />
To access the sitemap you will have to query it through Strapi's public REST API. <br />
The plugin provides the following endpoint to do so:

```
GET /api/sitemap/index.xml
``` 

#### Cron regeneration

The new default for sitemap re-generation will be through CRON. <br />
As of v3, a cron job will be registered **automatically** that will regenerate your sitemap once a day **at 00:00**. <br />
The cron can be altered or disabled through plugin config.

Because of that, the auto generation option will be **disabled by default**.
You can still enable auto generation through plugin config.

#### Configuration page

The sitemap configuration page in Strapi admin has been moved to the **Settings** section of your Strapi app.<br />
From now on it can be accessed on the following path:

```
/admin/settings/sitemap
```

#### Sitemap indexes

Large sitemaps (larger then 45.000 urls) will automatically be split up in to seperate sitemaps. <br />
Then a sitemap index will be created that links to all the different sitemap chunks. <br />
The sitemap index will be accessible on `/api/sitemap/index.xml`.

You can alter the 45.000 magic number through plugin config.

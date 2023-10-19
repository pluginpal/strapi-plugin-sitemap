"use strict";

const axios = require("axios").default;

const getCoreStore = () => {
  return strapi.store({ type: "plugin", name: "sitemap" });
};

const getService = (name) => {
  return strapi.plugin("sitemap").service(name);
};

const logMessage = (msg = "") => `[strapi-plugin-sitemap]: ${msg}`;

const noLimit = async (strapi, queryString, parameters, limit = 5000) => {
  const amountOfEntries = await strapi.entityService.count(
    queryString,
    parameters
  );

  let chunk;
  let formatedChunk = [];
  for (let i = 0; i < amountOfEntries / limit; i++) {
    /* eslint-disable-next-line */
    chunk = await strapi.entityService.findMany(queryString, {
      populate: {
        route_parameters: {
          populate: {
            dynamic_parameter: {
              populate: "*",
            },
          },
        },
      },
    });

    let itemObj = {};
    chunk.map(async (item) => {
      item.route = item.route === "/homepage/" ? "" : item.route;
      item?.route_parameters.length > 0 ? (itemObj = item) : null;
      item.route.includes(":") === false ? formatedChunk.push(item) : null;
    });

    if (Object.keys(itemObj).length > 0) {
      const { parameter, dynamic_parameter } = itemObj?.route_parameters[0];
      const slugParameter = parameter;

      let result = null;
      try {
        result = await axios.post(dynamic_parameter?.integration?.endpoint, {
          query: dynamic_parameter?.sitemapQuery,
        });
      } catch (error) {
        console.log("error", error);
      }
      const resp = new Function(dynamic_parameter?.sitemapTransform)(
        result?.data
      );

      resp.map((slug) => {
        formatedChunk.push({
          id: itemObj?.id,
          route: itemObj?.route.replace(":" + slugParameter, slug),
          createdAt: itemObj?.createdAt,
          updatedAt: itemObj?.updatedAt,
          publishedAt: itemObj?.publishedAt,
        });
      });
    }
  }
  return formatedChunk;
};

const formatCache = (cache, invalidationObject) => {
  let formattedCache = [];

  if (cache) {
    if (invalidationObject) {
      Object.keys(invalidationObject).map((contentType) => {
        // Remove the items from the cache that will be refreshed.
        if (contentType && invalidationObject[contentType].ids) {
          invalidationObject[contentType].ids.map(
            (id) => delete cache[contentType]?.[id]
          );
        } else if (contentType) {
          delete cache[contentType];
        }
      });

      Object.values(cache).map((values) => {
        if (values) {
          formattedCache = [...formattedCache, ...Object.values(values)];
        }
      });
    }
  }

  return formattedCache;
};

const mergeCache = (oldCache, newCache) => {
  const mergedCache = [oldCache, newCache].reduce((merged, current) => {
    Object.entries(current).forEach(([key, value]) => {
      if (!merged[key]) merged[key] = {};
      merged[key] = { ...merged[key], ...value };
    });
    return merged;
  }, {});

  return mergedCache;
};

module.exports = {
  getService,
  getCoreStore,
  logMessage,
  noLimit,
  formatCache,
  mergeCache,
};

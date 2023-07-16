const Strapi = require("@strapi/strapi");
const fs = require("fs");
const _ = require("lodash");

const util = require('util');
const exec = util.promisify(require('child_process').exec);

let instance;

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const waitForServer = () =>
  new Promise((resolve, reject) => {
    const onListen = async (error) => {
      if (error) {
        return reject(error);
      }

      try {
        resolve();
      } catch (error) {
        reject(error);
      }
    };

    const listenSocket = strapi.config.get("server.socket");

    if (listenSocket) {
      strapi.server.listen(listenSocket, onListen);
    } else {
      const { host, port } = strapi.config.get("server");
      strapi.server.listen(port, host, onListen);
    }

  });

/**
 * Setups strapi for futher testing
 */
async function setupStrapi() {
  if (!instance) {
    /** the follwing code in copied from `./node_modules/strapi/lib/Strapi.js` */
    await Strapi({
      appDir: './playground',
      distDir: './playground'
    }).load();
    await waitForServer();

    instance = strapi; // strapi is global now
  }
  return instance;
}

/**
 * Closes strapi after testing
 */
async function stopStrapi() {
  if (instance) {

    instance.destroy();

    const tmpDbFile = strapi.config.get(
      "database.connection.connection.filename"
    );

    if (fs.existsSync(tmpDbFile)) {
      fs.unlinkSync(tmpDbFile);
    }
  }
  return instance;
}

/**
 * Returns valid JWT token for authenticated
 * @param {String | number} idOrEmail, either user id, or email
 */
const jwt = (idOrEmail) =>
  strapi.plugins["users-permissions"].services.jwt.issue({
    [Number.isInteger(idOrEmail) ? "id" : "email"]: idOrEmail,
  });

/**
 * Updates the core of strapi
 * @param {*} pluginName
 * @param {*} key
 * @param {*} newValues
 * @param {*} environment
 */
const updatePluginStore = async (
  pluginName,
  key,
  newValues,
  environment = ""
) => {
  const pluginStore = strapi.store({
    environment: environment,
    type: "plugin",
    name: pluginName,
  });

  const oldValues = await pluginStore.get({ key });
  const newValue = Object.assign({}, oldValues, newValues);

  return pluginStore.set({ key: key, value: newValue });
};

/**
 * Get plugin settings from store
 * @param {*} pluginName
 * @param {*} key
 * @param {*} environment
 */
const getPluginStore = (pluginName, key, environment = "") => {
  const pluginStore = strapi.store({
    environment: environment,
    type: "plugin",
    name: pluginName,
  });

  return pluginStore.get({ key });
};

/**
 * Check if response error contains error with given ID
 * @param {string} errorId ID of given error
 * @param {object} response Response object from strapi controller
 * @example
 *
 * const response =  {
      data: null,
      error: {
        status: 400,
        name: 'ApplicationError',
        message: 'Your account email is not confirmed',
        details: {}
      }
    }
 * responseHasError("ApplicationError", response) // true
 */
const responseHasError = (errorId, response) => {
  return response && response.error && response.error.name === errorId;
};

module.exports = {
  setupStrapi,
  stopStrapi,
  sleep,
  waitForServer,
  jwt,
  updatePluginStore,
  getPluginStore,
  responseHasError,
};

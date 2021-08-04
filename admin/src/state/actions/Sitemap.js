/**
 *
 *
 * ConfigPage actions
 *
 */

 import { request } from 'strapi-helper-plugin';
 import { Map } from 'immutable';

 import {
  SUBMIT,
  SUBMIT_MODAL,
  GET_SETTINGS,
  ON_CHANGE_CONTENT_TYPES,
  ON_CHANGE_SETTINGS,
  GENERATE_SITEMAP,
  GET_SETTINGS_SUCCEEDED,
  GET_CONTENT_TYPES,
  GET_CONTENT_TYPES_SUCCEEDED,
  ON_SUBMIT_SUCCEEDED,
  DELETE_CONTENT_TYPE,
  DELETE_CUSTOM_ENTRY,
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  POPULATE_SETTINGS,
  UPDATE_SETTINGS,
  HAS_SITEMAP,
  HAS_SITEMAP_SUCCEEDED,
} from '../../config/constants';

import getTrad from '../../helpers/getTrad';

// Get initial settings
export function getSettings() {
  return async function(dispatch) {
    try {
      const settings = await request('/sitemap/settings/', { method: 'GET' });
      dispatch(getSettingsSucceeded(Map(settings)));
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function getSettingsSucceeded(settings) {
  return {
    type: GET_SETTINGS_SUCCEEDED,
    settings,
  };
}

export function onChangeContentTypes({ target }, contentType, settingsType) {
  const subKeys =
    settingsType === 'Collection' ? ['modifiedContentTypes'] : ['modifiedCustomEntries']

  const keys = subKeys
    .concat(contentType)
    .concat(target.name.split('.'));
  const value = target.value;

  return {
    type: ON_CHANGE_CONTENT_TYPES,
    keys,
    value,
  };
}

export function onChangeSettings(key, value) {
  return {
    type: ON_CHANGE_SETTINGS,
    key,
    value,
  };
}

export function discardAllChanges() {
  return {
    type: DISCARD_ALL_CHANGES,
  };
}

export function updateSettings(settings) {
  return {
    type: UPDATE_SETTINGS,
    settings,
  };
}

export function populateSettings() {
  return async function() {
    try {
      const settings = await request('/sitemap/settings/populate', { method: 'GET' });
      dispatch(updateSettings(Map(settings)));
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function discardModifiedContentTypes() {
  return {
    type: DISCARD_MODIFIED_CONTENT_TYPES,
  };
}

export function generateSitemap() {
  return async function(dispatch) {
    try {
      const { message } = await request('/sitemap', { method: 'GET' });
      dispatch(hasSitemap());
      strapi.notification.success(message);
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function getContentTypes() {
  return async function(dispatch) {
    try {
      const { data } = await request('/content-manager/content-types', { method: 'GET' });
      dispatch(getContentTypesSucceeded(data))
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function getContentTypesSucceeded(contentTypes) {
  return {
    type: GET_CONTENT_TYPES_SUCCEEDED,
    contentTypes,
  };
}

export function submit(settings) {
  return async function(dispatch) {
    try {
      await request('/sitemap/settings/', { method: 'PUT', body: settings });
      dispatch(onSubmitSucceeded())
      strapi.notification.success(getTrad('notification.success.submit'));
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function onSubmitSucceeded() {
  return {
    type: ON_SUBMIT_SUCCEEDED,
  };
}

export function submitModal() {
  return {
    type: SUBMIT_MODAL,
  };
}

export function deleteContentType(key) {
  return {
    type: DELETE_CONTENT_TYPE,
    key
  };
}

export function deleteCustomEntry(key) {
  return {
    type: DELETE_CUSTOM_ENTRY,
    key
  };
}

export function hasSitemap() {
  return async function(dispatch) {
    try {
      const { main } = await request('/sitemap/presence', { method: 'GET' });
      dispatch(hasSitemapSucceeded(main))
    } catch(err) {
      strapi.notification.error('notification.error');
    }
  }
}

export function hasSitemapSucceeded(hasSitemap) {
  return {
    type: HAS_SITEMAP_SUCCEEDED,
    hasSitemap
  };
}
/**
 *
 *
 * ConfigPage actions
 *
 */

 import { request } from 'strapi-helper-plugin';
 import { Map } from 'immutable';

 import {
  SUBMIT_MODAL,
  ON_CHANGE_CONTENT_TYPES,
  ON_CHANGE_SETTINGS,
  GET_SETTINGS_SUCCEEDED,
  GET_CONTENT_TYPES_SUCCEEDED,
  ON_SUBMIT_SUCCEEDED,
  DELETE_CONTENT_TYPE,
  DELETE_CUSTOM_ENTRY,
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  UPDATE_SETTINGS,
  HAS_SITEMAP_SUCCEEDED,
  ON_CHANGE_CUSTOM_ENTRY,
} from '../../config/constants';

import getTrad from '../../helpers/getTrad';

// Get initial settings
export function getSettings() {
  return async function(dispatch) {
    try {
      const settings = await request('/sitemap/settings/', { method: 'GET' });
      dispatch(getSettingsSucceeded(Map(settings)));
    } catch (err) {
      strapi.notification.toggle({type: 'warning', message: { id: 'notification.error' }});
    }
  };
}

export function getSettingsSucceeded(settings) {
  return {
    type: GET_SETTINGS_SUCCEEDED,
    settings,
  };
}

export function onChangeContentTypes(contentType, key, value) {
  return {
    type: ON_CHANGE_CONTENT_TYPES,
    contentType,
    key,
    value,
  };
}

export function onChangeCustomEntry(url, key, value) {
  return {
    type: ON_CHANGE_CUSTOM_ENTRY,
    url,
    key,
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
  return async function(dispatch) {
    try {
      const settings = await request('/sitemap/settings/populate', { method: 'GET' });
      dispatch(updateSettings(Map(settings)));
    } catch (err) {
      strapi.notification.toggle({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
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
      strapi.notification.toggle({ type: 'success', message });
    } catch (err) {
      strapi.notification.toggle({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
}

export function getContentTypes() {
  return async function(dispatch) {
    try {
      const { data } = await request('/content-manager/content-types', { method: 'GET' });
      dispatch(getContentTypesSucceeded(data));
    } catch (err) {
      strapi.notification.toggle({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
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
      dispatch(onSubmitSucceeded());
      strapi.notification.toggle({ type: 'success', message: { id: getTrad('notification.success.submit') } });
    } catch (err) {
      strapi.notification.toggle({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
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
    key,
  };
}

export function deleteCustomEntry(key) {
  return {
    type: DELETE_CUSTOM_ENTRY,
    key,
  };
}

export function hasSitemap() {
  return async function(dispatch) {
    try {
      const { main } = await request('/sitemap/presence', { method: 'GET' });
      dispatch(hasSitemapSucceeded(main));
    } catch (err) {
      strapi.notification.toggle({ type: 'warning', message: { id: 'notification.error' } });
    }
  };
}

export function hasSitemapSucceeded(main) {
  return {
    type: HAS_SITEMAP_SUCCEEDED,
    hasSitemap: main,
  };
}

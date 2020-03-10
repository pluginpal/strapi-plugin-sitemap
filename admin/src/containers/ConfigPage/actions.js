/**
 *
 *
 * ConfigPage actions
 *
 */

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
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  POPULATE_SETTINGS,
  UPDATE_SETTINGS,
} from './constants';

export function getSettings() {
  return {
    type: GET_SETTINGS,
  };
}

export function onChangeContentTypes({ target }, contentType) {
  const keys = ['modifiedContentTypes']
    .concat(contentType)
    .concat(target.name.split('.'));
  const value = target.value;

  return {
    type: ON_CHANGE_CONTENT_TYPES,
    keys,
    value,
  };
}

export function onChangeSettings({ target }, key) {
  const value = target.value;

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
  return {
    type: POPULATE_SETTINGS,
  };
}

export function discardModifiedContentTypes() {
  return {
    type: DISCARD_MODIFIED_CONTENT_TYPES,
  };
}

export function generateSitemap() {
  return {
    type: GENERATE_SITEMAP,
  };
}

export function getSettingsSucceeded(settings) {
  return {
    type: GET_SETTINGS_SUCCEEDED,
    settings,
  };
}

export function getContentTypes() {
  return {
    type: GET_CONTENT_TYPES,
  };
}

export function getContentTypesSucceeded(contentTypes) {
  return {
    type: GET_CONTENT_TYPES_SUCCEEDED,
    contentTypes,
  };
}

export function submit() {
  return {
    type: SUBMIT,
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

export function deleteContentType(contentType) {
  return {
    type: DELETE_CONTENT_TYPE,
    contentType
  };
}
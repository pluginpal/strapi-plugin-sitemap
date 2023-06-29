/**
 *
 * Main reducer
 *
 */

import { fromJS, Map } from 'immutable';

import {
  GET_SETTINGS_SUCCEEDED,
  ON_CHANGE_CONTENT_TYPES,
  SUBMIT_MODAL,
  GET_CONTENT_TYPES_SUCCEEDED,
  GET_LANGUAGES_SUCCEEDED,
  DELETE_CONTENT_TYPE,
  DELETE_CUSTOM_ENTRY,
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  ON_SUBMIT_SUCCEEDED,
  ON_CHANGE_SETTINGS,
  UPDATE_SETTINGS,
  GET_SITEMAP_INFO_SUCCEEDED,
  ON_CHANGE_CUSTOM_ENTRY,
  GET_ALLOWED_FIELDS_SUCCEEDED,
  SET_LOADING_STATE,
} from '../../../config/constants';

const initialState = fromJS({
  loading: false,
  info: {},
  allowedFields: {},
  settings: Map({}),
  contentTypes: {},
  languages: [],
  initialData: Map({}),
  modifiedContentTypes: Map({}),
  modifiedCustomEntries: Map({}),
});

// eslint-disable-next-line default-param-last
export default function sitemapReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS_SUCCEEDED:
      return state
        .update('settings', () => fromJS(action.settings))
        .updateIn(['settings', 'contentTypes'], () => fromJS(action.settings.get('contentTypes')))
        .updateIn(['settings', 'customEntries'], () => fromJS(action.settings.get('customEntries')))
        .update('initialData', () => fromJS(action.settings))
        .updateIn(['initialData', 'contentTypes'], () => fromJS(action.settings.get('contentTypes')))
        .updateIn(['initialData', 'customEntries'], () => fromJS(action.settings.get('customEntries')))
        .update('modifiedContentTypes', () => fromJS(action.settings.get('contentTypes')))
        .update('modifiedCustomEntries', () => fromJS(action.settings.get('customEntries')));
    case UPDATE_SETTINGS:
      return state
        .update('modifiedContentTypes', () => fromJS(action.settings.get('contentTypes')))
        .updateIn(['settings', 'contentTypes'], () => fromJS(action.settings.get('contentTypes')));
    case ON_CHANGE_CONTENT_TYPES:
      if (action.lang) {
        return state
          .updateIn(['modifiedContentTypes', action.contentType, 'languages', action.lang, action.key], () => action.value);
      } else {
        return state
          .updateIn(['modifiedContentTypes', action.contentType, action.key], () => action.value);
      }
    case ON_CHANGE_CUSTOM_ENTRY:
      return state
        .updateIn(['modifiedCustomEntries', action.url, action.key], () => action.value);
    case ON_CHANGE_SETTINGS:
      return state
        .updateIn(['settings', action.key], () => action.value);
    case DISCARD_ALL_CHANGES:
      return state
        .update('settings', () => state.get('initialData'))
        .update('modifiedContentTypes', () => state.getIn(['initialData', 'contentTypes']))
        .update('modifiedCustomEntries', () => state.getIn(['initialData', 'customEntries']));
    case DISCARD_MODIFIED_CONTENT_TYPES:
      return state
        .update('modifiedContentTypes', () => state.getIn(['settings', 'contentTypes']))
        .update('modifiedCustomEntries', () => state.getIn(['settings', 'customEntries']));
    case SUBMIT_MODAL:
      return state
        .updateIn(['settings', 'contentTypes'], () => state.get('modifiedContentTypes'))
        .updateIn(['settings', 'customEntries'], () => state.get('modifiedCustomEntries'));
    case DELETE_CONTENT_TYPE:
      if (state.getIn(['settings', 'contentTypes', action.key, 'languages']).size > 1) {
        return state
          .deleteIn(['settings', 'contentTypes', action.key, 'languages', action.lang])
          .deleteIn(['modifiedContentTypes', action.key, 'languages', action.lang]);
      } else {
        return state
          .deleteIn(['settings', 'contentTypes', action.key])
          .deleteIn(['modifiedContentTypes', action.key]);
      }
    case DELETE_CUSTOM_ENTRY:
      return state
        .deleteIn(['settings', 'customEntries', action.key])
        .deleteIn(['modifiedCustomEntries', action.key]);
    case GET_CONTENT_TYPES_SUCCEEDED:
      return state
        .update('contentTypes', () => action.contentTypes);
    case GET_LANGUAGES_SUCCEEDED:
      return state
        .update('languages', () => action.languages);
    case ON_SUBMIT_SUCCEEDED:
      return state
        .update('initialData', () => state.get('settings'));
    case GET_SITEMAP_INFO_SUCCEEDED:
      return state
        .update('info', () => fromJS(action.info));
    case GET_ALLOWED_FIELDS_SUCCEEDED:
      return state
        .update('allowedFields', () => action.fields);
    case SET_LOADING_STATE:
      return state
        .update('loading', () => action.loading);
    default:
      return state;
  }
}

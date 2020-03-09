/**
 *
 * ConfigPage reducer
 *
 */

import { fromJS, List, Map } from 'immutable';

import {
  GET_SETTINGS_SUCCEEDED,
  ON_CHANGE_CONTENT_TYPES,
  SUBMIT_MODAL,
  GET_CONTENT_TYPES_SUCCEEDED,
  DELETE_CONTENT_TYPE,
  DISCARD_ALL_CHANGES,
  DISCARD_MODIFIED_CONTENT_TYPES,
  ON_SUBMIT_SUCCEEDED,
  ON_CHANGE_SETTINGS,
} from './constants';

const initialState = fromJS({
  settings: Map({}),
  contentTypes: {},
  initialData: Map({}),
  modifiedContentTypes: Map({}),
});

function configPageReducer(state = initialState, action) {
  switch (action.type) {
    case GET_SETTINGS_SUCCEEDED:
      return state
        .update('settings', () => fromJS(action.settings))
        .update('initialData', () => fromJS(action.settings))
        .update('modifiedContentTypes', () => fromJS(action.settings.get('contentTypes')))
        .updateIn(['settings', 'contentTypes'], () => fromJS(action.settings.get('contentTypes')));
    case ON_CHANGE_CONTENT_TYPES:
      return state
        .updateIn(action.keys, () => action.value);
    case ON_CHANGE_SETTINGS:
        return state
          .updateIn(['settings', action.key], () => action.value);
    case DISCARD_ALL_CHANGES:
      return state
        .update('settings', () => state.get('initialData'))
        .update('modifiedContentTypes', () => state.getIn(['initialData', 'contentTypes']))
    case DISCARD_MODIFIED_CONTENT_TYPES:
      return state
        .update('modifiedContentTypes', () => state.getIn(['settings', 'contentTypes']))
    case SUBMIT_MODAL:
      return state
        .updateIn(['settings', 'contentTypes'], () => state.get('modifiedContentTypes'));
    case DELETE_CONTENT_TYPE:
      return state
        .deleteIn(['settings', 'contentTypes', action.contentType])
    case GET_CONTENT_TYPES_SUCCEEDED:
      return state
        .update('contentTypes', () => action.contentTypes);
    case ON_SUBMIT_SUCCEEDED:
      return state
        .update('initialData', () => state.get('settings'))
    default:
      return state;
  }
}

export default configPageReducer;

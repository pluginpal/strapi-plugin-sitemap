/**
 *
 * ConfigPage selectors
 *
 */

import { createSelector } from 'reselect';
import pluginId from '../../pluginId';

/**
 * Direct selector to the configPage state domain
 */
const selectConfigPageDomain = () => state => state.get(`${pluginId}_configPage`);

/**
 * Default selector used by ConfigPage
 */

const selectConfigPage = () => createSelector(
  selectConfigPageDomain(),
  (substate) => substate.toJS(),
);

const makeSelectSettings = () => createSelector(
  selectConfigPageDomain(),
  (substate) => substate.get('settings').toJS(),
);

export default selectConfigPage;
export {
  makeSelectSettings
};
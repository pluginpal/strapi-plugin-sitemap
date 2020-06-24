/**
 *
 * ConfigPage saga's
 *
 */

import { call, fork, put, select, takeLatest } from 'redux-saga/effects';
import { Map } from 'immutable';
import { request } from 'strapi-helper-plugin';
import { getSettingsSucceeded, getContentTypesSucceeded, onSubmitSucceeded, updateSettings, hasSitemapSucceeded } from './actions';
import { SUBMIT, GET_SETTINGS, GET_CONTENT_TYPES, GENERATE_SITEMAP, POPULATE_SETTINGS, HAS_SITEMAP } from './constants';
import { makeSelectSettings } from './selectors';

export function* settingsGet() {
  try {
    const requestURL = `/sitemap/settings/`;
    const response = yield call(request, requestURL, { method: 'GET' });

    yield put(getSettingsSucceeded(Map(response)));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* getContentTypes() {
  try {
    const requestURL = `/content-manager/content-types`;
    const response = yield call(request, requestURL, { method: 'GET' });

    yield put(getContentTypesSucceeded(response.data));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* generateSitemap() {
  try {
    const requestURL = `/sitemap`;
    const response = yield call(request, requestURL, { method: 'GET' });

    strapi.notification.success(response.message)
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* submit() {
  try {
    let body = yield select(makeSelectSettings());

    const requestURL = '/sitemap/settings/';
    yield call(request, requestURL, { method: 'PUT', body });

    yield put(onSubmitSucceeded());

    strapi.notification.success('email.notification.config.success');
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* populateSettings() {
  try {
    const requestURL = '/sitemap/settings/populate';
    const response = yield call(request, requestURL, { method: 'GET' });
    yield put(updateSettings(Map(response)));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

export function* checkForSitemap() {
  try {
    const requestURL = '/sitemap/presence';
    const response = yield call(request, requestURL, { method: 'GET' });
    yield put(hasSitemapSucceeded(response.main));
  } catch (err) {
    strapi.notification.error('notification.error');
  }
}

function* defaultSaga() {
  yield fork(takeLatest, GET_SETTINGS, settingsGet);
  yield fork(takeLatest, GET_CONTENT_TYPES, getContentTypes);
  yield fork(takeLatest, GENERATE_SITEMAP, generateSitemap);
  yield fork(takeLatest, SUBMIT, submit);
  yield fork(takeLatest, POPULATE_SETTINGS, populateSettings);
  yield fork(takeLatest, HAS_SITEMAP, checkForSitemap);
}

export default defaultSaga;

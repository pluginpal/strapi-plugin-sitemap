import { combineReducers } from 'redux-immutable';
import sitemapReducer from './Sitemap';

const rootReducer = combineReducers({
  sitemap: sitemapReducer,
});

export default rootReducer;

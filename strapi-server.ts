import bootstrap from './server/bootstrap';
import register from './server/register';
import services from './server/services';
import routes from './server/routes';
import config from './server/config';
import controllers from './server/controllers';
import contentTypes from './server/content-types';

export default () => ({
  bootstrap,
  register,
  routes,
  config,
  controllers,
  services,
  contentTypes,
});

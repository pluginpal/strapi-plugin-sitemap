import strapi from '@strapi/strapi';

const test = async () => {
  const appDir = process.cwd();
  const app = await strapi({ appDir, distDir: appDir }).load();

  app.db.lifecycles.subscribe({
    models: [],
    afterCreate(event) {
      console.log(event);
    },
  });
};

test();

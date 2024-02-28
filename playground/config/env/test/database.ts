const path = require('path');

export default ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '../..', env('DATABASE_FILENAME', '.tmp/test-data.db')),
    },
    useNullAsDefault: true,
  },
});

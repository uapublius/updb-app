let path = require('path');
let { recase } = require('@kristiandupont/recase');

module.exports = {
  connection: {
    host: 'localhost',
    user: 'postgres',
    database: 'phenomenon',
  },

  modelNominator: recase('snake', 'pascal'),
  typeNominator: recase('snake', 'pascal'),
  preDeleteModelFolder: true,

  customTypeMap: {
    tsvector: 'string',
    bpchar: 'string',
    numeric: 'number'
  },

  schemas: [
    {
      name: 'api',
      ignore: [
        'knex_migrations',
        'knex_migrations_lock',
        'report_count_by_location'
      ],
      modelFolder: path.join(__dirname, 'src', 'models'),
    },
  ],
};

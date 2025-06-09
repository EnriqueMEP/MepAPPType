import knex from 'knex';

const testConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:'
  },
  useNullAsDefault: true,
  migrations: {
    directory: './database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'ts',
  },
};

export const testDb = knex(testConfig);

export default testDb;

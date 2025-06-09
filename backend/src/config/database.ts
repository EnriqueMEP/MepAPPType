import knex from 'knex';
import { config } from './index';

const knexConfig = {
  client: 'pg',
  connection: config.database,
  migrations: {
    directory: './database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './database/seeds',
    extension: 'ts',
  },
  pool: {
    min: 2,
    max: 10,
  },
};

export const db = knex(knexConfig);

export default db;

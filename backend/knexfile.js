const path = require('path');

module.exports = {  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'mep_user',
      password: process.env.DB_PASSWORD || 'mep_password',
      database: process.env.DB_NAME || 'mep_projects_db'
    },    migrations: {
      directory: path.join(__dirname, 'src', 'database', 'migrations-js')
    },    seeds: {
      directory: path.join(__dirname, 'src', 'database', 'seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'database', 'seeds')
    },
    pool: {
      min: 5,
      max: 30
    }
  },

  test: {
    client: 'pg',
    connection: {
      host: process.env.TEST_DB_HOST || 'localhost',
      port: process.env.TEST_DB_PORT || 5432,
      user: process.env.TEST_DB_USER || 'mep_test_user',
      password: process.env.TEST_DB_PASSWORD || 'mep_test_password',
      database: process.env.TEST_DB_NAME || 'mep_projects_test_db'
    },
    migrations: {
      directory: path.join(__dirname, 'src', 'database', 'migrations')
    },
    seeds: {
      directory: path.join(__dirname, 'src', 'database', 'seeds')
    }
  }
};

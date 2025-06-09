import 'module-alias/register';

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'mep_projects_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASS = 'postgres123';
process.env.JWT_SECRET = 'test-secret-key';
process.env.BCRYPT_ROUNDS = '4'; // Usar menos rounds para pruebas más rápidas

// Mock de la base de datos para pruebas unitarias
jest.mock('@config/database', () => {
  const knex = require('knex');
  return knex({
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    migrations: {
      directory: './src/database/migrations'
    }
  });
});

// Mock console para pruebas más limpias
const originalConsole = console;
global.console = {
  ...originalConsole,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};

// Restaurar console después de las pruebas si es necesario
afterAll(() => {
  global.console = originalConsole;
});

// Configuración global para Jest
import 'jest';

// Mock completo para la base de datos
const createMockQueryBuilder = () => ({
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockResolvedValue(null),
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([{ id: 'test-id' }]),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockResolvedValue(1),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  count: jest.fn().mockResolvedValue([{ count: '0' }]),
  then: jest.fn((callback) => callback([])),
  catch: jest.fn(),
});

const mockKnex = jest.fn(() => createMockQueryBuilder());

// Asignar propiedades al mock usando Object.assign para evitar errores de TypeScript
Object.assign(mockKnex, {
  migrate: {
    latest: jest.fn().mockResolvedValue([]),
    rollback: jest.fn().mockResolvedValue([]),
  },
  destroy: jest.fn().mockResolvedValue(undefined),
  schema: {
    createTable: jest.fn().mockReturnThis(),
    dropTable: jest.fn().mockReturnThis(),
    hasTable: jest.fn().mockResolvedValue(false),
  },
});

// Mock para el módulo de base de datos
jest.mock('../src/config/database', () => ({
  db: mockKnex,
}));

// Mock para módulos relacionados con base de datos que pueden causar problemas
jest.mock('pg', () => ({
  Pool: jest.fn(),
  Client: jest.fn(),
}));

jest.mock('knex', () => jest.fn(() => mockKnex));

// Configuración de timeout
jest.setTimeout(10000);

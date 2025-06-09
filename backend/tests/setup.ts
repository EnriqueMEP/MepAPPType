import 'module-alias/register';

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_NAME = 'mep_projects_test';
process.env.DB_USER = 'postgres';
process.env.DB_PASS = 'postgres123';
process.env.JWT_SECRET = 'test-secret-key';
process.env.BCRYPT_ROUNDS = '4';

// Mock más robusto de la base de datos
const createMockQueryBuilder = () => {
  const mockQueryBuilder = {
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
    join: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    rightJoin: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    orWhere: jest.fn().mockReturnThis(),
    whereIn: jest.fn().mockReturnThis(),
    whereNotIn: jest.fn().mockReturnThis(),
    whereNull: jest.fn().mockReturnThis(),
    whereNotNull: jest.fn().mockReturnThis(),
    whereBetween: jest.fn().mockReturnThis(),
    whereNotBetween: jest.fn().mockReturnThis(),
    whereExists: jest.fn().mockReturnThis(),
    whereNotExists: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orWhereNot: jest.fn().mockReturnThis(),
    then: jest.fn((callback) => callback([])),
    catch: jest.fn(),
  };
  return mockQueryBuilder;
};

const mockDb = Object.assign(
  // Función principal que actúa como knex()
  jest.fn().mockImplementation(() => createMockQueryBuilder()),
  {
    // Métodos del objeto knex
    migrate: {
      latest: jest.fn().mockResolvedValue([]),
      rollback: jest.fn().mockResolvedValue([]),
    },
    destroy: jest.fn().mockResolvedValue(undefined),
    // Métodos de esquema
    schema: {
      createTable: jest.fn().mockReturnThis(),
      dropTable: jest.fn().mockReturnThis(),
      hasTable: jest.fn().mockResolvedValue(false),
      alterTable: jest.fn().mockReturnThis(),
    },
    // Métodos de transacción
    transaction: jest.fn().mockImplementation((callback) => {
      const trx = createMockQueryBuilder();
      return callback(trx);
    }),
    // Método raw
    raw: jest.fn().mockResolvedValue({ rows: [] }),
  }
);

// Mock para todas las variantes de importación de database
jest.doMock('../../src/config/database', () => ({
  db: mockDb,
  default: mockDb
}));

jest.doMock('@config/database', () => ({
  db: mockDb,
  default: mockDb
}));

// Configurar timeouts para tests largos
jest.setTimeout(30000);

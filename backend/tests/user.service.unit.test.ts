/// <reference types="jest" />

import { UserService } from '../src/services/UserService';
import { UserRole } from '../src/types/common';

// Mock de la base de datos
const mockDb = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn(),
  returning: jest.fn(),
  orderBy: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
  count: jest.fn(),
  clone: jest.fn().mockReturnThis(),
};

// Mock del módulo de base de datos
jest.mock('../../src/config/database', () => ({
  db: jest.fn(() => mockDb),
}));

describe('UserService Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset all mock implementations
    mockDb.first.mockResolvedValue(null);
    mockDb.returning.mockResolvedValue([{ id: 'test-id' }]);
    mockDb.del.mockResolvedValue(1);
    mockDb.count.mockResolvedValue([{ count: '0' }]);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashed_password',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.EMPLOYEE,
      };

      const mockUser = {
        id: 'test-id',
        ...userData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockDb.returning.mockResolvedValue([mockUser]);

      const result = await UserService.create(userData);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-id');
    });
  });

  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.EMPLOYEE,
      };

      mockDb.first.mockResolvedValue(mockUser);

      const result = await UserService.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return null when email does not exist', async () => {
      mockDb.first.mockResolvedValue(null);

      const result = await UserService.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when id exists', async () => {
      const mockUser = {
        id: 'test-id',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: UserRole.EMPLOYEE,
      };

      mockDb.first.mockResolvedValue(mockUser);

      const result = await UserService.findById('test-id');

      expect(result).toEqual(mockUser);
    });

    it('should return null when id does not exist', async () => {
      mockDb.first.mockResolvedValue(null);

      const result = await UserService.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });
  describe('list', () => {
    it('should return paginated users', async () => {
      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          first_name: 'User',
          last_name: 'One',
          role: UserRole.EMPLOYEE,
        },
        {
          id: '2',
          email: 'user2@example.com',
          first_name: 'User',
          last_name: 'Two',
          role: UserRole.MANAGER,
        },
      ];

      // Mock para el conteo
      mockDb.count.mockResolvedValue([{ count: '2' }]);
      // Mock para los usuarios
      mockDb.select.mockResolvedValue(mockUsers);

      const result = await UserService.list({ page: 1, limit: 10 });

      expect(result).toBeDefined();
      expect(result.users).toEqual(mockUsers);
      expect(result.total).toBe(2);
    });
  });
});

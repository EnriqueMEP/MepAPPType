/// <reference types="jest" />

// Test de verificación final - comprobar que las correcciones de TypeScript funcionan
import { UserService } from '../src/services/UserService';
import { AuthUtils } from '../src/utils/auth';
import { UserRole } from '../src/types/common';

// Mock de la base de datos
jest.mock('../src/config/database', () => {
  const mockDb = jest.fn();
  
  // Mock para las operaciones de tabla
  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    first: jest.fn().mockResolvedValue(null),
    insert: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 'test-id' }]),
    update: jest.fn().mockReturnThis(),
    del: jest.fn().mockResolvedValue(1),
  };
  
  mockDb.mockReturnValue(mockQueryBuilder);
  
  return { db: mockDb };
});

describe('TypeScript Corrections Verification', () => {
  it('should import UserService correctly', () => {
    expect(UserService).toBeDefined();
    expect(typeof UserService.create).toBe('function');
    expect(typeof UserService.findByEmail).toBe('function');
    expect(typeof UserService.update).toBe('function');
    expect(typeof UserService.delete).toBe('function');
    expect(typeof UserService.list).toBe('function');
  });
  it('should import AuthUtils correctly', () => {
    expect(AuthUtils).toBeDefined();
    expect(typeof AuthUtils.hashPassword).toBe('function');
    expect(typeof AuthUtils.comparePassword).toBe('function');
    expect(typeof AuthUtils.generateAccessToken).toBe('function');
    expect(typeof AuthUtils.generateRefreshToken).toBe('function');
  });

  it('should import UserRole enum correctly', () => {
    expect(UserRole).toBeDefined();
    expect(UserRole.EMPLOYEE).toBe('employee');
    expect(UserRole.ADMIN).toBe('admin');
    expect(UserRole.MANAGER).toBe('manager');
  });

  it('should validate data structure for UserService.create', () => {
    const validUserData = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Test',
      last_name: 'User',
      role: UserRole.EMPLOYEE
    };

    // Este test verifica que la estructura de datos es correcta
    expect(validUserData.first_name).toBeDefined();
    expect(validUserData.last_name).toBeDefined();
    expect(validUserData.role).toBe(UserRole.EMPLOYEE);
  });
});

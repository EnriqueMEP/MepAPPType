/// <reference types="jest" />

import { AuthUtils } from '../src/utils/auth';
import { UserService } from '../src/services/UserService';
import { UserRole } from '../src/types/common';

// Mock UserService
jest.mock('../src/services/UserService', () => ({
  UserService: {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}));

// Mock AuthUtils
jest.mock('../src/utils/auth', () => ({
  AuthUtils: {
    hashPassword: jest.fn(),
    comparePassword: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyToken: jest.fn(),
    extractTokenFromHeader: jest.fn(),
  }
}));

describe('Auth Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UserService Unit Tests', () => {
    it('should call create with correct parameters', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        first_name: 'Test',
        last_name: 'User',
        role: UserRole.EMPLOYEE,
      };

      const mockUser = { id: '1', ...userData };
      (UserService.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.create(userData);

      expect(UserService.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });

    it('should call findByEmail with correct email', async () => {
      const email = 'test@example.com';
      const mockUser = { id: '1', email, first_name: 'Test', last_name: 'User' };
      
      (UserService.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserService.findByEmail(email);

      expect(UserService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
  });

  describe('AuthUtils Unit Tests', () => {
    it('should hash password correctly', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      
      (AuthUtils.hashPassword as jest.Mock).mockResolvedValue(hashedPassword);

      const result = await AuthUtils.hashPassword(password);

      expect(AuthUtils.hashPassword).toHaveBeenCalledWith(password);
      expect(result).toBe(hashedPassword);
    });

    it('should compare passwords correctly', async () => {
      const password = 'password123';
      const hashedPassword = 'hashed_password';
      
      (AuthUtils.comparePassword as jest.Mock).mockResolvedValue(true);

      const result = await AuthUtils.comparePassword(password, hashedPassword);

      expect(AuthUtils.comparePassword).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBe(true);
    });    it('should generate access token correctly', () => {
      const mockUser = { 
        id: '1', 
        email: 'test@example.com',
        role: 'employee',
        first_name: 'Test',
        last_name: 'User'
      };
      const token = 'mock_token';
      
      (AuthUtils.generateAccessToken as jest.Mock).mockReturnValue(token);

      const result = AuthUtils.generateAccessToken(mockUser as any);

      expect(AuthUtils.generateAccessToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(token);
    });

    it('should generate refresh token correctly', () => {
      const mockUser = { 
        id: '1', 
        email: 'test@example.com',
        role: 'employee',
        first_name: 'Test',
        last_name: 'User'
      };
      const token = 'mock_refresh_token';
      
      (AuthUtils.generateRefreshToken as jest.Mock).mockReturnValue(token);

      const result = AuthUtils.generateRefreshToken(mockUser as any);

      expect(AuthUtils.generateRefreshToken).toHaveBeenCalledWith(mockUser);
      expect(result).toBe(token);
    });
  });
});

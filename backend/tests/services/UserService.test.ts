import { db } from '../../src/config/database';
import { UserService } from '../../src/services/UserService';
import { AuthUtils } from '../../src/utils/auth';
import { UserRole } from '../../src/types/common';

describe('UserService', () => {
  beforeAll(async () => {
    // Ejecutar migraciones para testing
    await db.migrate.latest();
  });

  afterAll(async () => {
    // Limpiar base de datos y cerrar conexión
    await db.migrate.rollback();
    await db.destroy();
  });

  beforeEach(async () => {
    // Limpiar datos antes de cada prueba
    await db('users').del();
  });  describe('create', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE
      };

      const user = await UserService.create(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.first_name).toBe(userData.first_name);
      expect(user.last_name).toBe(userData.last_name);
      expect(user.role).toBe(userData.role);
      expect(user.password_hash).toBeDefined();
    });

    it('should throw error when creating user with duplicate email', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE
      };

      await UserService.create(userData);

      await expect(UserService.create(userData))
        .rejects.toThrow('El email ya está registrado');
    });

    it('should hash password before storing', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.EMPLOYEE
      };

      await UserService.create(userData);

      const userInDb = await db('users')
        .where({ email: userData.email })
        .first();

      expect(userInDb.password_hash).not.toBe(userData.password);
      expect(userInDb.password_hash).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });
  describe('findByEmail', () => {
    it('should return user when email exists', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password_hash: await AuthUtils.hashPassword('password123'),
        role: UserRole.EMPLOYEE
      };

      await db('users').insert(userData);

      const user = await UserService.findByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
      expect(user?.first_name).toBe(userData.first_name);
    });

    it('should return null when email does not exist', async () => {
      const user = await UserService.findByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });
  describe('update', () => {
    it('should update user successfully', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password_hash: await AuthUtils.hashPassword('password123'),
        role: UserRole.EMPLOYEE
      };

      const [userId] = await db('users').insert(userData).returning('id');

      const updateData = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updated@example.com'
      };

      const updatedUser = await UserService.update(userId.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser.first_name).toBe(updateData.first_name);
      expect(updatedUser.email).toBe(updateData.email);
    });    it('should throw error when updating non-existent user', async () => {
      await expect(UserService.update('non-existent-id', {
        first_name: 'Updated User'
      })).rejects.toThrow('Usuario no encontrado');
    });
  });
  describe('delete', () => {
    it('should delete user successfully', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password_hash: await AuthUtils.hashPassword('password123'),
        role: UserRole.EMPLOYEE
      };

      const [user] = await db('users').insert(userData).returning('*');

      await UserService.delete(user.id);

      const userInDb = await db('users').where({ id: user.id }).first();
      expect(userInDb).toBeUndefined();
    });

    it('should throw error when deleting non-existent user', async () => {
      await expect(UserService.delete('non-existent-id'))
        .rejects.toThrow('Usuario no encontrado');
    });
  });
  describe('list', () => {
    it('should return paginated users', async () => {
      // Crear varios usuarios para testing
      const users = Array.from({ length: 15 }, (_, i) => ({
        first_name: `User`,
        last_name: `${i + 1}`,
        email: `user${i + 1}@example.com`,
        password_hash: 'hashedpassword',
        role: UserRole.EMPLOYEE
      }));

      await db('users').insert(users);

      const result = await UserService.list({ page: 1, limit: 10 });

      expect(result.users).toHaveLength(10);
      expect(result.total).toBe(15);
    });

    it('should filter users by search term', async () => {
      const users = [
        {
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          password_hash: 'hashedpassword',
          role: UserRole.EMPLOYEE
        },
        {
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane@example.com',
          password_hash: 'hashedpassword',
          role: UserRole.MANAGER
        }
      ];

      await db('users').insert(users);

      const result = await UserService.list({ page: 1, limit: 10, search: 'John' });

      expect(result.users).toHaveLength(1);
      expect(result.users[0].first_name).toBe('John');
    });
  });
});

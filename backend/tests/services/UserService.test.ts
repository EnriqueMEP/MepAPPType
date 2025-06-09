import { db } from '../../src/config/database';
import UserService from '../../src/services/UserService';
import { hashPassword } from '../../src/utils/auth';

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
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee' as const
      };

      const user = await UserService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.role).toBe(userData.role);
      expect(user.password).toBeUndefined(); // Password should not be returned
    });

    it('should throw error when creating user with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee' as const
      };

      await UserService.createUser(userData);

      await expect(UserService.createUser(userData))
        .rejects.toThrow('Email already exists');
    });

    it('should hash password before storing', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee' as const
      };

      await UserService.createUser(userData);

      const userInDb = await db('users')
        .where({ email: userData.email })
        .first();

      expect(userInDb.password).not.toBe(userData.password);
      expect(userInDb.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when email exists', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: await hashPassword('password123'),
        role: 'employee'
      };

      await db('users').insert(userData);

      const user = await UserService.getUserByEmail('test@example.com');

      expect(user).toBeDefined();
      expect(user?.email).toBe(userData.email);
      expect(user?.name).toBe(userData.name);
    });

    it('should return null when email does not exist', async () => {
      const user = await UserService.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: await hashPassword('password123'),
        role: 'employee'
      };

      const [userId] = await db('users').insert(userData).returning('id');

      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com'
      };

      const updatedUser = await UserService.updateUser(userId.id, updateData);

      expect(updatedUser).toBeDefined();
      expect(updatedUser?.name).toBe(updateData.name);
      expect(updatedUser?.email).toBe(updateData.email);
    });

    it('should return null when updating non-existent user', async () => {
      const updatedUser = await UserService.updateUser('non-existent-id', {
        name: 'Updated User'
      });

      expect(updatedUser).toBeNull();
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: await hashPassword('password123'),
        role: 'employee'
      };

      const [user] = await db('users').insert(userData).returning('*');

      const deleted = await UserService.deleteUser(user.id);
      expect(deleted).toBe(true);

      const userInDb = await db('users').where({ id: user.id }).first();
      expect(userInDb).toBeUndefined();
    });

    it('should return false when deleting non-existent user', async () => {
      const deleted = await UserService.deleteUser('non-existent-id');
      expect(deleted).toBe(false);
    });
  });

  describe('getAllUsers', () => {
    it('should return paginated users', async () => {
      // Crear varios usuarios para testing
      const users = Array.from({ length: 15 }, (_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'hashedpassword',
        role: 'employee'
      }));

      await db('users').insert(users);

      const result = await UserService.getAllUsers(1, 10);

      expect(result.users).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(2);
    });

    it('should filter users by search term', async () => {
      const users = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'hashedpassword',
          role: 'employee'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'hashedpassword',
          role: 'manager'
        }
      ];

      await db('users').insert(users);

      const result = await UserService.getAllUsers(1, 10, 'John');

      expect(result.users).toHaveLength(1);
      expect(result.users[0].name).toBe('John Doe');
    });
  });
});

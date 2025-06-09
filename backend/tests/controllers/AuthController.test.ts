import request from 'supertest';
import express from 'express';
import { db } from '../../src/config/database';
import authRoutes from '@/routes/auth';
import { ErrorHandler } from '@/middleware/errorHandler';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(ErrorHandler);

describe('AuthController', () => {
  beforeAll(async () => {
    await db.migrate.latest();
  });

  afterAll(async () => {
    await db.migrate.rollback();
    await db.destroy();
  });

  beforeEach(async () => {
    await db('users').del();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
        role: 'employee'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Datos de entrada inválidos');
    });

    it('should return error for short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
        role: 'employee'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      // Registrar usuario por primera vez
      await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      // Intentar registrar mismo email
      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Email already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      // Primero registrar un usuario
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      await request(app)
        .post('/auth/register')
        .send(userData);

      // Intentar login
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Inicio de sesión exitoso');
      expect(response.body.data.user.email).toBe(loginData.email);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('should return error for invalid password', async () => {
      // Registrar usuario
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      await request(app)
        .post('/auth/register')
        .send(userData);

      // Intentar login con password incorrecta
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Credenciales inválidas');
    });

    it('should return error for missing fields', async () => {
      const loginData = {
        email: 'test@example.com'
        // password missing
      };

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /auth/profile', () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
      // Registrar y login para obtener token
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData);

      token = registerResponse.body.data.token;
      userId = registerResponse.body.data.user.id;
    });

    it('should return user profile with valid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(userId);
      expect(response.body.data.email).toBe('test@example.com');
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return error without token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token no proporcionado');
    });

    it('should return error with invalid token', async () => {
      const response = await request(app)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Token inválido');
    });
  });

  describe('PUT /auth/profile', () => {
    let token: string;
    let userId: string;

    beforeEach(async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'employee'
      };

      const registerResponse = await request(app)
        .post('/auth/register')
        .send(userData);

      token = registerResponse.body.data.token;
      userId = registerResponse.body.data.user.id;
    });

    it('should update user profile successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com'
      };

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.email).toBe(updateData.email);
    });

    it('should return error for invalid email format', async () => {
      const updateData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .put('/auth/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should return error without authorization', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const response = await request(app)
        .put('/auth/profile')
        .send(updateData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});

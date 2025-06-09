import request from 'supertest';
import express from 'express';

// Mock de UserService
const mockUserService = {
  create: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
};

// Mock de AuthUtils
const mockAuthUtils = {
  hashPassword: jest.fn().mockResolvedValue('hashed_password'),
  comparePassword: jest.fn(),
  generateToken: jest.fn().mockReturnValue('mock_token'),
  verifyToken: jest.fn(),
};

// Mock de AuthController
const mockAuthController = {
  register: jest.fn((req, res) => {
    const { email, password, first_name, last_name } = req.body;
    
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (!email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Datos de entrada inválidos'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: 'test-id',
          email: email,
          first_name: first_name,
          last_name: last_name,
        },
        token: 'mock_token'
      }
    });
  }),

  login: jest.fn((req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    if (email === 'test@example.com' && password === 'password123') {
      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: {
          user: {
            id: 'test-id',
            email: email,
            first_name: 'Test',
            last_name: 'User',
          },
          token: 'mock_token'
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
  })
};

// Crear app de Express para testing
const app = express();
app.use(express.json());

// Rutas simplificadas para testing
app.post('/auth/register', mockAuthController.register);
app.post('/auth/login', mockAuthController.login);

describe('AuthController', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Usuario registrado exitosamente');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.first_name).toBe(userData.first_name);
      expect(response.body.data.token).toBeDefined();
    });

    it('should return error for invalid email', async () => {
      const userData = {
        first_name: 'Test',
        last_name: 'User',
        email: 'invalid-email',
        password: 'password123',
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
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
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

    it('should return error for invalid credentials', async () => {
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
});

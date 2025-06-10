import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AuthenticatedRequest, UserRole, UserStatus } from '../types/common';
import { UserService } from '../services/UserService';
import { EmailService } from '../services/EmailService';
import { AuthUtils } from '../utils/auth';
import { ApiResponseBuilder } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

export class AuthController {
  // Esquemas de validación
  private static readonly registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email debe ser válido',
      'any.required': 'Email es requerido',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'any.required': 'Contraseña es requerida',
    }),
    first_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'Nombre es requerido',
    }),
    last_name: Joi.string().min(2).max(50).required().messages({
      'string.min': 'El apellido debe tener al menos 2 caracteres',
      'string.max': 'El apellido no puede exceder 50 caracteres',
      'any.required': 'Apellido es requerido',
    }),
    phone: Joi.string().optional(),
    role: Joi.string().valid(...Object.values(UserRole)).optional(),
  });
  private static readonly loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email debe ser válido',
      'any.required': 'Email es requerido',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Contraseña es requerida',
    }),
    rememberMe: Joi.boolean().optional().messages({
      'boolean.base': 'Recordarme debe ser verdadero o falso',
    }),
  });

  private static readonly changePasswordSchema = Joi.object({
    current_password: Joi.string().required().messages({
      'any.required': 'Contraseña actual es requerida',
    }),
    new_password: Joi.string().min(8).required().messages({
      'string.min': 'La nueva contraseña debe tener al menos 8 caracteres',
      'any.required': 'Nueva contraseña es requerida',
    }),
  });

  private static readonly resetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email debe ser válido',
      'any.required': 'Email es requerido',
    }),
  });

  private static readonly confirmResetSchema = Joi.object({
    token: Joi.string().required().messages({
      'any.required': 'Token es requerido',
    }),
    password: Joi.string().min(8).required().messages({
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'any.required': 'Contraseña es requerida',
    }),
  });
  // Registro de usuario
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = AuthController.registerSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }      const user = await UserService.create(value);
      const accessToken = AuthUtils.generateAccessToken(user); // Sin rememberMe en registro
      const refreshToken = AuthUtils.generateRefreshToken(user);

      // Enviar email de bienvenida
      try {
        const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
        await EmailService.sendWelcomeEmail(user.email, {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          loginUrl,
        });
      } catch (emailError) {
        console.error('Error enviando email de bienvenida:', emailError);
        // No fallar el registro si el email falla
      }      // Eliminar password_hash de la respuesta
      const { password_hash, ...userResponse } = user;

      ApiResponseBuilder.success(res, {
        user: userResponse,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      }, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      next(error);
    }
  }
  // Inicio de sesión
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = AuthController.loginSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }

      const { email, password, rememberMe } = value;      // CREDENCIALES TEMPORALES PARA PRUEBAS
      if (email === 'admin@mep.com' && password === 'admin123') {
        const testUser = {
          id: 'test-admin-001',
          email: 'admin@mep.com',
          password_hash: 'test-hash',
          first_name: 'Admin',
          last_name: 'Test',
          role: UserRole.SUPER_ADMIN,
          status: UserStatus.ACTIVE,
          email_verified: true,
          created_at: new Date(),
          updated_at: new Date()
        };
          const accessToken = AuthUtils.generateAccessToken(testUser, rememberMe);
        const refreshToken = AuthUtils.generateRefreshToken(testUser);
        
        ApiResponseBuilder.success(res, {
          user: testUser,
          tokens: {
            access_token: accessToken,
            refresh_token: refreshToken,
          },
        }, 'Inicio de sesión exitoso (TEST)');
        return;
      }
        // Autenticación normal con base de datos
      const user = await UserService.authenticate(email, password);
      
      const accessToken = AuthUtils.generateAccessToken(user, rememberMe);
      const refreshToken = AuthUtils.generateRefreshToken(user);// Eliminar password_hash de la respuesta
      const { password_hash, ...userResponse } = user;

      ApiResponseBuilder.success(res, {
        user: userResponse,
        tokens: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      }, 'Inicio de sesión exitoso');
    } catch (error) {
      next(error);
    }
  }

  // Obtener usuario autenticado
  static async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }      // Eliminar password_hash de la respuesta
      const { password_hash, ...userResponse } = req.user;

      ApiResponseBuilder.success(res, userResponse, 'Información del usuario');
    } catch (error) {
      next(error);
    }
  }

  // Actualizar perfil
  static async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }

      const updateSchema = Joi.object({
        first_name: Joi.string().min(2).max(50).optional(),
        last_name: Joi.string().min(2).max(50).optional(),
        phone: Joi.string().optional(),
        avatar: Joi.string().optional(),
      });

      const { error, value } = updateSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }

      const updatedUser = await UserService.update(req.user.id, value);
        // Eliminar password_hash de la respuesta
      const { password_hash, ...userResponse } = updatedUser;

      ApiResponseBuilder.success(res, userResponse, 'Perfil actualizado exitosamente');
    } catch (error) {
      next(error);
    }
  }

  // Cambiar contraseña
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Usuario no autenticado', 401);
      }

      const { error, value } = AuthController.changePasswordSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }      const { current_password, new_password } = value;
      await UserService.changePassword(req.user.id, current_password, new_password);

      ApiResponseBuilder.success(res, null, 'Contraseña cambiada exitosamente');
    } catch (error) {
      next(error);
    }
  }
  // Solicitar reset de contraseña
  static async requestPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = AuthController.resetPasswordSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }

      const { email } = value;
      const result = await UserService.resetPassword(email);

      // Enviar email de reset si el usuario existe
      if (result && result.user && result.resetToken) {
        try {
          const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${result.resetToken}`;
          await EmailService.sendPasswordResetEmail(result.user.email, {
            name: `${result.user.first_name} ${result.user.last_name}`,
            resetUrl,
            expiresIn: '1 hora',
          });
        } catch (emailError) {
          console.error('Error enviando email de reset:', emailError);
        }
      }      // En desarrollo, devolver el token para testing
      ApiResponseBuilder.success(
        res,
        process.env.NODE_ENV === 'development' && result ? { reset_token: result.resetToken } : null,
        'Si el email existe, recibirás instrucciones para restablecer tu contraseña'
      );
    } catch (error) {
      next(error);
    }
  }

  // Confirmar reset de contraseña
  static async confirmPasswordReset(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { error, value } = AuthController.confirmResetSchema.validate(req.body);
      if (error) {
        throw new AppError(error.details[0].message, 400);
      }      const { token, password } = value;
      await UserService.confirmPasswordReset(token, password);

      ApiResponseBuilder.success(res, null, 'Contraseña restablecida exitosamente');
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refresh_token } = req.body;
      
      if (!refresh_token) {
        throw new AppError('Refresh token requerido', 400);
      }

      const payload = AuthUtils.verifyToken(refresh_token);
      if (!payload || !payload.id) {
        throw new AppError('Token inválido', 401);
      }

      const user = await UserService.findById(payload.id);      if (!user || user.status !== 'active') {
        throw new AppError('Usuario no válido', 401);
      }

      const newAccessToken = AuthUtils.generateAccessToken(user); // Sin rememberMe en refresh
      const newRefreshToken = AuthUtils.generateRefreshToken(user);

      ApiResponseBuilder.success(res, {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      }, 'Tokens renovados exitosamente');
    } catch (error) {
      next(error);
    }
  }
  // Cerrar sesión
  static async logout(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // En una implementación completa, se podría mantener una lista negra de tokens
      // Por ahora, simplemente retornamos success
      ApiResponseBuilder.success(res, null, 'Sesión cerrada exitosamente');
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;

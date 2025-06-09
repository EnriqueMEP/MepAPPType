import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'joi';
import { ApiResponseBuilder } from '../utils/response';

export class ErrorHandler {
  static handle(
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error('Error:', error);    // Error de validación Joi
    if (error instanceof ValidationError) {
      const errors = error.details.map(detail => detail.message);
      ApiResponseBuilder.error(res, 'Datos de entrada inválidos', 400);
      return;
    }

    // Error de JWT
    if (error.name === 'JsonWebTokenError') {
      ApiResponseBuilder.error(res, 'Token inválido', 401);
      return;
    }

    if (error.name === 'TokenExpiredError') {
      ApiResponseBuilder.error(res, 'Token expirado', 401);
      return;
    }

    // Error de base de datos
    if (error.code === '23505') { // Duplicate key
      ApiResponseBuilder.error(res, 'El recurso ya existe', 409);
      return;
    }

    if (error.code === '23503') { // Foreign key violation
      ApiResponseBuilder.error(res, 'Referencia inválida', 400);
      return;
    }

    if (error.code === '23502') { // Not null violation
      ApiResponseBuilder.error(res, 'Campo requerido faltante', 400);
      return;
    }

    // Error personalizado con status code
    if (error.statusCode) {
      ApiResponseBuilder.error(res, error.message, error.statusCode);
      return;
    }

    // Error genérico del servidor
    ApiResponseBuilder.error(
      res,
      process.env.NODE_ENV === 'production' 
        ? 'Error interno del servidor' 
        : error.message,
      500
    );
  }
  static notFound(req: Request, res: Response): void {
    ApiResponseBuilder.error(res, `Ruta ${req.originalUrl} no encontrada`, 404);
  }
}

// Error personalizado para la aplicación
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;

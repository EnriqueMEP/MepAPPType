import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config/index';
import { ApiResponseBuilder } from '../utils/response';

// Rate limiting general
export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  handler: (req, res) => {
    ApiResponseBuilder.error(res, 'Demasiadas peticiones desde esta IP, inténtalo de nuevo más tarde', 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting para login
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por IP
  handler: (req, res) => {
    ApiResponseBuilder.error(res, 'Demasiados intentos de inicio de sesión, inténtalo de nuevo en 15 minutos', 429);
  },
  skipSuccessfulRequests: true,
});

// Rate limiting para registro
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 registros por IP por hora
  handler: (req, res) => {
    ApiResponseBuilder.error(res, 'Demasiados registros desde esta IP, inténtalo de nuevo en una hora', 429);
  },
});

// Rate limiting para API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // máximo 1000 peticiones por IP
  handler: (req, res) => {
    ApiResponseBuilder.error(res, 'Límite de API excedido, inténtalo de nuevo más tarde', 429);
  },
});

// Rate limiting para subida de archivos
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 20, // máximo 20 subidas por IP
  handler: (req, res) => {
    ApiResponseBuilder.error(res, 'Demasiadas subidas de archivos, inténtalo de nuevo más tarde', 429);
  },
});

// Middleware de validación de tamaño de request
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = req.headers['content-length'];
  
  if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) { // 50MB
    ApiResponseBuilder.error(res, 'El tamaño de la petición es demasiado grande', 413);
    return;
  }
  
  next();
};

export default {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  apiLimiter,
  uploadLimiter,
  requestSizeLimit,
};

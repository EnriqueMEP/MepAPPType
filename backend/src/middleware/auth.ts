import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/common';
import { AuthUtils } from '../utils/auth';
import { ApiResponseBuilder } from '../utils/response';
import { UserService } from '../services/UserService';

export class AuthMiddleware {
  static async authenticate(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
        if (!token) {
        ApiResponseBuilder.error(res, 'Token de acceso requerido', 401);
        return;
      }

      const payload = AuthUtils.verifyToken(token);
      const user = await UserService.findById(payload.id);      if (!user) {
        ApiResponseBuilder.error(res, 'Usuario no encontrado', 401);
        return;
      }

      if (user.status !== 'active') {
        ApiResponseBuilder.error(res, 'Cuenta de usuario inactiva', 401);
        return;
      }

      req.user = user;
      next();    } catch (error) {
      ApiResponseBuilder.error(res, 'Token inválido o expirado', 401);
    }
  }

  static authorize(...roles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        ApiResponseBuilder.error(res, 'Usuario no autenticado', 401);
        return;
      }

      if (!roles.includes(req.user.role)) {
        ApiResponseBuilder.error(res, 'No tienes permisos para acceder a este recurso', 403);
        return;
      }

      next();
    };
  }

  static optional(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void {
    const token = AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      next();
      return;
    }

    try {
      const payload = AuthUtils.verifyToken(token);
      UserService.findById(payload.id).then(user => {
        if (user && user.status === 'active') {
          req.user = user;
        }
        next();
      }).catch(() => {
        next();
      });
    } catch {
      next();
    }
  }
}

export default AuthMiddleware;

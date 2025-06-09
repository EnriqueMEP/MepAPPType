import { Router } from 'express';
import { AuthController } from '@controllers/AuthController';
import { AuthMiddleware } from '@middleware/auth';
import { loginLimiter, registerLimiter } from '@middleware/rateLimiting';

const router = Router();

// Rutas públicas (sin autenticación)
router.post('/register', registerLimiter, AuthController.register);
router.post('/login', loginLimiter, AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/request-password-reset', AuthController.requestPasswordReset);
router.post('/confirm-password-reset', AuthController.confirmPasswordReset);

// Rutas protegidas (requieren autenticación)
router.get('/me', AuthMiddleware.authenticate, AuthController.me);
router.put('/profile', AuthMiddleware.authenticate, AuthController.updateProfile);
router.post('/change-password', AuthMiddleware.authenticate, AuthController.changePassword);
router.post('/logout', AuthMiddleware.authenticate, AuthController.logout);

export default router;

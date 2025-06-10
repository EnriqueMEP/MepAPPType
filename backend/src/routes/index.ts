import { Router, Request, Response } from 'express';
import { config } from '../config/index';
import authRoutes from './auth';
import crmRoutes from './crm';
import rrhhRoutes from './rrhh';
import taskRoutes from './tasks';
import chatRoutes from './chat';
import filesRoutes from './files';

const router = Router();

// Ruta de salud del API
router.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'MEP-Projects API está funcionando correctamente',
    data: {
      version: config.API_VERSION,
      environment: config.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// Montar rutas del módulo de autenticación
router.use('/auth', authRoutes);

// Montar rutas de los módulos
router.use('/crm', crmRoutes);
router.use('/rrhh', rrhhRoutes);
router.use('/tasks', taskRoutes);
router.use('/chat', chatRoutes);
router.use('/files', filesRoutes);

export default router;

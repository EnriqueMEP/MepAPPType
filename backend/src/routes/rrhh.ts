// filepath: backend/src/routes/rrhh.ts
import { Router } from 'express';
import RRHHController from '../controllers/RRHHController';
import  authenticateToken  from '../middleware/auth';
import  rateLimiter  from '../middleware/rateLimiting';

const router = Router();

// Apply authentication and rate limiting to all routes
router.use(authenticateToken.authenticate);
router.use(rateLimiter.apiLimiter);

// Department routes
router.get('/departments', RRHHController.getAllDepartments);
router.get('/departments/hierarchy', RRHHController.getDepartmentHierarchy);
router.get('/departments/:id', RRHHController.getDepartmentById);
router.post('/departments', RRHHController.createDepartment);
router.put('/departments/:id', RRHHController.updateDepartment);
router.delete('/departments/:id', RRHHController.deleteDepartment);

// Position routes
router.get('/positions', RRHHController.getAllPositions);
router.get('/positions/:id', RRHHController.getPositionById);
router.get('/departments/:departmentId/positions', RRHHController.getPositionsByDepartment);
router.post('/positions', RRHHController.createPosition);
router.put('/positions/:id', RRHHController.updatePosition);
router.delete('/positions/:id', RRHHController.deletePosition);

// Employee routes
router.get('/employees', RRHHController.getAllEmployees);
router.get('/employees/:id', RRHHController.getEmployeeById);
router.get('/departments/:departmentId/employees', RRHHController.getEmployeesByDepartment);
router.post('/employees', RRHHController.createEmployee);
router.put('/employees/:id', RRHHController.updateEmployee);
router.patch('/employees/:id/status', RRHHController.updateEmployeeStatus);
router.delete('/employees/:id', RRHHController.deleteEmployee);

// Analytics and Reports routes
router.get('/stats', RRHHController.getRRHHStats);
router.get('/stats/employees-by-status', RRHHController.getEmployeesByStatus);
router.get('/reports/birthdays', RRHHController.getUpcomingBirthdays);
router.get('/reports/anniversaries', RRHHController.getWorkAnniversaries);

export default router;

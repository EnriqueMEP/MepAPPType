// filepath: backend/src/routes/tasks.ts
import { Router } from 'express';
import TasksController from '../controllers/TasksController';
import  authenticateToken  from '../middleware/auth';
import  rateLimiter  from '../middleware/rateLimiting';

const router = Router();

// Apply authentication and rate limiting to all routes
router.use(authenticateToken.authenticate);
router.use(rateLimiter.apiLimiter);

// Project routes
router.get('/projects', TasksController.getAllProjects);
router.get('/projects/progress', TasksController.getProjectProgress);
router.get('/projects/:id', TasksController.getProjectById);
router.post('/projects', TasksController.createProject);
router.put('/projects/:id', TasksController.updateProject);
router.patch('/projects/:id/status', TasksController.updateProjectStatus);
router.delete('/projects/:id', TasksController.deleteProject);

// Task routes
router.get('/tasks', TasksController.getAllTasks);
router.get('/tasks/my', TasksController.getMyTasks);
router.get('/tasks/:id', TasksController.getTaskById);
router.get('/projects/:projectId/tasks', TasksController.getTasksByProject);
router.get('/users/:userId/tasks', TasksController.getTasksByUser);
router.post('/tasks', TasksController.createTask);
router.put('/tasks/:id', TasksController.updateTask);
router.patch('/tasks/:id/status', TasksController.updateTaskStatus);
router.patch('/tasks/:id/order', TasksController.updateTaskOrder);
router.delete('/tasks/:id', TasksController.deleteTask);

// Comment routes
router.get('/tasks/:taskId/comments', TasksController.getCommentsByTask);
router.post('/comments', TasksController.createComment);
router.put('/comments/:id', TasksController.updateComment);
router.delete('/comments/:id', TasksController.deleteComment);

// Analytics routes
router.get('/stats', TasksController.getTasksStats);
router.get('/stats/tasks-by-status', TasksController.getTasksByStatus);
router.get('/stats/tasks-by-priority', TasksController.getTasksByPriority);
router.get('/users/:userId/workload', TasksController.getUserWorkload);
router.get('/workload/my', TasksController.getMyWorkload);

export default router;

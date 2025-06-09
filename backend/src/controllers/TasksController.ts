// filepath: backend/src/controllers/TasksController.ts
import { Request, Response } from 'express';
import TasksService from '../services/TasksService';
import { ApiResponseBuilder } from '../utils/response';
import { AuthenticatedRequest } from '../types/common';

export class TasksController {
  // Projects
  async getAllProjects(req: AuthenticatedRequest, res: Response) {
    try {
      const projects = await TasksService.getAllProjects();
      ApiResponseBuilder.success(res, projects, 'Projects retrieved successfully');
    } catch (error) {
      console.error('Error getting projects:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve projects', 500);
    }
  }

  async getProjectById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const project = await TasksService.getProjectById(id);
      
      if (!project) {
        return ApiResponseBuilder.error(res, 'Project not found', 404);
      }
      
      ApiResponseBuilder.success(res, project, 'Project retrieved successfully');
    } catch (error) {
      console.error('Error getting project:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve project', 500);
    }
  }
  async createProject(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const projectData = req.body;
      // Set owner_id to current user if not provided
      if (!projectData.owner_id) {
        projectData.owner_id = req.user.id;
      }
      
      const project = await TasksService.createProject(projectData);
      ApiResponseBuilder.success(res, project, 'Project created successfully', 201);
    } catch (error) {
      console.error('Error creating project:', error);
      ApiResponseBuilder.error(res, 'Failed to create project', 500);
    }
  }

  async updateProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const project = await TasksService.updateProject(id, updateData);
      
      if (!project) {
        return ApiResponseBuilder.error(res, 'Project not found', 404);
      }
      
      ApiResponseBuilder.success(res, project, 'Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      ApiResponseBuilder.error(res, 'Failed to update project', 500);
    }
  }

  async updateProjectStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const project = await TasksService.updateProjectStatus(id, status);
      
      if (!project) {
        return ApiResponseBuilder.error(res, 'Project not found', 404);
      }
      
      ApiResponseBuilder.success(res, project, 'Project status updated successfully');
    } catch (error) {
      console.error('Error updating project status:', error);
      ApiResponseBuilder.error(res, 'Failed to update project status', 500);
    }
  }

  async deleteProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TasksService.deleteProject(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Project not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      ApiResponseBuilder.error(res, 'Failed to delete project', 500);
    }
  }

  async getProjectProgress(req: AuthenticatedRequest, res: Response) {
    try {
      const projectProgress = await TasksService.getProjectProgress();
      ApiResponseBuilder.success(res, projectProgress, 'Project progress retrieved successfully');
    } catch (error) {
      console.error('Error getting project progress:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve project progress', 500);
    }
  }

  // Tasks
  async getAllTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const tasks = await TasksService.getAllTasks();
      ApiResponseBuilder.success(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks', 500);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const task = await TasksService.getTaskById(id);
      
      if (!task) {
        return ApiResponseBuilder.error(res, 'Task not found', 404);
      }
      
      ApiResponseBuilder.success(res, task, 'Task retrieved successfully');
    } catch (error) {
      console.error('Error getting task:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve task', 500);
    }
  }

  async getTasksByProject(req: AuthenticatedRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const tasks = await TasksService.getTasksByProject(projectId);
      ApiResponseBuilder.success(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks by project:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks', 500);
    }
  }

  async getTasksByUser(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const tasks = await TasksService.getTasksByUser(userId);
      ApiResponseBuilder.success(res, tasks, 'Tasks retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks by user:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks', 500);
    }
  }
  async getMyTasks(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      const tasks = await TasksService.getTasksByUser(req.user.id);
      ApiResponseBuilder.success(res, tasks, 'My tasks retrieved successfully');
    } catch (error) {
      console.error('Error getting my tasks:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve my tasks', 500);
    }
  }
  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      
      const taskData = req.body;
      // Set created_by to current user if not provided
      if (!taskData.created_by) {
        taskData.created_by = req.user.id;
      }
      
      const task = await TasksService.createTask(taskData);
      ApiResponseBuilder.success(res, task, 'Task created successfully', 201);
    } catch (error) {
      console.error('Error creating task:', error);
      ApiResponseBuilder.error(res, 'Failed to create task', 500);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const task = await TasksService.updateTask(id, updateData);
      
      if (!task) {
        return ApiResponseBuilder.error(res, 'Task not found', 404);
      }
      
      ApiResponseBuilder.success(res, task, 'Task updated successfully');
    } catch (error) {
      console.error('Error updating task:', error);
      ApiResponseBuilder.error(res, 'Failed to update task', 500);
    }
  }

  async updateTaskStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const task = await TasksService.updateTaskStatus(id, status);
      
      if (!task) {
        return ApiResponseBuilder.error(res, 'Task not found', 404);
      }
      
      ApiResponseBuilder.success(res, task, 'Task status updated successfully');
    } catch (error) {
      console.error('Error updating task status:', error);
      ApiResponseBuilder.error(res, 'Failed to update task status', 500);
    }
  }

  async updateTaskOrder(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { order } = req.body;
      
      const task = await TasksService.updateTaskOrder(id, order);
      
      if (!task) {
        return ApiResponseBuilder.error(res, 'Task not found', 404);
      }
      
      ApiResponseBuilder.success(res, task, 'Task order updated successfully');
    } catch (error) {
      console.error('Error updating task order:', error);
      ApiResponseBuilder.error(res, 'Failed to update task order', 500);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TasksService.deleteTask(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Task not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      ApiResponseBuilder.error(res, 'Failed to delete task', 500);
    }
  }

  // Comments
  async getCommentsByTask(req: AuthenticatedRequest, res: Response) {
    try {
      const { taskId } = req.params;
      const comments = await TasksService.getCommentsByTask(taskId);
      ApiResponseBuilder.success(res, comments, 'Comments retrieved successfully');
    } catch (error) {
      console.error('Error getting comments:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve comments', 500);
    }
  }
  async createComment(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      
      const commentData = req.body;
      // Set user_id to current user
      commentData.user_id = req.user.id;
      
      const comment = await TasksService.createComment(commentData);
      ApiResponseBuilder.success(res, comment, 'Comment created successfully', 201);
    } catch (error) {
      console.error('Error creating comment:', error);
      ApiResponseBuilder.error(res, 'Failed to create comment', 500);
    }
  }

  async updateComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const { content } = req.body;
      
      const comment = await TasksService.updateComment(id, content);
      
      if (!comment) {
        return ApiResponseBuilder.error(res, 'Comment not found', 404);
      }
      
      ApiResponseBuilder.success(res, comment, 'Comment updated successfully');
    } catch (error) {
      console.error('Error updating comment:', error);
      ApiResponseBuilder.error(res, 'Failed to update comment', 500);
    }
  }

  async deleteComment(req: AuthenticatedRequest, res: Response) {
    try {
      const { id } = req.params;
      const deleted = await TasksService.deleteComment(id);
      
      if (!deleted) {
        return ApiResponseBuilder.error(res, 'Comment not found', 404);
      }
      
      ApiResponseBuilder.success(res, null, 'Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      ApiResponseBuilder.error(res, 'Failed to delete comment', 500);
    }
  }

  // Analytics
  async getTasksStats(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await TasksService.getTasksStats();
      ApiResponseBuilder.success(res, stats, 'Tasks stats retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks stats:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks stats', 500);
    }
  }

  async getTasksByStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await TasksService.getTasksByStatus();
      ApiResponseBuilder.success(res, stats, 'Tasks by status retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks by status:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks by status', 500);
    }
  }

  async getTasksByPriority(req: AuthenticatedRequest, res: Response) {
    try {
      const stats = await TasksService.getTasksByPriority();
      ApiResponseBuilder.success(res, stats, 'Tasks by priority retrieved successfully');
    } catch (error) {
      console.error('Error getting tasks by priority:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve tasks by priority', 500);
    }
  }

  async getUserWorkload(req: AuthenticatedRequest, res: Response) {
    try {
      const { userId } = req.params;
      const workload = await TasksService.getUserWorkload(userId);
      ApiResponseBuilder.success(res, workload, 'User workload retrieved successfully');
    } catch (error) {
      console.error('Error getting user workload:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve user workload', 500);
    }
  }
  async getMyWorkload(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return ApiResponseBuilder.error(res, 'User not authenticated', 401);
      }
      
      const workload = await TasksService.getUserWorkload(req.user.id);
      ApiResponseBuilder.success(res, workload, 'My workload retrieved successfully');
    } catch (error) {
      console.error('Error getting my workload:', error);
      ApiResponseBuilder.error(res, 'Failed to retrieve my workload', 500);
    }
  }
}

export default new TasksController();

// filepath: backend/src/services/TasksService.ts
import { db } from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from './EmailService';
import { UserService } from './UserService';
import {
  Project,
  Task,
  Comment,
  CreateProjectRequest,
  CreateTaskRequest,
  CreateCommentRequest,
  UpdateProjectRequest,
  UpdateTaskRequest,
  ProjectStatus,
  TaskStatus,
  TaskPriority
} from '@/types/tasks';

export class TasksService {
  // Projects
  async getAllProjects(): Promise<Project[]> {
    return await db('projects')
      .leftJoin('users as owners', 'projects.owner_id', 'owners.id')
      .select(
        'projects.*',
        'owners.name as owner_name'
      )
      .orderBy('projects.created_at', 'desc');
  }

  async getProjectById(id: string): Promise<Project | null> {
    const project = await db('projects')
      .leftJoin('users as owners', 'projects.owner_id', 'owners.id')
      .select(
        'projects.*',
        'owners.name as owner_name'
      )
      .where('projects.id', id)
      .first();
    
    return project || null;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {    const project: Omit<Project, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      name: data.name,
      description: data.description,
      status: data.status || ProjectStatus.PLANNING,
      priority: data.priority || TaskPriority.MEDIUM,
      start_date: data.start_date,
      due_date: data.due_date,
      budget: data.budget,
      currency: data.currency || 'USD',
      owner_id: data.owner_id,
      team_members: data.team_members || [],
      tags: data.tags || [],
      color: data.color || '#3B82F6',
      is_archived: false,
      progress: 0
    };

    await db('projects').insert(project);
    return await this.getProjectById(project.id) as Project;
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project | null> {
    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('projects')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    return await this.getProjectById(id);
  }

  async updateProjectStatus(id: string, status: ProjectStatus): Promise<Project | null> {
    return await this.updateProject(id, { status });
  }

  async deleteProject(id: string): Promise<boolean> {
    // Delete all tasks first
    await db('tasks').where('project_id', id).del();
    
    const deleted = await db('projects')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  async calculateProjectProgress(projectId: string): Promise<number> {
    const tasks = await db('tasks')
      .where('project_id', projectId)
      .select('status');

    if (tasks.length === 0) {
      return 0;
    }

    const completedTasks = tasks.filter((task: any) => task.status === 'completed').length;
    const progress = Math.round((completedTasks / tasks.length) * 100);

    // Update project progress
    await db('projects')
      .where('id', projectId)
      .update({ progress });

    return progress;
  }

  // Tasks
  async getAllTasks(): Promise<Task[]> {
    return await db('tasks')
      .leftJoin('projects', 'tasks.project_id', 'projects.id')
      .leftJoin('users as assignees', 'tasks.assigned_to', 'assignees.id')
      .leftJoin('users as creators', 'tasks.created_by', 'creators.id')
      .select(
        'tasks.*',
        'projects.name as project_name',
        'assignees.name as assignee_name',
        'creators.name as creator_name'
      )
      .orderBy('tasks.created_at', 'desc');
  }

  async getTaskById(id: string): Promise<Task | null> {
    const task = await db('tasks')
      .leftJoin('projects', 'tasks.project_id', 'projects.id')
      .leftJoin('users as assignees', 'tasks.assigned_to', 'assignees.id')
      .leftJoin('users as creators', 'tasks.created_by', 'creators.id')
      .select(
        'tasks.*',
        'projects.name as project_name',
        'assignees.name as assignee_name',
        'creators.name as creator_name'
      )
      .where('tasks.id', id)
      .first();
    
    return task || null;
  }

  async getTasksByProject(projectId: string): Promise<Task[]> {
    return await db('tasks')
      .leftJoin('users as assignees', 'tasks.assigned_to', 'assignees.id')
      .leftJoin('users as creators', 'tasks.created_by', 'creators.id')
      .select(
        'tasks.*',
        'assignees.name as assignee_name',
        'creators.name as creator_name'
      )
      .where('tasks.project_id', projectId)
      .orderBy('tasks.order', 'asc');
  }

  async getTasksByUser(userId: string): Promise<Task[]> {
    return await db('tasks')
      .leftJoin('projects', 'tasks.project_id', 'projects.id')
      .leftJoin('users as creators', 'tasks.created_by', 'creators.id')
      .select(
        'tasks.*',
        'projects.name as project_name',
        'creators.name as creator_name'
      )
      .where('tasks.assigned_to', userId)
      .orderBy('tasks.due_date', 'asc');
  }
  async createTask(data: CreateTaskRequest): Promise<Task> {
    // Get the next order for this project
    const lastTask = await db('tasks')
      .where('project_id', data.project_id)
      .orderBy('order', 'desc')
      .first();    const task: Omit<Task, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      title: data.title,
      description: data.description,      status: data.status || TaskStatus.TODO,
      priority: data.priority || TaskPriority.MEDIUM,
      project_id: data.project_id,
      assigned_to: data.assigned_to,
      created_by: data.created_by,
      start_date: data.start_date,
      due_date: data.due_date,
      estimated_hours: data.estimated_hours,
      actual_hours: 0,
      progress: 0,
      tags: data.tags || [],
      dependencies: data.dependencies || [],
      attachments: [],
      checklist: data.checklist || [],
      is_recurring: data.is_recurring || false,
      recurrence_pattern: data.recurrence_pattern,
      parent_task_id: data.parent_task_id,
      order: lastTask ? lastTask.order + 1 : 1
    };

    await db('tasks').insert(task);
    
    // Update project progress
    if (data.project_id) {
      await this.calculateProjectProgress(data.project_id);
    }

    const createdTask = await this.getTaskById(task.id) as Task;    // Send email notification if task is assigned to someone
    if (data.assigned_to && data.assigned_to !== data.created_by) {
      try {
        // Get assignee details
        const assignee = await UserService.findById(data.assigned_to);
        
        // Get project details
        const project = await this.getProjectById(data.project_id!);
        
        if (assignee && project) {
          // Format due date
          const dueDate = data.due_date 
            ? new Date(data.due_date).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit', 
                year: 'numeric'
              })
            : 'Sin fecha límite';

          // Generate task URL
          const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
          const taskUrl = `${frontendUrl}/tasks/${task.id}`;          // Send task assignment email
          await EmailService.sendTaskAssignmentEmail(assignee.email, {
            name: `${assignee.first_name} ${assignee.last_name}`,
            taskTitle: data.title,
            projectName: project.name,
            priority: data.priority || 'medium',
            dueDate,
            taskUrl
          });
        }
      } catch (emailError) {
        // Log email error but don't fail task creation
        console.error('Error sending task assignment email:', emailError);
      }
    }

    return createdTask;
  }

  async updateTask(id: string, data: UpdateTaskRequest): Promise<Task | null> {
    const currentTask = await this.getTaskById(id);
    if (!currentTask) {
      return null;
    }

    const updateData = {
      ...data,
      updated_at: new Date()
    };

    const updated = await db('tasks')
      .where('id', id)
      .update(updateData);

    if (updated === 0) {
      return null;
    }

    // Update project progress if status changed
    if (data.status && data.status !== currentTask.status && currentTask.project_id) {
      await this.calculateProjectProgress(currentTask.project_id);
    }

    return await this.getTaskById(id);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task | null> {
    return await this.updateTask(id, { 
      status,
      ...(status === 'completed' && { actual_hours: await this.calculateActualHours(id) })
    });
  }

  async updateTaskOrder(id: string, newOrder: number): Promise<Task | null> {
    return await this.updateTask(id, { order: newOrder });
  }

  async deleteTask(id: string): Promise<boolean> {
    const task = await this.getTaskById(id);
    if (!task) {
      return false;
    }

    // Delete comments first
    await db('comments').where('task_id', id).del();
    
    const deleted = await db('tasks')
      .where('id', id)
      .del();

    // Update project progress
    if (task.project_id) {
      await this.calculateProjectProgress(task.project_id);
    }

    return deleted > 0;
  }

  async calculateActualHours(taskId: string): Promise<number> {
    // This would integrate with time tracking functionality
    // For now, return the estimated hours as actual hours
    const task = await db('tasks')
      .where('id', taskId)
      .select('estimated_hours')
      .first();

    return task?.estimated_hours || 0;
  }

  // Comments
  async getCommentsByTask(taskId: string): Promise<Comment[]> {
    return await db('comments')
      .leftJoin('users', 'comments.user_id', 'users.id')
      .select(
        'comments.*',
        'users.name as user_name',
        'users.avatar as user_avatar'
      )
      .where('comments.task_id', taskId)
      .orderBy('comments.created_at', 'asc');
  }

  async createComment(data: CreateCommentRequest): Promise<Comment> {    const comment: Omit<Comment, 'created_at' | 'updated_at'> = {
      id: uuidv4(),
      content: data.content,
      task_id: data.task_id,
      user_id: data.user_id,
      mentions: data.mentions || [],
      attachments: data.attachments || [],
      parent_id: data.parent_id
    };

    await db('comments').insert(comment);
    
    const result = await db('comments')
      .leftJoin('users', 'comments.user_id', 'users.id')
      .select(
        'comments.*',
        'users.name as user_name',
        'users.avatar as user_avatar'
      )
      .where('comments.id', comment.id)
      .first();

    return result as Comment;
  }

  async updateComment(id: string, content: string): Promise<Comment | null> {
    const updated = await db('comments')
      .where('id', id)
      .update({
        content,
        updated_at: new Date()
      });

    if (updated === 0) {
      return null;
    }

    const result = await db('comments')
      .leftJoin('users', 'comments.user_id', 'users.id')
      .select(
        'comments.*',
        'users.name as user_name',
        'users.avatar as user_avatar'
      )
      .where('comments.id', id)
      .first();

    return result as Comment;
  }

  async deleteComment(id: string): Promise<boolean> {
    const deleted = await db('comments')
      .where('id', id)
      .del();

    return deleted > 0;
  }

  // Analytics and Reports
  async getTasksStats() {
    const [
      totalProjects,
      totalTasks,
      completedTasks,
      overdueTasks,
      tasksThisWeek,
      averageCompletionTime
    ] = await Promise.all([
      db('projects').count('* as count').first(),
      db('tasks').count('* as count').first(),
      db('tasks').where('status', 'completed').count('* as count').first(),
      db('tasks')
        .where('due_date', '<', new Date())
        .whereNot('status', 'completed')
        .count('* as count').first(),
      db('tasks')
        .where('created_at', '>=', db.raw('CURRENT_DATE - INTERVAL \'7 days\''))
        .count('* as count').first(),
      db('tasks')
        .where('status', 'completed')
        .whereNotNull('actual_hours')
        .avg('actual_hours as average').first()
    ]);

    return {
      projects: {
        total: parseInt(totalProjects?.count as string) || 0
      },
      tasks: {
        total: parseInt(totalTasks?.count as string) || 0,
        completed: parseInt(completedTasks?.count as string) || 0,
        overdue: parseInt(overdueTasks?.count as string) || 0,
        thisWeek: parseInt(tasksThisWeek?.count as string) || 0
      },
      performance: {
        averageCompletionTime: parseFloat(averageCompletionTime?.average as string) || 0
      }
    };
  }

  async getTasksByStatus(): Promise<Record<TaskStatus, number>> {
    const results = await db('tasks')
      .select('status')
      .count('* as count')
      .groupBy('status');    const statusCounts: Record<TaskStatus, number> = {
      backlog: 0,
      todo: 0,
      in_progress: 0,
      in_review: 0,
      review: 0,
      done: 0,
      completed: 0,
      cancelled: 0
    };    results.forEach((row: any) => {
      statusCounts[row.status as TaskStatus] = parseInt(row.count as string);
    });

    return statusCounts;
  }

  async getTasksByPriority(): Promise<Record<TaskPriority, number>> {
    const results = await db('tasks')
      .select('priority')
      .count('* as count')
      .groupBy('priority');

    const priorityCounts: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    };    results.forEach((row: any) => {
      priorityCounts[row.priority as TaskPriority] = parseInt(row.count as string);
    });

    return priorityCounts;
  }

  async getProjectProgress(): Promise<Array<{ project: Project; progress: number }>> {
    const projects = await this.getAllProjects();
    
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        const progress = await this.calculateProjectProgress(project.id);
        return { project, progress };
      })
    );

    return projectsWithProgress;
  }

  async getUserWorkload(userId: string): Promise<{
    assigned: number;
    completed: number;
    overdue: number;
    thisWeek: number;
  }> {
    const [assigned, completed, overdue, thisWeek] = await Promise.all([
      db('tasks').where('assigned_to', userId).count('* as count').first(),
      db('tasks')
        .where('assigned_to', userId)
        .where('status', 'completed')
        .count('* as count').first(),
      db('tasks')
        .where('assigned_to', userId)
        .where('due_date', '<', new Date())
        .whereNot('status', 'completed')
        .count('* as count').first(),
      db('tasks')
        .where('assigned_to', userId)
        .where('due_date', '>=', new Date())
        .where('due_date', '<', db.raw('CURRENT_DATE + INTERVAL \'7 days\''))
        .count('* as count').first()
    ]);

    return {
      assigned: parseInt(assigned?.count as string) || 0,
      completed: parseInt(completed?.count as string) || 0,
      overdue: parseInt(overdue?.count as string) || 0,
      thisWeek: parseInt(thisWeek?.count as string) || 0
    };
  }
}

export default new TasksService();

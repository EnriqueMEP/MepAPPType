import { BaseEntity, User } from './common';

// Proyecto
export interface Project extends BaseEntity {
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: TaskPriority;
  start_date?: Date;
  due_date?: Date;
  completed_date?: Date;
  owner_id: string;
  team_members: string[]; // User IDs
  customer_id?: string;
  budget?: number;
  currency?: string;
  progress: number; // 0-100
  tags?: string[];
  color?: string;
  is_archived: boolean;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  IN_PROGRESS = 'in_progress',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// Tarea
export interface Task extends BaseEntity {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  project_id?: string;
  assigned_to?: string;
  created_by: string;
  start_date?: Date;
  due_date?: Date;
  completed_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  progress: number; // 0-100
  tags?: string[];
  dependencies?: string[]; // Task IDs
  attachments?: string[];
  checklist?: TaskChecklistItem[];
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern;
  parent_task_id?: string;
  order?: number; // Campo para ordenamiento en Kanban
}

export enum TaskStatus {
  BACKLOG = 'backlog',
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  DONE = 'done',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed', // Agregar este estado
  REVIEW = 'review', // Agregar este estado
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RecurrencePattern {
  type: RecurrenceType;
  interval: number;
  days_of_week?: number[]; // 0-6 (Sunday-Saturday)
  day_of_month?: number;
  end_date?: Date;
}

export enum RecurrenceType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

// Comentario
export interface TaskComment extends BaseEntity {
  task_id: string;
  user_id: string;
  content: string;
  mentions?: string[]; // User IDs
  attachments?: string[];
  parent_id?: string; // For replies
}

// Alias para compatibilidad
export type Comment = TaskComment;

// Request Types
export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: TaskPriority;
  start_date?: Date;
  due_date?: Date;
  owner_id: string;
  team_members?: string[];
  customer_id?: string;
  budget?: number;
  currency?: string;
  tags?: string[];
  color?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: TaskPriority;
  start_date?: Date;
  due_date?: Date;
  owner_id?: string;
  team_members?: string[];
  customer_id?: string;
  budget?: number;
  currency?: string;
  progress?: number;
  tags?: string[];
  color?: string;
  is_archived?: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  assigned_to?: string;
  created_by: string;
  start_date?: Date;
  due_date?: Date;
  estimated_hours?: number;
  tags?: string[];
  dependencies?: string[];
  checklist?: TaskChecklistItem[];
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  parent_task_id?: string;
  order?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  project_id?: string;
  assigned_to?: string;
  start_date?: Date;
  due_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;
  progress?: number;
  tags?: string[];
  dependencies?: string[];
  checklist?: TaskChecklistItem[];
  is_recurring?: boolean;
  recurrence_pattern?: RecurrencePattern;
  parent_task_id?: string;
  order?: number;
}

export interface CreateCommentRequest {
  task_id: string;
  user_id: string;
  content: string;
  mentions?: string[];
  attachments?: string[];
  parent_id?: string;
}

// Time Tracking
export interface TimeEntry extends BaseEntity {
  task_id: string;
  user_id: string;
  start_time: Date;
  end_time?: Date;
  duration: number; // en minutos
  description?: string;
  is_billable: boolean;
  hourly_rate?: number;
  total_amount?: number;
  status: TimeEntryStatus;
}

export enum TimeEntryStatus {
  RUNNING = 'running',
  STOPPED = 'stopped',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

// Tablero Kanban
export interface Board extends BaseEntity {
  name: string;
  description?: string;
  project_id?: string;
  owner_id: string;
  team_members: string[]; // User IDs
  columns: BoardColumn[];
  settings: BoardSettings;
  is_template: boolean;
  is_archived: boolean;
}

export interface BoardColumn {
  id: string;
  name: string;
  status: TaskStatus;
  position: number;
  color?: string;
  wip_limit?: number; // Work In Progress limit
}

export interface BoardSettings {
  allow_add_tasks: boolean;
  allow_edit_tasks: boolean;
  allow_delete_tasks: boolean;
  auto_assign_owner: boolean;
  require_due_date: boolean;
  default_priority: TaskPriority;
}

// Milestone/Hito
export interface Milestone extends BaseEntity {
  name: string;
  description?: string;
  project_id: string;
  due_date: Date;
  status: MilestoneStatus;
  progress: number; // 0-100
  tasks?: string[]; // Task IDs
}

export enum MilestoneStatus {
  UPCOMING = 'upcoming',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
}

// Documento/Archivo
export interface Document extends BaseEntity {
  name: string;
  description?: string;
  file_path: string;
  file_size: number;
  file_type: string;
  project_id?: string;
  task_id?: string;
  uploaded_by: string;
  is_public: boolean;
  download_count: number;
  tags?: string[];
}

// Sprint (para metodología Agile)
export interface Sprint extends BaseEntity {
  name: string;
  description?: string;
  project_id: string;
  start_date: Date;
  end_date: Date;
  status: SprintStatus;
  goal?: string;
  tasks: string[]; // Task IDs
  velocity?: number;
  committed_points?: number;
  completed_points?: number;
}

export enum SprintStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

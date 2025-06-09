// Tipos para gestión de tareas y proyectos - inspirados en Plane
export interface Project {
  id: string
  name: string
  description?: string
  key: string // Clave única del proyecto (ej: MEP, PROJ)
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  startDate?: string
  endDate?: string
  budget?: number
  owner: string
  members: ProjectMember[]
  progress: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  userId: string
  role: 'owner' | 'admin' | 'member' | 'viewer'
  joinedAt: string
}

export interface Task {
  id: string
  title: string
  description?: string
  projectId: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: string
  reporter: string
  labels: string[]
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  attachments: Attachment[]
  comments: Comment[]
  subtasks: Subtask[]
  dependencies: string[] // IDs de tareas dependientes
  createdAt: string
  updatedAt: string
}

export type TaskStatus = 
  | 'backlog' 
  | 'todo' 
  | 'in-progress' 
  | 'in-review' 
  | 'done' 
  | 'cancelled'

export interface Subtask {
  id: string
  title: string
  completed: boolean
  assignee?: string
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  updatedAt?: string
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
}

export interface Sprint {
  id: string
  name: string
  projectId: string
  startDate: string
  endDate: string
  goal?: string
  status: 'planning' | 'active' | 'completed'
  tasks: string[] // IDs de tareas
  createdAt: string
}

export interface Board {
  id: string
  name: string
  projectId: string
  columns: BoardColumn[]
  tasks: Task[]
}

export interface BoardColumn {
  id: string
  name: string
  status: TaskStatus
  order: number
  color?: string
}

import { Request } from 'express';

// Tipos base
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Usuario
export interface User extends BaseEntity {
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  avatar?: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  last_login?: Date;
  email_verified: boolean;
  email_verified_at?: Date;
  email_verification_token?: string;
  reset_password_token?: string;
  reset_password_expires?: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
  CLIENT = 'client',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

// Request con usuario autenticado
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Respuesta API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Paginación
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

// JWT Payload
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

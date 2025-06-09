// Tipos de autenticación y usuarios - basados en Appwrite
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  permissions: string[]
  company?: string
  department?: string
  position?: string
  phone?: string
  createdAt: string
  updatedAt: string
  isActive: boolean
}

export interface UserRole {
  id: string
  name: string
  permissions: Permission[]
}

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  company?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordReset {
  token: string
  password: string
  confirmPassword: string
}

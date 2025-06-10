import axios from 'axios'
import type { LoginCredentials, AuthResponse, User } from '../types/auth'

// Configuración de Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  timeout: 10000,
})

// Interceptor para agregar token a las peticiones
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mep_auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mep_auth_token')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Servicio de autenticación - adaptado de patrones de Appwrite
 */
export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post('/auth/login', credentials)
    const { token } = response.data
    
    if (token) {
      localStorage.setItem('mep_auth_token', token)
    }
    
    return response.data
  },

  async register(userData: any): Promise<AuthResponse> {
    const response = await api.post('/auth/register', userData)
    const { token } = response.data
    
    if (token) {
      localStorage.setItem('mep_auth_token', token)
    }
    
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('mep_auth_token')
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data
  },

  async refreshToken(): Promise<string> {
    const response = await api.post('/auth/refresh')
    const { token } = response.data
    
    if (token) {
      localStorage.setItem('mep_auth_token', token)
    }
    
    return token
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password })
  },

  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await api.patch('/auth/profile', userData)
    return response.data
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { oldPassword, newPassword })
  }
}

export { api }

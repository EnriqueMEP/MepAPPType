import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import type { User, LoginCredentials } from '../types/auth'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  token: string | null
  
  // Acciones
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  initializeAuth: () => void
  updateProfile: (userData: Partial<User>) => void
}

/**
 * Store de autenticación - adaptado de patrones de Appwrite
 * Conserva la lógica de tu sistema de usuarios original
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      token: null,

      login: async (credentials) => {
        try {
          set({ isLoading: true })
          const response = await authService.login(credentials)
          
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: () => {
        authService.logout()
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false
        })
      },

      initializeAuth: () => {
        const token = localStorage.getItem('mep_auth_token')
        if (token) {
          // Verificar token y obtener usuario
          authService.getCurrentUser()
            .then((user) => {
              set({
                user,
                token,
                isAuthenticated: true,
                isLoading: false
              })
            })
            .catch(() => {
              set({ isLoading: false })
            })
        } else {
          set({ isLoading: false })
        }
      },

      updateProfile: (userData) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData }
          })
        }
      }
    }),
    {
      name: 'mep-auth-storage',
      partialize: (state) => ({ 
        token: state.token,
        user: state.user 
      }),
    }
  )
)

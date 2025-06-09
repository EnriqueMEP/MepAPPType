import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  actualTheme: 'light' | 'dark'
  
  // Acciones
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  initializeTheme: () => void
}

/**
 * Store de tema - conservando tu implementación de modo oscuro
 * Mejorado con detección automática del sistema
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      actualTheme: 'light',

      setTheme: (theme) => {
        const actualTheme = getActualTheme(theme)
        set({ theme, actualTheme })
        applyTheme(actualTheme)
      },

      toggleTheme: () => {
        const current = get().actualTheme
        const newTheme = current === 'light' ? 'dark' : 'light'
        set({ theme: newTheme, actualTheme: newTheme })
        applyTheme(newTheme)
      },

      initializeTheme: () => {
        const savedTheme = get().theme
        const actualTheme = getActualTheme(savedTheme)
        set({ actualTheme })
        applyTheme(actualTheme)
        
        // Escuchar cambios en el tema del sistema
        if (savedTheme === 'system') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
          mediaQuery.addEventListener('change', (e) => {
            const newActualTheme = e.matches ? 'dark' : 'light'
            set({ actualTheme: newActualTheme })
            applyTheme(newActualTheme)
          })
        }
      }
    }),
    {
      name: 'mep-theme-storage',
      partialize: (state) => ({ theme: state.theme }),
    }
  )
)

// Funciones auxiliares
function getActualTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return theme
}

function applyTheme(theme: 'light' | 'dark') {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

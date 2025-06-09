import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'
import Layout from './components/layout/Layout'
import Login from './components/auth/Login'
import Dashboard from './modules/dashboard/Dashboard'
import CRMModule from './modules/crm/CRMModule'
import ERPModule from './modules/erp/ERPModule'
import RRHHModule from './modules/rrhh/RRHHModule'
import ChatModule from './modules/chat/ChatModule'
import TasksModule from './modules/tasks/TasksModule'
import UsersModule from './modules/users/UsersModule'
import { LoadingSpinner } from './components/ui/LoadingSpinner'

/**
 * Aplicación principal MEP-Projects
 * Conserva la arquitectura modular de tu aplicación original
 * pero modernizada con React + TypeScript
 */
function App() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore()
  const { theme, initializeTheme } = useThemeStore()

  // Inicialización de la aplicación - similar a tu MEPApplication original
  useEffect(() => {
    initializeAuth()
    initializeTheme()
  }, [initializeAuth, initializeTheme])

  // Aplicar tema al documento
  useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        {/* Dashboard principal */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Módulos empresariales - conservando tu estructura modular */}
        <Route path="/crm/*" element={<CRMModule />} />
        <Route path="/erp/*" element={<ERPModule />} />
        <Route path="/rrhh/*" element={<RRHHModule />} />
        <Route path="/chat/*" element={<ChatModule />} />
        <Route path="/tasks/*" element={<TasksModule />} />
        <Route path="/users/*" element={<UsersModule />} />
        
        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App

import React, { useState } from 'react'
import ModernSidebar from './ModernSidebar'
import ModernDashboard from './ModernDashboard'
import DesignSystemShowcase from './DesignSystemShowcase'

/**
 * 🎨 MEP-Projects App Demo
 * Página principal que muestra el nuevo sistema de diseño
 */
const MEPAppDemo: React.FC = () => {
  const [activeView, setActiveView] = useState('inicio')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const renderContent = () => {
    switch (activeView) {
      case 'inicio':
        return <ModernDashboard />
      case 'design-system':
        return <DesignSystemShowcase />
      default:
        return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Esta sección está en desarrollo
              </p>
              <button 
                onClick={() => setActiveView('inicio')}
                className="btn btn-primary mt-4"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
        <ModernSidebar 
          activeItem={activeView}
          onItemClick={setActiveView}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-900 shadow-soft border-b border-gray-200 dark:border-gray-800 h-16 flex items-center justify-between px-6">
          
          <div className="flex items-center">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="ml-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 capitalize">
                {activeView === 'inicio' ? 'Dashboard' : activeView.replace('-', ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar... (124)"
                className="w-64 pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 text-sm"
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">E</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Enrique</span>
            </div>

            {/* Design System Toggle */}
            <button
              onClick={() => setActiveView(activeView === 'design-system' ? 'inicio' : 'design-system')}
              className="btn btn-outline text-xs"
            >
              🎨 {activeView === 'design-system' ? 'Dashboard' : 'Design System'}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default MEPAppDemo

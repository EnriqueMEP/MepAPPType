import React from 'react'

/**
 * 🎨 MEP-Projects Design System Showcase
 * Este componente muestra todos los estilos del nuevo sistema de diseño
 */
const DesignSystemShowcase: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            🎨 MEP-Projects Design System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Sistema de diseño completo con colores, animaciones y componentes modernos
          </p>
        </div>

        {/* Paleta de Colores */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              🎭 Paleta de Colores
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Primary Colors */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Colores Principales</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-500 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Primary 500</p>
                      <p className="text-sm text-gray-500">#00d4aa</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-sidebar-800 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Sidebar 800</p>
                      <p className="text-sm text-gray-500">#065f46</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Colors */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Colores de Estado</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-success-500 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Success</p>
                      <p className="text-sm text-gray-500">#10b981</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-warning-500 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Warning</p>
                      <p className="text-sm text-gray-500">#f59e0b</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-danger-500 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Danger</p>
                      <p className="text-sm text-gray-500">#ef4444</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gray Scale */}
              <div>
                <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Escala de Grises</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-soft border"></div>
                    <div>
                      <p className="font-medium">Gray 100/800</p>
                      <p className="text-sm text-gray-500">Backgrounds</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-900 dark:bg-gray-100 rounded-xl shadow-soft"></div>
                    <div>
                      <p className="font-medium">Gray 900/100</p>
                      <p className="text-sm text-gray-500">Text</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Botones */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              🔘 Botones
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="btn btn-primary">
                Primary
              </button>
              <button className="btn btn-secondary">
                Secondary
              </button>
              <button className="btn btn-success">
                Success
              </button>
              <button className="btn btn-warning">
                Warning
              </button>
              <button className="btn btn-danger">
                Danger
              </button>
              <button className="btn btn-outline">
                Outline
              </button>
              <button className="btn btn-ghost">
                Ghost
              </button>
              <button className="btn btn-primary" disabled>
                Disabled
              </button>
            </div>
          </div>
        </section>

        {/* Métricas Dashboard */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              📊 Métricas Dashboard
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              <div className="metric-card animate-fade-in">
                <div className="metric-value text-primary-600">189</div>
                <div className="metric-label">Total Tareas</div>
                <div className="metric-change metric-up">
                  <span>↗ +12%</span>
                </div>
              </div>

              <div className="metric-card animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="metric-value text-success-600">€847,250</div>
                <div className="metric-label">Revenue Total</div>
                <div className="metric-change metric-up">
                  <span>↗ +23.5%</span>
                </div>
              </div>

              <div className="metric-card animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="metric-value text-warning-600">34</div>
                <div className="metric-label">En Progreso</div>
                <div className="metric-change">
                  <span>18% del total</span>
                </div>
              </div>

              <div className="metric-card animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="metric-value text-danger-600">7</div>
                <div className="metric-label">Urgentes</div>
                <div className="metric-change metric-down">
                  <span>↘ -2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cards con Efectos */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              🃏 Cards con Efectos
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="card card-hover">
                <div className="card-header">
                  <h3 className="font-semibold">Card Normal</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 dark:text-gray-400">
                    Esta card tiene efectos hover básicos con transformación.
                  </p>
                </div>
              </div>

              <div className="card card-glow">
                <div className="card-header">
                  <h3 className="font-semibold">Card con Glow</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 dark:text-gray-400">
                    Esta card tiene efecto de resplandor al hacer hover.
                  </p>
                </div>
              </div>

              <div className="card glass">
                <div className="card-header">
                  <h3 className="font-semibold">Card Glass</h3>
                </div>
                <div className="card-body">
                  <p className="text-gray-600 dark:text-gray-400">
                    Esta card tiene efecto de vidrio con blur de fondo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              🏷️ Badges
            </h2>
          </div>
          <div className="card-body">
            <div className="flex flex-wrap gap-3">
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-success">Success</span>
              <span className="badge badge-warning">Warning</span>
              <span className="badge badge-danger">Danger</span>
            </div>
          </div>
        </section>

        {/* Inputs */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              📝 Inputs
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Input Normal</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Escribe algo aquí..."
                />
              </div>
              <div className="input-group">
                <label className="block text-sm font-medium mb-2">Input con Icono</label>
                <div className="relative">
                  <input 
                    type="email" 
                    className="input input-with-icon" 
                    placeholder="correo@ejemplo.com"
                  />
                  <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animaciones */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              ✨ Animaciones
            </h2>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center animate-fade-in">
                <div className="text-2xl mb-2">😊</div>
                <p className="text-sm">Fade In</p>
              </div>
              <div className="card p-4 text-center animate-slide-up">
                <div className="text-2xl mb-2">🚀</div>
                <p className="text-sm">Slide Up</p>
              </div>
              <div className="card p-4 text-center animate-scale-in">
                <div className="text-2xl mb-2">⭐</div>
                <p className="text-sm">Scale In</p>
              </div>
              <div className="card p-4 text-center animate-float">
                <div className="text-2xl mb-2">🎈</div>
                <p className="text-sm">Float</p>
              </div>
            </div>
          </div>
        </section>

        {/* Loading States */}
        <section className="card">
          <div className="card-header">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              ⏳ Loading States
            </h2>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-around">
              <div className="text-center">
                <div className="loading-spinner w-8 h-8 mx-auto mb-2"></div>
                <p className="text-sm">Spinner</p>
              </div>
              <div className="text-center">
                <div className="loading-dots mb-2">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
                <p className="text-sm">Dots</p>
              </div>
              <div className="text-center">
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-24 rounded mb-2"></div>
                <p className="text-sm">Skeleton</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">
            🎨 MEP-Projects Design System - Moderno, elegante y funcional
          </p>
        </div>
      </div>
    </div>
  )
}

export default DesignSystemShowcase

import React from 'react'
import { 
  ArrowUpIcon, 
  ArrowDownIcon,
  EyeIcon,
  DocumentIcon,
  ChartBarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

/**
 * 🎨 Modern Dashboard MEP-Projects
 * Dashboard con métricas y diseño moderno como en tu imagen
 */
const ModernDashboard: React.FC = () => {
  const metrics = [
    {
      id: 'revenue',
      title: 'REVENUE TOTAL',
      value: '€847,250',
      change: '+23.5%',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'success',
      gradient: 'gradient-success'
    },
    {
      id: 'projects',
      title: 'PROYECTOS ACTIVOS',
      value: '24',
      change: '+3 este mes',
      trend: 'up',
      icon: DocumentIcon,
      color: 'primary',
      gradient: 'gradient-primary'
    },
    {
      id: 'tasks',
      title: 'TAREAS COMPLETADAS',
      value: '142/189',
      change: '75.1%',
      trend: 'up',
      icon: ChartBarIcon,
      color: 'success',
      gradient: 'gradient-success'
    },
    {
      id: 'satisfaction',
      title: 'SATISFACCIÓN CLIENTE',
      value: '4.8/5.0',
      change: '+0.3',
      trend: 'up',
      icon: StarIcon,
      color: 'success',
      gradient: 'gradient-success'
    }
  ]

  const quickActions = [
    { id: 'new-project', label: 'Nuevo Proyecto', icon: '📁', color: 'primary' },
    { id: 'generate-report', label: 'Generar Reporte', icon: '📊', color: 'secondary' },
    { id: 'add-task', label: 'Nueva Tarea', icon: '✅', color: 'success' },
    { id: 'view-analytics', label: 'Analytics', icon: '📈', color: 'warning' },
  ]

  const recentProjects = [
    { name: 'Sistema CRM', progress: 85, status: 'En progreso', priority: 'Alta' },
    { name: 'App Móvil', progress: 60, status: 'En desarrollo', priority: 'Media' },
    { name: 'Dashboard Analytics', progress: 95, status: 'Casi completo', priority: 'Alta' },
    { name: 'API Gateway', progress: 40, status: 'Planificación', priority: 'Baja' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-soft border-b border-gray-200 dark:border-gray-800">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                Buenos días, Enrique
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Aquí está el resumen de tu actividad empresarial
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="btn btn-secondary">
                <DocumentIcon className="w-5 h-5 mr-2" />
                Generar Reporte
              </button>
              <button className="btn btn-primary">
                <DocumentIcon className="w-5 h-5 mr-2" />
                Nuevo Proyecto
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Métricas Principales */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <div 
                  key={metric.id}
                  className="metric-card hover-lift hover-glow animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Gradiente superior */}
                  <div className={`absolute top-0 left-0 w-full h-1 ${metric.gradient} rounded-t-2xl`}></div>
                  
                  {/* Icono flotante */}
                  <div className="absolute -top-3 right-6">
                    <div className={`w-12 h-12 ${metric.gradient} rounded-xl flex items-center justify-center shadow-medium animate-float`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="text-left pt-4">
                    <p className="metric-label mb-2">{metric.title}</p>
                    <p className="metric-value">{metric.value}</p>
                    <div className={`metric-change ${metric.trend === 'up' ? 'metric-up' : 'metric-down'}`}>
                      {metric.trend === 'up' ? (
                        <ArrowUpIcon className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownIcon className="w-4 h-4 mr-1" />
                      )}
                      <span>{metric.change}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Proyectos Activos */}
          <div className="lg:col-span-2">
            <div className="card animate-slide-up">
              <div className="card-header flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Proyectos Activos
                </h2>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center">
                  Ver todos
                  <ArrowUpIcon className="w-4 h-4 ml-1 rotate-45" />
                </button>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {recentProjects.map((project, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {project.name}
                          </h3>
                          <span className={`badge ${
                            project.priority === 'Alta' ? 'badge-danger' :
                            project.priority === 'Media' ? 'badge-warning' : 'badge-success'
                          }`}>
                            {project.priority}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600 dark:text-gray-400">{project.status}</span>
                              <span className="text-gray-600 dark:text-gray-400">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Acciones Rápidas */}
          <div>
            <div className="card animate-slide-left">
              <div className="card-header">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Acciones Rápidas
                </h2>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      className="w-full flex items-center p-4 text-left bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:transform hover:scale-105"
                    >
                      <div className="text-2xl mr-3">{action.icon}</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {action.label}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Widget de Estado */}
            <div className="card mt-6 animate-slide-left" style={{ animationDelay: '0.2s' }}>
              <div className="card-body text-center">
                <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
                  <EyeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Sistema Funcionando
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Todos los servicios están operativos
                </p>
                <div className="mt-4">
                  <span className="badge badge-success">99.9% Uptime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernDashboard

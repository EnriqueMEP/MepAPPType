import React from 'react'
import { useAuthStore } from '../../stores/authStore'
import {
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

/**
 * Dashboard principal - conserva tu concepto de vista general
 * pero con métricas modernas y widgets informativos
 */
const Dashboard: React.FC = () => {
  const { user } = useAuthStore()

  // Datos mock - en producción vendrían del backend
  const stats = [
    {
      name: 'Clientes Activos',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
    },
    {
      name: 'Proyectos',
      value: '89',
      change: '+3%',
      changeType: 'positive',
      icon: BriefcaseIcon,
    },
    {
      name: 'Facturación Mensual',
      value: '$45,678',
      change: '+8%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'Tareas Pendientes',
      value: '23',
      change: '-5%',
      changeType: 'negative',
      icon: ClockIcon,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'crm',
      message: 'Nuevo cliente registrado: Empresa XYZ',
      time: 'Hace 2 horas',
    },
    {
      id: 2,
      type: 'task',
      message: 'Tarea "Revisión de proyecto" completada',
      time: 'Hace 4 horas',
    },
    {
      id: 3,
      type: 'rrhh',
      message: 'Solicitud de vacaciones aprobada',
      time: 'Hace 6 horas',
    },
    {
      id: 4,
      type: 'erp',
      message: 'Factura #INV-2025-001 generada',
      time: 'Hace 1 día',
    },
  ]

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '5 facturas vencen esta semana',
      action: 'Ver facturas',
    },
    {
      id: 2,
      type: 'info',
      message: 'Reunión de equipo programada para mañana',
      action: 'Ver calendario',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              ¡Bienvenido, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Aquí tienes un resumen de tu actividad empresarial
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="card p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.name}
                </p>
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className={`ml-2 text-sm font-medium ${
                    stat.changeType === 'positive'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {stat.change}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Actividad Reciente
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'crm' ? 'bg-blue-500' :
                      activity.type === 'task' ? 'bg-green-500' :
                      activity.type === 'rrhh' ? 'bg-purple-500' :
                      'bg-orange-500'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-white">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Alertas y Recordatorios
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-blue-400'
                  }`}
                >
                  <div className="flex items-center">
                    <ExclamationTriangleIcon className={`h-5 w-5 ${
                      alert.type === 'warning'
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`} />
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white">
                        {alert.message}
                      </p>
                      <button className={`text-xs font-medium ${
                        alert.type === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400 hover:text-yellow-500'
                          : 'text-blue-600 dark:text-blue-400 hover:text-blue-500'
                      }`}>
                        {alert.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Acciones Rápidas
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="btn btn-outline flex flex-col items-center p-4">
              <UserGroupIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Nuevo Cliente</span>
            </button>
            <button className="btn btn-outline flex flex-col items-center p-4">
              <BriefcaseIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Crear Proyecto</span>
            </button>
            <button className="btn btn-outline flex flex-col items-center p-4">
              <CurrencyDollarIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Nueva Factura</span>
            </button>
            <button className="btn btn-outline flex flex-col items-center p-4">
              <ClockIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Crear Tarea</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

import React from 'react'
import { Link } from 'react-router-dom'
import { 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

/**
 * Dashboard del módulo CRM - inspirado en la estructura de Crater
 */
const CRMDashboard: React.FC = () => {
  // Mock data - en producción vendría del backend
  const crmStats = [
    {
      name: 'Total Clientes',
      value: '1,247',
      change: '+12%',
      changeType: 'positive',
      icon: UserGroupIcon,
      color: 'blue'
    },    {
      name: 'Leads Activos',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'green'
    },
    {
      name: 'Facturas Pendientes',
      value: '$45,678',
      change: '-8%',
      changeType: 'negative',
      icon: DocumentTextIcon,
      color: 'yellow'
    },
    {
      name: 'Ingresos del Mes',
      value: '$123,456',
      change: '+15%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'purple'
    }
  ]

  const recentLeads = [
    {
      id: 1,
      name: 'Empresa ABC',
      contact: 'Juan Pérez',
      email: 'juan@empresaabc.com',
      phone: '+34 600 123 456',
      value: 15000,
      status: 'qualified',
      source: 'Website'
    },
    {
      id: 2,
      name: 'Tech Solutions',
      contact: 'María García',
      email: 'maria@techsolutions.com',
      phone: '+34 600 654 321',
      value: 8500,
      status: 'contacted',
      source: 'Referral'
    },
    {
      id: 3,
      name: 'Innovate Corp',
      contact: 'Carlos López',
      email: 'carlos@innovate.com',
      phone: '+34 600 789 123',
      value: 25000,
      status: 'proposal',
      source: 'LinkedIn'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-gray-100 text-gray-800'
      case 'contacted': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-green-100 text-green-800'
      case 'proposal': return 'bg-yellow-100 text-yellow-800'
      case 'closed-won': return 'bg-emerald-100 text-emerald-800'
      case 'closed-lost': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Nuevo'
      case 'contacted': return 'Contactado'
      case 'qualified': return 'Calificado'
      case 'proposal': return 'Propuesta'
      case 'closed-won': return 'Cerrado - Ganado'
      case 'closed-lost': return 'Cerrado - Perdido'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            CRM Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gestiona tus clientes, leads y ventas
          </p>
        </div>
        <div className="flex space-x-3">
          <Link to="/crm/leads" className="btn btn-outline">
            Ver Leads
          </Link>
          <Link to="/crm/customers" className="btn btn-primary">
            Nuevo Cliente
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {crmStats.map((stat) => (
          <div key={stat.name} className="card p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                stat.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                stat.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                'bg-purple-100 dark:bg-purple-900/20'
              }`}>
                <stat.icon className={`h-6 w-6 ${
                  stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                  stat.color === 'green' ? 'text-green-600 dark:text-green-400' :
                  stat.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                  'text-purple-600 dark:text-purple-400'
                }`} />
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
        {/* Recent Leads */}
        <div className="card">
          <div className="card-header flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Leads Recientes
            </h3>
            <Link 
              to="/crm/leads" 
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Ver todos
            </Link>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                        {getStatusText(lead.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {lead.contact}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-3 w-3 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center">
                        <PhoneIcon className="h-3 w-3 mr-1" />
                        {lead.phone}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        €{lead.value.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Fuente: {lead.source}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sales Pipeline */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Pipeline de Ventas
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {[
                { stage: 'Nuevo', count: 12, value: 45000, color: 'gray' },
                { stage: 'Contactado', count: 8, value: 32000, color: 'blue' },
                { stage: 'Calificado', count: 5, value: 75000, color: 'green' },
                { stage: 'Propuesta', count: 3, value: 125000, color: 'yellow' },
              ].map((stage) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      stage.color === 'gray' ? 'bg-gray-400' :
                      stage.color === 'blue' ? 'bg-blue-400' :
                      stage.color === 'green' ? 'bg-green-400' :
                      'bg-yellow-400'
                    }`}></div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {stage.stage}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {stage.count} leads
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      €{stage.value.toLocaleString()}
                    </p>
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
            Acciones Rápidas CRM
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/crm/customers/new" className="btn btn-outline flex flex-col items-center p-4">
              <UserGroupIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Nuevo Cliente</span>
            </Link>            <Link to="/crm/leads/new" className="btn btn-outline flex flex-col items-center p-4">
              <ArrowTrendingUpIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Nuevo Lead</span>
            </Link>
            <Link to="/crm/invoices/new" className="btn btn-outline flex flex-col items-center p-4">
              <DocumentTextIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Nueva Factura</span>
            </Link>
            <Link to="/crm/reports" className="btn btn-outline flex flex-col items-center p-4">
              <CurrencyDollarIcon className="h-8 w-8 mb-2" />
              <span className="text-sm">Ver Reportes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CRMDashboard

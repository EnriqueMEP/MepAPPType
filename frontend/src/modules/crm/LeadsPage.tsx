import React from 'react'

const LeadsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Leads
        </h1>
        <button className="btn btn-primary">
          Nuevo Lead
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p className="text-gray-600 dark:text-gray-400">
            Vista Kanban de leads con pipeline de ventas.
            Sistema de seguimiento y conversión de leads a clientes.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LeadsPage

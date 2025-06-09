import React from 'react'

const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestión de Clientes
        </h1>
        <button className="btn btn-primary">
          Nuevo Cliente
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p className="text-gray-600 dark:text-gray-400">
            Lista de clientes con funcionalidades CRUD completas.
            Inspirado en las mejores prácticas de Crater CRM.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CustomersPage

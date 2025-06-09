import React from 'react'

const ERPModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          ERP - Planificación de Recursos
        </h1>
        <button className="btn btn-primary">
          Nuevo Registro
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Inventario</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 dark:text-gray-400">
              Gestión de inventario inspirada en ERPNext
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Contabilidad</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 dark:text-gray-400">
              Sistema contable integrado
            </p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium">Compras</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-600 dark:text-gray-400">
              Gestión de proveedores y compras
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ERPModule

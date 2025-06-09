import React from 'react'

const InvoicesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Facturación
        </h1>
        <button className="btn btn-primary">
          Nueva Factura
        </button>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p className="text-gray-600 dark:text-gray-400">
            Sistema completo de facturación inspirado en Crater.
            Gestión de facturas, presupuestos y pagos.
          </p>
        </div>
      </div>
    </div>
  )
}

export default InvoicesPage

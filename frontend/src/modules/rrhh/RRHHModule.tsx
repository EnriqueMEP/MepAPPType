import React from 'react'

const RRHHModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          RRHH - Recursos Humanos
        </h1>
        <button className="btn btn-primary">
          Nuevo Empleado
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Empleados</h3>
          <p className="text-2xl font-bold text-primary-600">156</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Solicitudes</h3>
          <p className="text-2xl font-bold text-yellow-600">12</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Ausencias</h3>
          <p className="text-2xl font-bold text-red-600">3</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Nóminas</h3>
          <p className="text-2xl font-bold text-green-600">€125K</p>
        </div>
      </div>
      
      <div className="card">
        <div className="card-body">
          <p className="text-gray-600 dark:text-gray-400">
            Sistema completo de RRHH inspirado en OpenHRMS.
            Gestión de empleados, nóminas, solicitudes y asistencia.
          </p>
        </div>
      </div>
    </div>
  )
}

export default RRHHModule

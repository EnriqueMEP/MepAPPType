import React from 'react'

const UsersModule: React.FC = () => {
  const users = [
    { id: 1, name: 'Ana García', email: 'ana@empresa.com', role: 'Administrador', status: 'active' },
    { id: 2, name: 'Carlos López', email: 'carlos@empresa.com', role: 'Editor', status: 'active' },
    { id: 3, name: 'María Rodríguez', email: 'maria@empresa.com', role: 'Usuario', status: 'inactive' },
    { id: 4, name: 'Juan Martínez', email: 'juan@empresa.com', role: 'Editor', status: 'active' }
  ]

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Administrador': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'Editor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Usuarios y Roles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sistema de permisos inspirado en Appwrite
          </p>
        </div>
        <button className="btn btn-primary">
          Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Total Usuarios</h3>
          <p className="text-2xl font-bold text-primary-600">24</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Activos</h3>
          <p className="text-2xl font-bold text-green-600">22</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Administradores</h3>
          <p className="text-2xl font-bold text-purple-600">3</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Nuevos (Mes)</h3>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Lista de Usuarios
          </h3>
        </div>
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400">
                        Editar
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Roles and Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Roles del Sistema
            </h3>
          </div>
          <div className="card-body space-y-4">
            {['Administrador', 'Editor', 'Usuario'].map((role) => (
              <div key={role} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{role}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {role === 'Administrador' ? 'Acceso completo al sistema' :
                     role === 'Editor' ? 'Puede crear y editar contenido' :
                     'Acceso de solo lectura'}
                  </p>
                </div>
                <button className="text-primary-600 hover:text-primary-500 text-sm">
                  Configurar
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Permisos por Módulo
            </h3>
          </div>
          <div className="card-body space-y-4">
            {['CRM', 'ERP', 'RRHH', 'Chat', 'Tareas'].map((module) => (
              <div key={module} className="flex items-center justify-between">
                <span className="font-medium text-gray-900 dark:text-white">{module}</span>
                <div className="flex space-x-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" defaultChecked />
                    <span className="text-xs">Leer</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" defaultChecked />
                    <span className="text-xs">Escribir</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-1" />
                    <span className="text-xs">Admin</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsersModule

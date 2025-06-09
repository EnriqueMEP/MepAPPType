import React from 'react'

const TasksModule: React.FC = () => {
  const kanbanColumns = [
    { id: 'backlog', title: 'Backlog', color: 'gray', count: 8 },
    { id: 'todo', title: 'Por Hacer', color: 'blue', count: 5 },
    { id: 'in-progress', title: 'En Progreso', color: 'yellow', count: 3 },
    { id: 'review', title: 'Revisión', color: 'purple', count: 2 },
    { id: 'done', title: 'Completado', color: 'green', count: 12 }
  ]

  const sampleTasks = [
    { id: 1, title: 'Diseñar interfaz de usuario', assignee: 'Ana García', priority: 'high' },
    { id: 2, title: 'Implementar autenticación', assignee: 'Carlos López', priority: 'medium' },
    { id: 3, title: 'Configurar base de datos', assignee: 'María Rodríguez', priority: 'high' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Gestión de Tareas y Proyectos
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Vista Kanban inspirada en Plane - Metodología ágil
          </p>
        </div>
        <button className="btn btn-primary">
          Nueva Tarea
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex space-x-6 overflow-x-auto pb-4">
        {kanbanColumns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      column.color === 'gray' ? 'bg-gray-400' :
                      column.color === 'blue' ? 'bg-blue-400' :
                      column.color === 'yellow' ? 'bg-yellow-400' :
                      column.color === 'purple' ? 'bg-purple-400' :
                      'bg-green-400'
                    }`}></div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                  </div>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                    {column.count}
                  </span>
                </div>
              </div>
              <div className="card-body space-y-3">
                {column.id === 'todo' && sampleTasks.map((task) => (
                  <div key={task.id} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {task.title}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {task.assignee.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                          {task.assignee}
                        </span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
                {column.id !== 'todo' && (
                  <div className="p-8 text-center text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg">
                    <p className="text-sm">Arrastra tareas aquí</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Total Tareas</h3>
          <p className="text-2xl font-bold text-primary-600">30</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">+5 esta semana</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Completadas</h3>
          <p className="text-2xl font-bold text-green-600">12</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">40% del total</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">En Progreso</h3>
          <p className="text-2xl font-bold text-yellow-600">8</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">27% del total</p>
        </div>
        <div className="card p-6">
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Proyectos</h3>
          <p className="text-2xl font-bold text-purple-600">4</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 activos</p>
        </div>
      </div>
    </div>
  )
}

export default TasksModule

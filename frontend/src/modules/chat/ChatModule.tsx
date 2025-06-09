import React from 'react'

const ChatModule: React.FC = () => {
  return (
    <div className="h-full flex">
      {/* Chat sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Chat Empresarial
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Inspirado en Rocket.Chat
          </p>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900 dark:text-white">General</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Último mensaje hace 5 min
              </p>
            </div>
            <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                <span className="font-medium text-gray-900 dark:text-white">Desarrollo</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Último mensaje hace 2 horas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat main area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <h3 className="font-medium text-gray-900 dark:text-white"># General</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chat general del equipo
          </p>
        </div>
        
        <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900 dark:text-white">Juan Doe</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">10:30 AM</span>
                </div>
                <p className="text-gray-800 dark:text-gray-200 mt-1">
                  ¡Buenos días! ¿Cómo va el proyecto?
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              className="flex-1 input"
            />
            <button className="btn btn-primary">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatModule

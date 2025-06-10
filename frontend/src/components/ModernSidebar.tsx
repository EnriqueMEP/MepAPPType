import React from 'react'
import { 
  HomeIcon,
  FolderIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon,
  CubeIcon,
  ArchiveBoxIcon,
} from '@heroicons/react/24/outline'

interface SidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
}

/**
 * 🎨 Sidebar MEP-Projects
 * Sidebar moderno con el diseño verde oscuro como en tu imagen
 */
const ModernSidebar: React.FC<SidebarProps> = ({ 
  activeItem = 'inicio', 
  onItemClick 
}) => {
  const menuItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: HomeIcon,
      section: 'principal'
    },
    {
      id: 'proyectos',
      label: 'Proyectos',
      icon: FolderIcon,
      badge: '5',
      section: 'principal'
    },
    {
      id: 'tareas',
      label: 'Tareas',
      icon: CheckCircleIcon,
      badge: '12',
      section: 'principal'
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: ChatBubbleLeftRightIcon,
      badge: '3',
      section: 'principal'
    },
    {
      id: 'crm',
      label: 'CRM',
      icon: UserGroupIcon,
      section: 'modulos'
    },
    {
      id: 'erp',
      label: 'ERP',
      icon: ChartBarIcon,
      section: 'modulos'
    },
    {
      id: 'rrhh',
      label: 'RRHH',
      icon: UserGroupIcon,
      section: 'modulos'
    },
    {
      id: 'inventario',
      label: 'Inventario',
      icon: ArchiveBoxIcon,
      section: 'modulos'
    }
  ]

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId)
  }

  return (
    <div className="sidebar">
      {/* Logo Header */}
      <div className="sidebar-logo">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center mr-3 shadow-glow">
            <CubeIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">MEP-Projects</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        
        {/* Sección Principal */}
        <div className="mb-6">
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Principal
          </h3>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'principal').map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              
              return (                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`nav-link w-full group ${
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <Icon className="nav-icon group-hover:scale-110" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className={`
                      inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full
                      ${isActive 
                        ? 'bg-white text-primary-600' 
                        : 'bg-gray-600 text-gray-300'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Sección Módulos */}
        <div>
          <h3 className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Módulos
          </h3>
          <div className="space-y-1">
            {menuItems.filter(item => item.section === 'modulos').map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              
              return (                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`nav-link w-full group ${
                    isActive ? 'nav-link-active' : 'nav-link-inactive'
                  }`}
                >
                  <Icon className="nav-icon group-hover:scale-110" />
                  <span className="flex-1 text-left">{item.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Footer del Sidebar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-700 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">E</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Enrique</p>
            <p className="text-xs text-gray-400 truncate">admin@mep.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModernSidebar

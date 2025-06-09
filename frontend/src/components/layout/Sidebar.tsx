import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import {
  HomeIcon,
  UserGroupIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

/**
 * Sidebar de navegación - conserva tu estructura modular original
 * Módulos: Dashboard, CRM, ERP, RRHH, Chat, Tareas, Usuarios
 */
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'CRM', href: '/crm', icon: UserGroupIcon },
    { name: 'ERP', href: '/erp', icon: BriefcaseIcon },
    { name: 'RRHH', href: '/rrhh', icon: UsersIcon },
    { name: 'Chat', href: '/chat', icon: ChatBubbleLeftRightIcon },
    { name: 'Tareas', href: '/tasks', icon: ClipboardDocumentListIcon },
    { name: 'Usuarios', href: '/users', icon: CurrencyDollarIcon },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MEP</span>
            </div>
            <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
              Projects
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : 'nav-link-inactive'}`
              }
              onClick={onClose}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* User info and logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role?.name || 'Sin rol'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn btn-outline text-sm"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  )
}

export default Sidebar

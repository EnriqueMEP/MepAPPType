# 🚀 MEP-Projects - Guía de Inicio Rápido

## ✅ Estado: COMPLETADO - LISTO PARA PRODUCCIÓN

### 🎯 Inicio Rápido (Recomendado)

#### Opción 1: Script Automatizado (Windows)
```powershell
# Configuración completa automática
.\setup.ps1

# Inicio de desarrollo
.\start-dev.ps1
```

#### Opción 2: Desarrollo con Docker
```bash
# Desarrollo
docker-compose -f docker-compose.dev.yml up

# Producción
docker-compose up
```

#### Opción 3: Instalación Manual
```bash
# Backend
cd backend
npm install
npm run build
npm run migrate
npm run seed
npm run dev

# Frontend (en otra terminal)
cd frontend
npm install
npm run dev
```

### 🌐 URLs de Acceso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/api/docs
- **Backend Health**: http://localhost:5000/api/health

### 👤 Usuarios de Prueba

| Email | Contraseña | Rol |
|-------|------------|-----|
| admin@mep-projects.com | admin123456 | Super Admin |
| manager@mep-projects.com | manager123456 | Manager |
| employee@mep-projects.com | employee123456 | Employee |

### 📋 Funcionalidades Principales

#### ✅ Sistema de Autenticación
- Login/logout con JWT
- Recuperación de contraseña
- Verificación de email
- Roles y permisos

#### ✅ Gestión de Tareas
- Creación y gestión de proyectos
- Asignación de tareas
- Comentarios y seguimiento
- Notificaciones por email

#### ✅ CRM Completo
- Gestión de clientes
- Pipeline de ventas
- Leads y oportunidades
- Facturas y presupuestos

#### ✅ RRHH
- Gestión de empleados
- Departamentos y posiciones
- Nómina básica
- Evaluaciones de desempeño

#### ✅ Chat en Tiempo Real
- Mensajes privados y grupales
- Notificaciones instantáneas
- Historial de conversaciones
- WebSocket con Socket.IO

#### ✅ Sistema de Archivos
- Upload de archivos por módulo
- Validación de tipos
- Organización automática
- API REST para gestión

### 🔧 Comandos Disponibles

#### Backend
```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm run test         # Ejecutar tests
npm run migrate      # Ejecutar migraciones
npm run seed         # Cargar datos de prueba
```

#### Frontend
```bash
npm run dev          # Desarrollo con Vite
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Linting con ESLint
```

### 📊 Arquitectura

```
MEP-Projects/
├── backend/         # API REST con Express + TypeScript
│   ├── src/controllers/    # Controladores de API
│   ├── src/services/       # Lógica de negocio
│   ├── src/middleware/     # Middleware personalizado
│   ├── src/routes/         # Definición de rutas
│   ├── src/types/          # Tipos TypeScript
│   ├── src/utils/          # Utilidades
│   └── src/database/       # Migraciones y seeds
├── frontend/        # React + TypeScript + Tailwind
│   ├── src/components/     # Componentes React
│   ├── src/modules/        # Módulos por funcionalidad
│   ├── src/services/       # APIs y servicios
│   ├── src/stores/         # Estado global (Zustand)
│   └── src/types/          # Tipos TypeScript
└── docs/           # Documentación
```

### 🛠️ Tecnologías

#### Backend
- **Node.js** + **Express.js**
- **TypeScript** para type safety
- **PostgreSQL** como base de datos
- **Knex.js** para queries y migraciones
- **JWT** para autenticación
- **Socket.IO** para tiempo real
- **Jest** para testing

#### Frontend
- **React 18** + **TypeScript**
- **Vite** como build tool
- **Tailwind CSS** para estilos
- **React Query** para manejo de estado servidor
- **Zustand** para estado global
- **React Router** para navegación

#### DevOps
- **Docker** + **Docker Compose**
- **Nginx** como reverse proxy
- **PowerShell** scripts para automatización

### 🐛 Solución de Problemas

#### Error de permisos en PowerShell
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Error de puerto ocupado
```bash
# Cambiar puertos en .env o docker-compose.yml
PORT=3002  # Backend
VITE_PORT=3001  # Frontend
```

#### Error de base de datos
```bash
# Verificar PostgreSQL está corriendo
# Revisar credenciales en .env
# Ejecutar migraciones: npm run migrate
```

### 📚 Documentación Adicional

- **API Documentation**: `/docs/API.md`
- **Project Status**: `/PROJECT_STATUS.md`
- **Completion Report**: `/COMPLETION_REPORT.md`
- **OpenAPI/Swagger**: http://localhost:5000/api/docs

### 🎉 ¡Disfruta desarrollando con MEP-Projects!

El proyecto está completamente funcional y listo para ser usado en desarrollo y producción.

---

**¿Necesitas ayuda?** Revisa la documentación en `/docs/` o los archivos de configuración.

# MEP-Projects - Sistema Empresarial Escalable

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

Sistema empresarial moderno y escalable que integra funcionalidades de CRM, ERP, RRHH, gestión de tareas y chat en tiempo real.

## 🚀 Características Principales

- **CRM Completo**: Gestión de clientes, leads, deals y pipeline de ventas
- **ERP Integrado**: Planificación de recursos empresariales
- **RRHH**: Gestión de empleados, departamentos y posiciones
- **Gestión de Tareas**: Proyectos, tareas y seguimiento de progreso
- **Chat en Tiempo Real**: Comunicación interna con WebSockets
- **Sistema de Archivos**: Upload, gestión y organización de documentos
- **Autenticación JWT**: Sistema seguro de autenticación y autorización
- **API REST Completa**: Documentación OpenAPI/Swagger
- **Dashboard Analytics**: Métricas y reportes en tiempo real

## 🏗️ Arquitectura

```
MEP-Projects/
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express + PostgreSQL
├── nginx/             # Configuración de proxy
├── docs/              # Documentación
└── docker-compose.yml # Orquestación de contenedores
```

### Stack Tecnológico

**Frontend:**
- React 18.2+
- TypeScript 5.2+
- Vite (build tool)
- Tailwind CSS
- Zustand (state management)
- React Router

**Backend:**
- Node.js 18+
- Express.js
- TypeScript
- PostgreSQL 15+
- Knex.js (query builder)
- Socket.IO (WebSockets)
- JWT Authentication
- Multer (file uploads)
- Nodemailer (emails)

**DevOps:**
- Docker & Docker Compose
- Nginx (reverse proxy)
- Jest (testing)
- ESLint + Prettier

## 🔧 Configuración de Desarrollo

### Prerrequisitos

- Node.js 18+ 
- PostgreSQL 15+
- npm o yarn
- Docker (opcional)

### Instalación Rápida

1. **Clonar el repositorio:**
```bash
git clone https://github.com/tu-usuario/mep-projects.git
cd mep-projects
```

2. **Configurar base de datos (opción 1 - Docker):**
```bash
docker-compose -f docker-compose.dev.yml up -d
```

3. **Configurar base de datos (opción 2 - Local):**
```sql
CREATE DATABASE mep_projects_dev;
CREATE USER mep_user WITH PASSWORD 'mep_password';
GRANT ALL PRIVILEGES ON DATABASE mep_projects_dev TO mep_user;
```

4. **Configurar Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Editar .env con tu configuración
npm run migrate
npm run seed
npm run dev
```

5. **Configurar Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Variables de Entorno

**Backend (.env):**
```env
NODE_ENV=development
PORT=5000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mep_projects_dev
DB_USER=mep_user
DB_PASS=mep_password

# JWT
JWT_SECRET=tu-secret-key-muy-seguro
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-password
FROM_EMAIL=noreply@mep-projects.com
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MEP-Projects
```

## 🐳 Despliegue con Docker

### Desarrollo
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Producción
```bash
docker-compose up -d
```

### Comandos Útiles
```bash
# Ver logs
docker-compose logs -f

# Ejecutar migraciones
docker-compose exec backend npm run migrate

# Ejecutar seeds
docker-compose exec backend npm run seed

# Acceder al contenedor
docker-compose exec backend sh
```

## 📋 Scripts Disponibles

### Backend
```bash
npm run dev         # Desarrollo con nodemon
npm run build       # Compilar TypeScript
npm run start       # Producción
npm run migrate     # Ejecutar migraciones
npm run seed        # Ejecutar seeds
npm run test        # Ejecutar pruebas
npm run test:watch  # Pruebas en modo watch
```

### Frontend
```bash
npm run dev         # Desarrollo con Vite
npm run build       # Build para producción
npm run preview     # Vista previa del build
npm run lint        # Linter
npm run type-check  # Verificación de tipos
```

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:watch
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm run test
npm run test:ui
```

## 📖 Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a:

- **Swagger UI**: http://localhost:5000/api-docs
- **Documentación Markdown**: [docs/API.md](docs/API.md)

### Endpoints Principales

- `POST /api/auth/login` - Autenticación
- `GET /api/crm/customers` - Listar clientes
- `POST /api/tasks/projects` - Crear proyecto
- `GET /api/chat/rooms` - Salas de chat
- `POST /api/files/upload` - Subir archivos

## 🔑 Usuarios por Defecto

Después de ejecutar los seeds, tendrás estos usuarios disponibles:

| Email | Password | Rol |
|-------|----------|-----|
| admin@mep.com | admin123 | admin |
| manager@mep.com | manager123 | manager |
| employee@mep.com | employee123 | employee |

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Swagger Docs**: http://localhost:5000/api-docs
- **Base de datos (Adminer)**: http://localhost:8080

## 📁 Estructura de Archivos

```
MEP-Projects/
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes reutilizables
│   │   ├── modules/        # Módulos principales (CRM, RRHH, etc.)
│   │   ├── stores/         # Estado global (Zustand)
│   │   ├── services/       # Servicios API
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/    # Controladores
│   │   ├── services/       # Lógica de negocio
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Middleware
│   │   ├── database/       # Migraciones y seeds
│   │   ├── types/          # Tipos TypeScript
│   │   └── utils/          # Utilidades
│   ├── tests/              # Pruebas
│   └── package.json
└── docs/                   # Documentación
```

## 🔧 Resolución de Problemas

### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
sudo service postgresql status

# Verificar conexión
psql -h localhost -p 5432 -U mep_user -d mep_projects_dev
```

### Error de tipos en VS Code
1. Reinstalar dependencias: `npm install`
2. Reiniciar TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
3. Verificar extensiones: instalar "Tailwind CSS IntelliSense"

### Error de CORS
Verificar que `CORS_ORIGIN` en el backend apunte al frontend correcto.

### Error de WebSocket
Verificar que no haya conflictos de puertos y que Socket.IO esté configurado correctamente.

## 🤝 Contribuir

1. Fork el proyecto
2. Crear una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit los cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Roadmap

- [ ] Sistema de notificaciones push
- [ ] Integración con servicios de email (SendGrid, SES)
- [ ] Sistema de backup automático
- [ ] Dashboard de métricas avanzadas
- [ ] Aplicación móvil (React Native)
- [ ] Integración con APIs externas (Slack, Teams)
- [ ] Sistema de workflows automatizados
- [ ] Reportes PDF/Excel
- [ ] Multi-tenancy
- [ ] Modo offline

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📧 Soporte

- **Email**: support@mep-projects.com
- **Documentación**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/mep-projects/issues)

---

**MEP-Projects** - Sistema empresarial moderno para la gestión integral de tu organización.

# MEP-Projects API Documentation

## Descripción General

MEP-Projects es un sistema empresarial escalable que combina funcionalidades de CRM, ERP, RRHH, gestión de tareas y chat en tiempo real. Esta API proporciona endpoints para todas las funcionalidades del sistema.

## Base URL
```
http://localhost:5000/api
```

## Autenticación

La API utiliza autenticación JWT (JSON Web Tokens). Para acceder a los endpoints protegidos, incluya el token en el header Authorization:

```
Authorization: Bearer <tu-jwt-token>
```

## Respuestas Estándar

### Respuesta Exitosa
```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { /* datos de respuesta */ }
}
```

### Respuesta de Error
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": {
    "code": "ERROR_CODE",
    "details": ["detalle 1", "detalle 2"]
  }
}
```

## Endpoints de Autenticación

### POST /auth/register
Registrar nuevo usuario

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan.perez@empresa.com",
  "password": "password123",
  "role": "employee"
}
```

### POST /auth/login
Iniciar sesión

**Body:**
```json
{
  "email": "admin@mep.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "name": "Admin User",
      "email": "admin@mep.com",
      "role": "admin"
    },
    "token": "jwt-token-here"
  }
}
```

### GET /auth/profile
Obtener perfil del usuario autenticado (requiere autenticación)

### PUT /auth/profile
Actualizar perfil del usuario autenticado (requiere autenticación)

## Endpoints de CRM

### Clientes

#### GET /crm/customers
Obtener lista de clientes

**Query Parameters:**
- `page` (opcional): Número de página
- `limit` (opcional): Elementos por página
- `search` (opcional): Término de búsqueda

#### POST /crm/customers
Crear nuevo cliente

**Body:**
```json
{
  "name": "Empresa ABC S.A.",
  "email": "contacto@empresa-abc.com",
  "phone": "+1234567890",
  "address": "Calle Principal 123",
  "website": "https://empresa-abc.com",
  "industry": "Tecnología"
}
```

#### GET /crm/customers/:id
Obtener cliente por ID

#### PUT /crm/customers/:id
Actualizar cliente

#### DELETE /crm/customers/:id
Eliminar cliente

### Leads

#### GET /crm/leads
Obtener lista de leads

#### POST /crm/leads
Crear nuevo lead

**Body:**
```json
{
  "customerId": "uuid",
  "title": "Oportunidad de software",
  "description": "Cliente interesado en software de gestión",
  "value": 15000.00,
  "status": "new",
  "priority": "high"
}
```

#### GET /crm/leads/:id
Obtener lead por ID

#### PUT /crm/leads/:id
Actualizar lead

#### DELETE /crm/leads/:id
Eliminar lead

### Deals

#### GET /crm/deals
Obtener lista de deals

#### POST /crm/deals
Crear nuevo deal

#### GET /crm/deals/:id
Obtener deal por ID

#### PUT /crm/deals/:id
Actualizar deal

#### DELETE /crm/deals/:id
Eliminar deal

### Analytics

#### GET /crm/analytics/overview
Obtener resumen de CRM

#### GET /crm/analytics/sales-by-month
Obtener ventas por mes

#### GET /crm/analytics/conversion-funnel
Obtener embudo de conversión

## Endpoints de RRHH

### Departamentos

#### GET /rrhh/departments
Obtener lista de departamentos

#### POST /rrhh/departments
Crear nuevo departamento

**Body:**
```json
{
  "name": "Tecnología",
  "description": "Departamento de desarrollo y sistemas",
  "managerId": "uuid"
}
```

#### GET /rrhh/departments/:id
Obtener departamento por ID

#### PUT /rrhh/departments/:id
Actualizar departamento

#### DELETE /rrhh/departments/:id
Eliminar departamento

### Empleados

#### GET /rrhh/employees
Obtener lista de empleados

#### POST /rrhh/employees
Crear nuevo empleado

**Body:**
```json
{
  "userId": "uuid",
  "employeeCode": "EMP001",
  "departmentId": "uuid",
  "positionId": "uuid",
  "hireDate": "2024-01-15",
  "salary": 50000.00
}
```

#### GET /rrhh/employees/:id
Obtener empleado por ID

#### PUT /rrhh/employees/:id
Actualizar empleado

#### DELETE /rrhh/employees/:id
Eliminar empleado

### Posiciones

#### GET /rrhh/positions
Obtener lista de posiciones

#### POST /rrhh/positions
Crear nueva posición

#### GET /rrhh/positions/:id
Obtener posición por ID

#### PUT /rrhh/positions/:id
Actualizar posición

#### DELETE /rrhh/positions/:id
Eliminar posición

## Endpoints de Tareas

### Proyectos

#### GET /tasks/projects
Obtener lista de proyectos

#### POST /tasks/projects
Crear nuevo proyecto

**Body:**
```json
{
  "name": "Desarrollo de nueva funcionalidad",
  "description": "Implementación de módulo de reportes",
  "status": "active",
  "startDate": "2024-01-01",
  "endDate": "2024-06-30",
  "managerId": "uuid"
}
```

#### GET /tasks/projects/:id
Obtener proyecto por ID

#### PUT /tasks/projects/:id
Actualizar proyecto

#### DELETE /tasks/projects/:id
Eliminar proyecto

### Tareas

#### GET /tasks/tasks
Obtener lista de tareas

#### POST /tasks/tasks
Crear nueva tarea

**Body:**
```json
{
  "projectId": "uuid",
  "title": "Implementar autenticación JWT",
  "description": "Configurar middleware de autenticación",
  "status": "todo",
  "priority": "high",
  "assignedTo": "uuid",
  "dueDate": "2024-02-15"
}
```

#### GET /tasks/tasks/:id
Obtener tarea por ID

#### PUT /tasks/tasks/:id
Actualizar tarea

#### DELETE /tasks/tasks/:id
Eliminar tarea

## Endpoints de Chat

### Salas de Chat

#### GET /chat/rooms
Obtener lista de salas de chat

#### POST /chat/rooms
Crear nueva sala de chat

**Body:**
```json
{
  "name": "Equipo de Desarrollo",
  "description": "Chat del equipo de desarrollo",
  "type": "group"
}
```

#### GET /chat/rooms/:id
Obtener sala de chat por ID

#### PUT /chat/rooms/:id
Actualizar sala de chat

#### DELETE /chat/rooms/:id
Eliminar sala de chat

### Mensajes

#### GET /chat/rooms/:roomId/messages
Obtener mensajes de una sala

#### POST /chat/rooms/:roomId/messages
Enviar mensaje a una sala

**Body:**
```json
{
  "content": "Hola equipo, ¿cómo van con el proyecto?",
  "type": "text"
}
```

#### PUT /chat/messages/:id
Actualizar mensaje

#### DELETE /chat/messages/:id
Eliminar mensaje

## Endpoints de Archivos

### Subir Archivos

#### POST /files/upload
Subir múltiples archivos

**Form Data:**
- `files`: Archivos a subir (máximo 5)
- `module`: Módulo del archivo (documents, images, avatars, etc.)
- `entityId` (opcional): ID de la entidad relacionada
- `entityType` (opcional): Tipo de entidad relacionada

#### POST /files/upload-single
Subir archivo único

### Gestionar Archivos

#### GET /files/entity/:entityType/:entityId
Obtener archivos por entidad

#### GET /files/module/:module
Obtener archivos por módulo

#### GET /files/info/:id
Obtener información de archivo

#### GET /files/download/:module/:filename
Descargar archivo

#### GET /files/view/:module/:filename
Ver archivo (streaming)

#### DELETE /files/:id
Eliminar archivo

#### GET /files/search
Buscar archivos

**Query Parameters:**
- `q`: Término de búsqueda
- `module` (opcional): Filtrar por módulo
- `type` (opcional): Filtrar por tipo MIME
- `limit` (opcional): Límite de resultados

#### GET /files/stats
Obtener estadísticas de archivos

#### POST /files/cleanup
Limpiar archivos huérfanos (solo admin)

## WebSocket Events (Chat en Tiempo Real)

### Eventos del Cliente

#### join-room
Unirse a una sala de chat
```json
{
  "roomId": "uuid",
  "userId": "uuid"
}
```

#### leave-room
Salir de una sala de chat
```json
{
  "roomId": "uuid",
  "userId": "uuid"
}
```

#### send-message
Enviar mensaje
```json
{
  "roomId": "uuid",
  "content": "Mensaje",
  "type": "text"
}
```

#### typing-start
Iniciar indicador de escritura
```json
{
  "roomId": "uuid",
  "userId": "uuid"
}
```

#### typing-stop
Detener indicador de escritura
```json
{
  "roomId": "uuid",
  "userId": "uuid"
}
```

### Eventos del Servidor

#### new-message
Nuevo mensaje recibido

#### user-joined
Usuario se unió a la sala

#### user-left
Usuario salió de la sala

#### typing-start
Usuario empezó a escribir

#### typing-stop
Usuario dejó de escribir

## Códigos de Estado HTTP

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Unprocessable Entity
- `429` - Too Many Requests
- `500` - Internal Server Error

## Rate Limiting

La API implementa límites de tasa para prevenir abuso:

- **General**: 100 requests por 15 minutos
- **Upload**: 20 uploads por 15 minutos
- **Auth**: 5 intentos de login por 15 minutos

## Tipos de Archivo Soportados

### Imágenes
- JPEG (image/jpeg)
- PNG (image/png)
- GIF (image/gif)
- WebP (image/webp)

### Documentos
- PDF (application/pdf)
- Word (application/msword, .docx)
- Excel (application/vnd.ms-excel, .xlsx)
- Texto plano (text/plain)
- CSV (text/csv)

### Límites
- Tamaño máximo por archivo: 10MB
- Máximo 5 archivos por upload

## Configuración de CORS

La API está configurada para aceptar requests desde:
- `http://localhost:3000` (desarrollo frontend)
- `http://localhost:5173` (Vite dev server)
- Dominios de producción configurados

## Variables de Entorno

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mep_projects
DB_USER=postgres
DB_PASS=password
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:3000
```

## Ejemplos de Uso

### Autenticación y uso básico

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@mep.com',
    password: 'admin123'
  })
});

const { data } = await loginResponse.json();
const token = data.token;

// Usar token para requests protegidos
const customersResponse = await fetch('/api/crm/customers', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Upload de archivos

```javascript
const formData = new FormData();
formData.append('files', file);
formData.append('module', 'documents');
formData.append('entityType', 'customer');
formData.append('entityId', 'customer-uuid');

const uploadResponse = await fetch('/api/files/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

### WebSocket connection

```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: jwtToken
  }
});

// Unirse a una sala
socket.emit('join-room', {
  roomId: 'room-uuid',
  userId: 'user-uuid'
});

// Escuchar nuevos mensajes
socket.on('new-message', (message) => {
  console.log('Nuevo mensaje:', message);
});
```

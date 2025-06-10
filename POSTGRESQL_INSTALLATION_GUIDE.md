# 🐘 GUÍA DE INSTALACIÓN DE POSTGRESQL PARA MEP-PROJECTS

## 📥 **PASO 1: DESCARGAR POSTGRESQL**

1. **Ir al sitio oficial:**
   - Abrir navegador y ir a: https://www.postgresql.org/download/windows/
   
2. **Descargar PostgreSQL 15 o 16:**
   - Hacer clic en "Download the installer"
   - Seleccionar la versión para Windows x86-64
   - Descargar el archivo .exe

## 🔧 **PASO 2: INSTALAR POSTGRESQL**

1. **Ejecutar el instalador:**
   - Hacer doble clic en el archivo descargado
   - Ejecutar como administrador si es necesario

2. **Configuración durante la instalación:**
   - **Installation Directory:** Dejar por defecto (C:\Program Files\PostgreSQL\15\)
   - **Components:** Seleccionar todos (PostgreSQL Server, pgAdmin 4, Stack Builder, Command Line Tools)
   - **Data Directory:** Dejar por defecto
   - **Password:** Usar una contraseña que recuerdes (ej: `postgres` o `admin123`)
   - **Port:** Dejar 5432 (por defecto)
   - **Locale:** Dejar por defecto

3. **Completar instalación:**
   - Hacer clic en "Next" y luego "Finish"
   - NO ejecutar Stack Builder por ahora

## 🗄️ **PASO 3: VERIFICAR INSTALACIÓN**

1. **Abrir pgAdmin 4:**
   - Buscar "pgAdmin 4" en el menú inicio
   - Ingresar la contraseña que configuraste

2. **Verificar que PostgreSQL esté corriendo:**
   - Abrir "Servicios" de Windows (services.msc)
   - Buscar "postgresql-x64-15" (o similar)
   - Debe estar "En ejecución"

## 🏗️ **PASO 4: CREAR BASE DE DATOS PARA MEP-PROJECTS**

1. **Abrir pgAdmin 4**
2. **Conectarse al servidor:**
   - Expandir "Servers" > "PostgreSQL 15"
   - Ingresar contraseña si se solicita

3. **Crear base de datos:**
   - Clic derecho en "Databases"
   - Seleccionar "Create" > "Database..."
   - **Name:** `mep_projects_db`
   - **Owner:** postgres
   - Clic en "Save"

4. **Crear usuario para la aplicación:**
   - Clic derecho en "Login/Group Roles"
   - Seleccionar "Create" > "Login/Group Role..."
   - **General tab:**
     - Name: `mep_user`
   - **Definition tab:**
     - Password: `mep_password`
   - **Privileges tab:**
     - Can login: ✅ Sí
     - Superuser: ✅ Sí (para desarrollo)
   - Clic en "Save"

## 🔧 **CONFIGURACIONES IMPORTANTES**

### **Variables de Entorno (Opcional pero recomendado):**
1. Abrir "Variables de entorno del sistema"
2. Agregar a PATH: `C:\Program Files\PostgreSQL\15\bin`
3. Esto permitirá usar `psql` desde cualquier terminal

### **Verificar conexión desde terminal:**
```cmd
psql -U postgres -h localhost -p 5432
```

## 📋 **CREDENCIALES FINALES**

Después de la instalación, tendrás:

- **Host:** localhost
- **Puerto:** 5432
- **Usuario Administrador:** postgres
- **Contraseña Admin:** [la que configuraste]
- **Base de Datos:** mep_projects_db
- **Usuario App:** mep_user
- **Contraseña App:** mep_password

## ⚡ **COMANDOS RÁPIDOS**

### **Iniciar PostgreSQL (si no inicia automáticamente):**
```cmd
net start postgresql-x64-15
```

### **Detener PostgreSQL:**
```cmd
net stop postgresql-x64-15
```

### **Conectarse desde terminal:**
```cmd
psql -U mep_user -d mep_projects_db -h localhost
```

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Si PostgreSQL no inicia:**
1. Verificar que el servicio esté habilitado
2. Revisar logs en: `C:\Program Files\PostgreSQL\15\data\log\`
3. Reiniciar el servicio desde "Servicios" de Windows

### **Si no puedes conectarte:**
1. Verificar que el puerto 5432 no esté ocupado
2. Verificar configuración de firewall
3. Revisar archivo `pg_hba.conf` si es necesario

---

**🎯 Una vez completada la instalación, ejecuta el script de configuración desde la carpeta del proyecto.**

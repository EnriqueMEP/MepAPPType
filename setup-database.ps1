# Script para configurar la base de datos de MEP-Projects
param(
    [string]$PostgresPassword = "admin123",
    [string]$Host = "localhost",
    [int]$Port = 5432
)

Write-Host "🗄️ Configurando base de datos MEP-Projects..." -ForegroundColor Green

# Definir variables
$dbName = "mep_projects_db"
$dbUser = "mep_user"
$dbPassword = "mep_password"
$testDbName = "mep_projects_test_db"
$testDbUser = "mep_test_user"
$testDbPassword = "mep_test_password"

# Función para ejecutar comandos SQL
function Invoke-PostgresCommand {
    param(
        [string]$Command,
        [string]$Database = "postgres",
        [string]$Username = "postgres"
    )
    
    $env:PGPASSWORD = $PostgresPassword
    $psqlPath = "C:\Program Files\PostgreSQL\15\bin\psql.exe"
    
    if (!(Test-Path $psqlPath)) {
        $psqlPath = "psql"  # Intentar desde PATH
    }
    
    try {
        & $psqlPath -h $Host -p $Port -U $Username -d $Database -c $Command
        return $true
    } catch {
        Write-Host "❌ Error ejecutando comando SQL: $_" -ForegroundColor Red
        return $false
    }
}

# Verificar conexión a PostgreSQL
Write-Host "🔍 Verificando conexión a PostgreSQL..." -ForegroundColor Yellow
if (!(Invoke-PostgresCommand "SELECT version();")) {
    Write-Host "❌ No se pudo conectar a PostgreSQL" -ForegroundColor Red
    Write-Host "📝 Verificar:" -ForegroundColor Yellow
    Write-Host "   - PostgreSQL está ejecutándose" -ForegroundColor White
    Write-Host "   - La contraseña es correcta: $PostgresPassword" -ForegroundColor White
    Write-Host "   - El puerto $Port está disponible" -ForegroundColor White
    exit 1
}

Write-Host "✅ Conexión a PostgreSQL exitosa" -ForegroundColor Green

# Crear usuario de la aplicación
Write-Host "👤 Creando usuario de aplicación..." -ForegroundColor Yellow
$createUserCommand = "CREATE USER $dbUser WITH PASSWORD '$dbPassword' CREATEDB;"
Invoke-PostgresCommand $createUserCommand

# Crear base de datos principal
Write-Host "🗄️ Creando base de datos principal..." -ForegroundColor Yellow
$createDbCommand = "CREATE DATABASE $dbName OWNER $dbUser;"
Invoke-PostgresCommand $createDbCommand

# Conceder permisos
Write-Host "🔐 Configurando permisos..." -ForegroundColor Yellow
Invoke-PostgresCommand "GRANT ALL PRIVILEGES ON DATABASE $dbName TO $dbUser;"

# Crear usuario y base de datos de pruebas
Write-Host "🧪 Creando base de datos de pruebas..." -ForegroundColor Yellow
$createTestUserCommand = "CREATE USER $testDbUser WITH PASSWORD '$testDbPassword' CREATEDB;"
Invoke-PostgresCommand $createTestUserCommand

$createTestDbCommand = "CREATE DATABASE $testDbName OWNER $testDbUser;"
Invoke-PostgresCommand $createTestDbCommand

Invoke-PostgresCommand "GRANT ALL PRIVILEGES ON DATABASE $testDbName TO $testDbUser;"

# Verificar bases de datos creadas
Write-Host "📋 Verificando bases de datos..." -ForegroundColor Yellow
Invoke-PostgresCommand "\l"

# Actualizar archivo .env
Write-Host "📝 Actualizando configuración .env..." -ForegroundColor Yellow
$envPath = "backend\.env"
if (Test-Path $envPath) {
    # Leer contenido actual
    $envContent = Get-Content $envPath -Raw
    
    # Actualizar valores de base de datos
    $envContent = $envContent -replace "DB_HOST=.*", "DB_HOST=$Host"
    $envContent = $envContent -replace "DB_PORT=.*", "DB_PORT=$Port"
    $envContent = $envContent -replace "DB_USER=.*", "DB_USER=$dbUser"
    $envContent = $envContent -replace "DB_PASSWORD=.*", "DB_PASSWORD=$dbPassword"
    $envContent = $envContent -replace "DB_NAME=.*", "DB_NAME=$dbName"
    
    # Actualizar valores de base de datos de pruebas
    $envContent = $envContent -replace "TEST_DB_HOST=.*", "TEST_DB_HOST=$Host"
    $envContent = $envContent -replace "TEST_DB_PORT=.*", "TEST_DB_PORT=$Port"
    $envContent = $envContent -replace "TEST_DB_USER=.*", "TEST_DB_USER=$testDbUser"
    $envContent = $envContent -replace "TEST_DB_PASSWORD=.*", "TEST_DB_PASSWORD=$testDbPassword"
    $envContent = $envContent -replace "TEST_DB_NAME=.*", "TEST_DB_NAME=$testDbName"
    
    # Guardar archivo
    $envContent | Set-Content $envPath -NoNewline
    Write-Host "✅ Archivo .env actualizado" -ForegroundColor Green
} else {
    Write-Host "⚠️ Archivo .env no encontrado en backend/" -ForegroundColor Yellow
}

# Mostrar resumen
Write-Host ""
Write-Host "🎉 ¡Configuración de base de datos completada!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Resumen de configuración:" -ForegroundColor Cyan
Write-Host "   🗄️ Base de datos principal:" -ForegroundColor White
Write-Host "      Nombre: $dbName" -ForegroundColor Gray
Write-Host "      Usuario: $dbUser" -ForegroundColor Gray
Write-Host "      Contraseña: $dbPassword" -ForegroundColor Gray
Write-Host ""
Write-Host "   🧪 Base de datos de pruebas:" -ForegroundColor White
Write-Host "      Nombre: $testDbName" -ForegroundColor Gray
Write-Host "      Usuario: $testDbUser" -ForegroundColor Gray
Write-Host "      Contraseña: $testDbPassword" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Próximos pasos:" -ForegroundColor Yellow
Write-Host "   1. cd backend" -ForegroundColor White
Write-Host "   2. npm run migrate" -ForegroundColor White
Write-Host "   3. npm run seed" -ForegroundColor White
Write-Host "   4. npm start" -ForegroundColor White

# Limpiar variable de entorno
Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue

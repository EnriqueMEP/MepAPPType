# Script de configuración automatizada para MEP-Projects
# Ejecutar con: PowerShell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 Iniciando configuración de MEP-Projects..." -ForegroundColor Green

# Verificar prerrequisitos
Write-Host "📋 Verificando prerrequisitos..." -ForegroundColor Yellow

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instalar Node.js 18+ desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no encontrado" -ForegroundColor Red
    exit 1
}

# Verificar Docker (opcional)
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker encontrado: $dockerVersion" -ForegroundColor Green
    $dockerAvailable = $true
} catch {
    Write-Host "⚠️  Docker no encontrado. Se configurará sin contenedores." -ForegroundColor Yellow
    $dockerAvailable = $false
}

# Configurar Backend
Write-Host "🔧 Configurando Backend..." -ForegroundColor Blue
Set-Location backend

# Instalar dependencias
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
npm install

# Configurar variables de entorno
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Configurando archivo .env..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    
    # Generar JWT secret aleatorio
    $jwtSecret = -join ((1..32 | ForEach-Object { [char](Get-Random -Minimum 65 -Maximum 91) }) + (1..32 | ForEach-Object { [char](Get-Random -Minimum 97 -Maximum 123) }))
    (Get-Content ".env") -replace "JWT_SECRET=.*", "JWT_SECRET=$jwtSecret" | Set-Content ".env"
    
    Write-Host "✅ Archivo .env configurado" -ForegroundColor Green
}

# Configurar base de datos
if ($dockerAvailable) {
    Write-Host "🐳 Iniciando base de datos con Docker..." -ForegroundColor Blue
    Set-Location ..
    docker-compose -f docker-compose.dev.yml up -d database redis
    Start-Sleep -Seconds 10
    Set-Location backend
} else {
    Write-Host "⚠️  Configure manualmente PostgreSQL y actualice el archivo .env" -ForegroundColor Yellow
}

# Ejecutar migraciones
Write-Host "🔄 Ejecutando migraciones de base de datos..." -ForegroundColor Yellow
try {
    npm run migrate
    Write-Host "✅ Migraciones ejecutadas exitosamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error en migraciones. Verifique la configuración de base de datos." -ForegroundColor Yellow
}

# Ejecutar seeds
Write-Host "🌱 Ejecutando seeds de datos..." -ForegroundColor Yellow
try {
    npm run seed
    Write-Host "✅ Seeds ejecutados exitosamente" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Error en seeds." -ForegroundColor Yellow
}

# Configurar Frontend
Write-Host "🎨 Configurando Frontend..." -ForegroundColor Blue
Set-Location ../frontend

Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
npm install

# Configurar archivo de entorno del frontend
if (-not (Test-Path ".env")) {
    Write-Host "⚙️  Configurando variables de entorno del frontend..." -ForegroundColor Yellow
    @"
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MEP-Projects
"@ | Out-File -FilePath ".env" -Encoding UTF8
    Write-Host "✅ Variables de entorno del frontend configuradas" -ForegroundColor Green
}

# Regresar al directorio raíz
Set-Location ..

# Ejecutar pruebas
Write-Host "🧪 Ejecutando pruebas..." -ForegroundColor Blue
Set-Location backend
try {
    npm test
    Write-Host "✅ Todas las pruebas pasaron" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Algunas pruebas fallaron. Revise los logs." -ForegroundColor Yellow
}

Set-Location ..

Write-Host "🎉 ¡Configuración completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar el desarrollo:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && npm run dev" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Para usar Docker:" -ForegroundColor Cyan
Write-Host "docker-compose -f docker-compose.dev.yml up" -ForegroundColor White
Write-Host ""
Write-Host "URLs importantes:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "- Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "- Swagger Docs: http://localhost:5000/api/docs" -ForegroundColor White
if ($dockerAvailable) {
    Write-Host "- Adminer (DB): http://localhost:8080" -ForegroundColor White
}

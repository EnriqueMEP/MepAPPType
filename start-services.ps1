# filepath: c:\Users\MEP\Desktop\MepAppEscalable\start-services.ps1
# Script para iniciar todos los servicios de MEP-Projects

Write-Host "🚀 Iniciando MEP-Projects..." -ForegroundColor Green

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Verificar si npm está disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ NPM: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ NPM no está disponible" -ForegroundColor Red
    exit 1
}

# Instalar dependencias si es necesario
Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

# Backend
if (!(Test-Path "backend/node_modules")) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Frontend
if (!(Test-Path "frontend/node_modules")) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

# Compilar el backend
Write-Host "🔨 Compilando backend..." -ForegroundColor Yellow
Set-Location backend
npm run build
Set-Location ..

# Verificar puertos disponibles
Write-Host "🔍 Verificando puertos..." -ForegroundColor Yellow

$backendPort = 3000
$frontendPort = 5173

# Verificar puerto backend
$backendInUse = Get-NetTCPConnection -LocalPort $backendPort -ErrorAction SilentlyContinue
if ($backendInUse) {
    Write-Host "⚠️ Puerto $backendPort ya está en uso" -ForegroundColor Yellow
}

# Verificar puerto frontend
$frontendInUse = Get-NetTCPConnection -LocalPort $frontendPort -ErrorAction SilentlyContinue
if ($frontendInUse) {
    Write-Host "⚠️ Puerto $frontendPort ya está en uso" -ForegroundColor Yellow
}

# Iniciar backend en una nueva ventana PowerShell
Write-Host "🌐 Iniciando servidor backend (puerto $backendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔥 Backend MEP-Projects' -ForegroundColor Green; npm run dev"

# Esperar un poco antes de iniciar el frontend
Start-Sleep -Seconds 3

# Iniciar frontend en una nueva ventana PowerShell
Write-Host "🎨 Iniciando servidor frontend (puerto $frontendPort)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '⚡ Frontend MEP-Projects' -ForegroundColor Blue; npm run dev"

# Mostrar información de acceso
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "🎉 MEP-Projects iniciado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 URLs de Acceso:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:$frontendPort" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:$backendPort" -ForegroundColor Cyan
Write-Host "   API:      http://localhost:$backendPort/api" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔑 Credenciales de Prueba:" -ForegroundColor White
Write-Host "   Email:    admin@mep-projects.com" -ForegroundColor Yellow
Write-Host "   Password: admin123456" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 Documentación:" -ForegroundColor White
Write-Host "   API Docs: http://localhost:$backendPort/api-docs" -ForegroundColor Cyan
Write-Host ""

# Abrir el navegador automáticamente
Start-Sleep -Seconds 2
Write-Host "🌍 Abriendo navegador..." -ForegroundColor Green
Start-Process "http://localhost:$frontendPort"

Write-Host "✨ ¡Listo para usar!" -ForegroundColor Green
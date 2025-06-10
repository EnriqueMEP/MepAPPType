# ==============================================================================
# MEP-Projects - Iniciador de Aplicación
# ==============================================================================
# Este script inicia automáticamente el backend y frontend de MEP-Projects

Write-Host "🚀 Iniciando MEP-Projects..." -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "Instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Directorio base del proyecto
$projectRoot = $PSScriptRoot
$backendPath = Join-Path $projectRoot "backend"
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "📁 Directorio del proyecto: $projectRoot" -ForegroundColor Cyan

# Verificar que existan las carpetas
if (-not (Test-Path $backendPath)) {
    Write-Host "❌ Error: No se encuentra la carpeta backend" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: No se encuentra la carpeta frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Carpetas backend y frontend encontradas" -ForegroundColor Green

# Función para iniciar un servicio en una nueva ventana de PowerShell
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$WorkingDirectory,
        [string]$Command,
        [string]$Color
    )
    
    Write-Host "🔄 Iniciando $ServiceName..." -ForegroundColor $Color
    
    # Crear comando para nueva ventana de PowerShell
    $psCommand = "cd '$WorkingDirectory'; $Command; Read-Host 'Presiona Enter para cerrar'"
    
    # Iniciar en nueva ventana
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $psCommand -WindowStyle Normal
    
    Write-Host "✅ $ServiceName iniciado en nueva ventana" -ForegroundColor $Color
}

# Esperar un momento para mostrar la información
Start-Sleep -Seconds 1

Write-Host ""
Write-Host "🎯 Iniciando servicios..." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Cyan

# Iniciar Backend
Start-Service -ServiceName "Backend (Puerto 3000)" -WorkingDirectory $backendPath -Command "npm start" -Color "Blue"

# Esperar un poco antes de iniciar el frontend
Start-Sleep -Seconds 3

# Iniciar Frontend
Start-Service -ServiceName "Frontend (Puerto 5173)" -WorkingDirectory $frontendPath -Command "npm run dev" -Color "Magenta"

Write-Host ""
Write-Host "🎉 ¡Servicios iniciados exitosamente!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "📊 Backend:  http://localhost:3000" -ForegroundColor Blue
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "🔧 Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "   Email:    admin@mep.com" -ForegroundColor White
Write-Host "   Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "⏹️  Para detener los servicios, cierra las ventanas de PowerShell" -ForegroundColor Gray
Write-Host "===============================================" -ForegroundColor Cyan

# Abrir la aplicación en el navegador después de unos segundos
Write-Host "🌐 Abriendo aplicación en el navegador en 5 segundos..." -ForegroundColor Green
Start-Sleep -Seconds 5

try {
    Start-Process "http://localhost:5173"
    Write-Host "✅ Navegador abierto con la aplicación" -ForegroundColor Green
} catch {
    Write-Host "⚠️  No se pudo abrir el navegador automáticamente" -ForegroundColor Yellow
    Write-Host "   Abre manualmente: http://localhost:5173" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ ¡MEP-Projects está listo para usar!" -ForegroundColor Green
Read-Host "Presiona Enter para salir"

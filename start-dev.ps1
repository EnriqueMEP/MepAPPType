# Script para iniciar el entorno de desarrollo
# Ejecutar con: PowerShell -ExecutionPolicy Bypass -File start-dev.ps1

Write-Host "🚀 Iniciando MEP-Projects en modo desarrollo..." -ForegroundColor Green

# Función para ejecutar en paralelo
function Start-ParallelJobs {
    param(
        [string]$BackendPath,
        [string]$FrontendPath
    )
    
    # Iniciar backend
    $backendJob = Start-Job -ScriptBlock {
        param($path)
        Set-Location $path
        npm run dev
    } -ArgumentList $BackendPath
    
    Write-Host "✅ Backend iniciado (Puerto 5000)" -ForegroundColor Green
    
    # Esperar un momento para que el backend se inicie
    Start-Sleep -Seconds 3
    
    # Iniciar frontend
    $frontendJob = Start-Job -ScriptBlock {
        param($path)
        Set-Location $path
        npm run dev
    } -ArgumentList $FrontendPath
    
    Write-Host "✅ Frontend iniciado (Puerto 3000)" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🌐 URLs disponibles:" -ForegroundColor Cyan
    Write-Host "- Frontend: http://localhost:3000" -ForegroundColor White
    Write-Host "- Backend API: http://localhost:5000/api" -ForegroundColor White
    Write-Host "- Swagger Docs: http://localhost:5000/api/docs" -ForegroundColor White
    Write-Host ""
    Write-Host "Para detener los servicios, presione Ctrl+C" -ForegroundColor Yellow
    
    # Esperar a que se detengan los jobs
    try {
        Wait-Job $backendJob, $frontendJob
    } finally {
        # Limpiar jobs
        Remove-Job $backendJob, $frontendJob -Force
    }
}

# Verificar si existe Docker y preguntar por preferencia
$dockerAvailable = $false
try {
    docker --version | Out-Null
    $dockerAvailable = $true
} catch {
    # Docker no disponible
}

if ($dockerAvailable) {
    $useDocker = Read-Host "¿Usar Docker para el desarrollo? (y/N)"
    if ($useDocker -eq "y" -or $useDocker -eq "Y") {
        Write-Host "🐳 Iniciando con Docker..." -ForegroundColor Blue
        docker-compose -f docker-compose.dev.yml up
        return
    }
}

# Configuración local
Write-Host "💻 Iniciando en modo local..." -ForegroundColor Blue

# Verificar si las dependencias están instaladas
$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = Join-Path $PSScriptRoot "frontend"

if (-not (Test-Path (Join-Path $backendPath "node_modules"))) {
    Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location $backendPath
    npm install
}

if (-not (Test-Path (Join-Path $frontendPath "node_modules"))) {
    Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location $frontendPath
    npm install
}

# Regresar al directorio raíz
Set-Location $PSScriptRoot

# Iniciar servicios en paralelo
Start-ParallelJobs -BackendPath $backendPath -FrontendPath $frontendPath

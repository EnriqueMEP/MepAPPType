# Script para instalar PostgreSQL automáticamente
Write-Host "🐘 Instalando PostgreSQL para MEP-Projects..." -ForegroundColor Green

# Verificar si ya está instalado
$postgresService = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($postgresService) {
    Write-Host "✅ PostgreSQL ya está instalado" -ForegroundColor Green
    $postgresService | Format-Table Name, Status
} else {
    Write-Host "📦 PostgreSQL no encontrado. Instalando..." -ForegroundColor Yellow
    
    # Verificar si Chocolatey está instalado
    if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "📦 Instalando Chocolatey..." -ForegroundColor Yellow
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    }
    
    # Instalar PostgreSQL
    Write-Host "🐘 Instalando PostgreSQL..." -ForegroundColor Cyan
    choco install postgresql15 --params '/Password:admin123' -y
    
    # Esperar a que se complete la instalación
    Start-Sleep -Seconds 10
    
    Write-Host "✅ PostgreSQL instalado" -ForegroundColor Green
}

# Verificar instalación
Write-Host "🔍 Verificando instalación..." -ForegroundColor Yellow

try {
    $postgresVersion = & "C:\Program Files\PostgreSQL\15\bin\psql.exe" --version
    Write-Host "✅ $postgresVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️ No se pudo verificar la versión. Puede que necesites reiniciar PowerShell" -ForegroundColor Yellow
}

# Verificar servicio
$service = Get-Service -Name "postgresql*" -ErrorAction SilentlyContinue
if ($service) {
    Write-Host "✅ Servicio PostgreSQL:" -ForegroundColor Green
    $service | Format-Table Name, Status, StartType
    
    if ($service.Status -ne "Running") {
        Write-Host "🔄 Iniciando servicio PostgreSQL..." -ForegroundColor Yellow
        Start-Service $service.Name
    }
} else {
    Write-Host "❌ Servicio PostgreSQL no encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "📋 Información de conexión:" -ForegroundColor Cyan
Write-Host "   Host: localhost" -ForegroundColor White
Write-Host "   Puerto: 5432" -ForegroundColor White
Write-Host "   Usuario: postgres" -ForegroundColor White
Write-Host "   Contraseña: admin123" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Siguiente paso: Ejecutar 'setup-database.ps1'" -ForegroundColor Green

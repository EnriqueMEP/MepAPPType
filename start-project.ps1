# Script de inicio para MEP-Projects
# Ejecuta este script para iniciar tanto el backend como el frontend

Write-Host "🚀 Iniciando MEP-Projects..." -ForegroundColor Green
Write-Host ""

# Verificar que Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no encontrado. Por favor instala Node.js primero." -ForegroundColor Red
    exit 1
}

# Compilar backend
Write-Host ""
Write-Host "📦 Compilando backend..." -ForegroundColor Yellow
Set-Location "backend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error compilando backend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Backend compilado exitosamente" -ForegroundColor Green

# Regresar al directorio raíz
Set-Location ".."

# Compilar frontend
Write-Host ""
Write-Host "📦 Compilando frontend..." -ForegroundColor Yellow
Set-Location "frontend"
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error compilando frontend" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend compilado exitosamente" -ForegroundColor Green

# Instrucciones para ejecutar
Write-Host ""
Write-Host "🎉 ¡Compilación completada!" -ForegroundColor Green
Write-Host ""
Write-Host "Para iniciar los servidores:" -ForegroundColor Cyan
Write-Host "1. Backend: cd backend && npm start" -ForegroundColor White
Write-Host "2. Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "O usar Docker Compose:" -ForegroundColor Cyan
Write-Host "docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "URLs del proyecto:" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "- Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "- API Docs: http://localhost:3000/api-docs" -ForegroundColor White

Set-Location ".."

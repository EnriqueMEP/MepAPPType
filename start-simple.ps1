# Script para iniciar MEP-Projects
Write-Host "Iniciando MEP-Projects..." -ForegroundColor Green

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Compilar backend
Write-Host "Compilando backend..." -ForegroundColor Yellow
Set-Location backend
npm run build
Set-Location ..

# Iniciar backend
Write-Host "Iniciando backend (puerto 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"

# Esperar
Start-Sleep -Seconds 3

# Iniciar frontend
Write-Host "Iniciando frontend (puerto 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"

# Mostrar información
Start-Sleep -Seconds 5
Write-Host ""
Write-Host "MEP-Projects iniciado!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Credenciales de prueba:" -ForegroundColor White
Write-Host "Email:    admin@mep.com" -ForegroundColor Yellow
Write-Host "Password: admin123" -ForegroundColor Yellow

# Abrir navegador
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

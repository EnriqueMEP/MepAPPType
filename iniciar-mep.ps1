# ==============================================================================
# 🚀 MEP-Projects - Iniciador Rápido
# ==============================================================================
# Ejecuta este archivo para iniciar backend y frontend automáticamente

Write-Host ""
Write-Host "🚀 MEP-Projects - Iniciador Rápido" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan

# Verificar Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Iniciando servicios..." -ForegroundColor Yellow

# 1. Iniciar Backend en nueva ventana
Write-Host "🔧 Iniciando Backend (puerto 3000)..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🔧 BACKEND - MEP-Projects' -ForegroundColor Blue; Write-Host 'Puerto: 3000' -ForegroundColor White; npm start" -WindowStyle Normal

# Esperar para que el backend se inicie
Start-Sleep -Seconds 4

# 2. Iniciar Frontend en nueva ventana
Write-Host "🌐 Iniciando Frontend (puerto 5173)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; Write-Host '🌐 FRONTEND - MEP-Projects' -ForegroundColor Magenta; Write-Host 'Puerto: 5173' -ForegroundColor White; npm run dev" -WindowStyle Normal

Write-Host ""
Write-Host "⏳ Esperando que los servicios se inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

# 3. Abrir navegador
Write-Host "🌐 Abriendo aplicación en el navegador..." -ForegroundColor Green
try {
    Start-Process "http://localhost:5173"
    Write-Host "✅ Navegador abierto" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Abre manualmente: http://localhost:5173" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ¡MEP-Projects iniciado exitosamente!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "📊 Backend:  http://localhost:3000/api/v1" -ForegroundColor Blue
Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Magenta
Write-Host ""
Write-Host "🔐 Credenciales de prueba:" -ForegroundColor Yellow
Write-Host "   📧 Email:    admin@mep.com" -ForegroundColor White
Write-Host "   🔑 Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "⏹️ Para detener: cierra las ventanas de PowerShell del backend y frontend" -ForegroundColor Gray
Write-Host "=====================================" -ForegroundColor Cyan

Read-Host "Presiona Enter para salir de este iniciador"

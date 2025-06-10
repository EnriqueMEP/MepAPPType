@echo off
title MEP-Projects - Iniciador
color 0A

echo.
echo ===============================================
echo      🚀 MEP-Projects - Iniciador Rapido
echo ===============================================
echo.

echo ✅ Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no esta instalado
    echo Instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js encontrado
echo.

echo 📦 Iniciando servicios...
echo.

echo 🔧 Iniciando Backend (puerto 3000)...
start "MEP Backend" cmd /k "cd /d %~dp0backend && echo 🔧 BACKEND - MEP-Projects && echo Puerto: 3000 && npm start"

echo ⏳ Esperando 4 segundos...
timeout /t 4 /nobreak >nul

echo 🌐 Iniciando Frontend (puerto 5173)...
start "MEP Frontend" cmd /k "cd /d %~dp0frontend && echo 🌐 FRONTEND - MEP-Projects && echo Puerto: 5173 && npm run dev"

echo ⏳ Esperando 6 segundos para abrir navegador...
timeout /t 6 /nobreak >nul

echo 🌐 Abriendo aplicacion en el navegador...
start http://localhost:5173

echo.
echo ===============================================
echo   🎉 MEP-Projects iniciado exitosamente!
echo ===============================================
echo 📊 Backend:  http://localhost:3000/api/v1
echo 🌐 Frontend: http://localhost:5173
echo.
echo 🔐 Credenciales de prueba:
echo    📧 Email:    admin@mep.com
echo    🔑 Password: admin123
echo.
echo ⏹️ Para detener: cierra las ventanas del backend y frontend
echo ===============================================

pause

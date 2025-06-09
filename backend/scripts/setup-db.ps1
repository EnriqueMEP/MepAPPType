# scripts/setup-db.ps1
# Script para configurar la base de datos en desarrollo

param(
    [string]$Action = "setup"
)

$ErrorActionPreference = "Stop"

Write-Host "🔧 MEP-Projects - Configuración de Base de Datos" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

switch ($Action) {
    "setup" {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
        npm install

        Write-Host "🗄️ Ejecutando migraciones..." -ForegroundColor Yellow
        npm run migrate

        Write-Host "🌱 Insertando datos de prueba..." -ForegroundColor Yellow
        npm run seed

        Write-Host "✅ Base de datos configurada exitosamente!" -ForegroundColor Green
    }
    "migrate" {
        Write-Host "🗄️ Ejecutando migraciones..." -ForegroundColor Yellow
        npm run migrate
    }
    "seed" {
        Write-Host "🌱 Insertando datos de prueba..." -ForegroundColor Yellow
        npm run seed
    }
    "reset" {
        Write-Host "🔄 Reseteando base de datos..." -ForegroundColor Yellow
        npm run migrate:rollback
        npm run migrate
        npm run seed
        Write-Host "✅ Base de datos reseteada!" -ForegroundColor Green
    }
    "clean" {
        Write-Host "🧹 Limpiando base de datos..." -ForegroundColor Yellow
        npm run migrate:rollback
        Write-Host "✅ Base de datos limpia!" -ForegroundColor Green
    }
    default {
        Write-Host "❌ Acción no válida. Usa: setup, migrate, seed, reset, clean" -ForegroundColor Red
        exit 1
    }
}

Write-Host "=============================================" -ForegroundColor Cyan

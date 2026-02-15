@echo off
REM =============================================================================
REM AGROFARM - Script de Inicio Rápido
REM =============================================================================
REM Este script inicia el backend y frontend automáticamente
REM Asegúrate de tener los archivos .env configurados antes de ejecutar
REM =============================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║          🐷 AGROFARM - INICIO RÁPIDO                        ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar que Node.js esté instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: Node.js no está instalado
    echo.
    echo Por favor instala Node.js desde: https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detectado: 
node --version
echo.

REM Verificar que npm esté instalado
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERROR: npm no está instalado
    pause
    exit /b 1
)

echo ✅ npm detectado:
npm --version
echo.

REM Verificar que existan las carpetas
if not exist "backend-api" (
    echo ❌ ERROR: La carpeta backend-api no existe
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ ERROR: La carpeta frontend no existe
    pause
    exit /b 1
)

echo ════════════════════════════════════════════════════════════════
echo  📦 VERIFICANDO DEPENDENCIAS
echo ════════════════════════════════════════════════════════════════
echo.

REM Verificar node_modules del backend
if not exist "backend-api\node_modules" (
    echo ⚠️  Backend node_modules no encontrado
    echo 📦 Instalando dependencias del backend...
    cd backend-api
    call npm install
    cd ..
    echo ✅ Dependencias del backend instaladas
    echo.
) else (
    echo ✅ Backend node_modules ya existe
    echo.
)

REM Verificar node_modules del frontend
if not exist "frontend\node_modules" (
    echo ⚠️  Frontend node_modules no encontrado
    echo 📦 Instalando dependencias del frontend...
    cd frontend
    call npm install
    cd ..
    echo ✅ Dependencias del frontend instaladas
    echo.
) else (
    echo ✅ Frontend node_modules ya existe
    echo.
)

REM Verificar archivos .env
echo ════════════════════════════════════════════════════════════════
echo  🔧 VERIFICANDO CONFIGURACIÓN
echo ════════════════════════════════════════════════════════════════
echo.

if not exist "backend-api\.env" (
    echo ⚠️  WARNING: backend-api\.env no existe
    echo.
    echo Por favor crea el archivo backend-api\.env con:
    echo   DATABASE_HOST=tu-proyecto.supabase.co
    echo   DATABASE_NAME=postgres
    echo   DATABASE_USER=postgres
    echo   DATABASE_PASSWORD=tu-password
    echo   DATABASE_PORT=6543
    echo   JWT_SECRET=tu-secreto-muy-largo
    echo   PORT=3000
    echo.
    echo Puedes copiar backend-api\.env.example como base
    echo.
    pause
    exit /b 1
) else (
    echo ✅ backend-api\.env encontrado
    echo.
)

if not exist "frontend\.env" (
    echo ⚠️  WARNING: frontend\.env no existe
    echo.
    echo Por favor crea el archivo frontend\.env con:
    echo   REACT_APP_API_URL=http://localhost:3000/api
    echo.
    echo Puedes copiar frontend\.env.example como base
    echo.
    pause
    exit /b 1
) else (
    echo ✅ frontend\.env encontrado
    echo.
)

echo ════════════════════════════════════════════════════════════════
echo  🚀 INICIANDO SERVIDORES
echo ════════════════════════════════════════════════════════════════
echo.
echo Se abrirán 2 ventanas de terminal:
echo   1. Backend en http://localhost:3000
echo   2. Frontend en http://localhost:3001
echo.
echo ⚠️  NO CIERRES ESTAS VENTANAS mientras uses la aplicación
echo.
pause

REM Iniciar backend en nueva ventana
echo 📡 Iniciando Backend...
start "AGROFARM Backend" cmd /k "cd backend-api && npm run dev"

REM Esperar 3 segundos antes de iniciar el frontend
timeout /t 3 /nobreak >nul

REM Iniciar frontend en nueva ventana
echo 🌐 Iniciando Frontend...
start "AGROFARM Frontend" cmd /k "cd frontend && npm start"

echo.
echo ════════════════════════════════════════════════════════════════
echo  ✅ SERVIDORES INICIADOS
echo ════════════════════════════════════════════════════════════════
echo.
echo 📡 Backend:  http://localhost:3000/api
echo 🌐 Frontend: http://localhost:3001
echo.
echo 🔑 Usuario de prueba:
echo    Username: admin
echo    Password: admin123
echo.
echo ⚠️  Para detener los servidores:
echo    Presiona Ctrl+C en cada ventana de terminal
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo Presiona cualquier tecla para cerrar esta ventana...
pause >nul

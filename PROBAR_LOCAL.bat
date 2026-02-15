@echo off
echo ========================================
echo   INICIANDO AGROFARM LOCALMENTE
echo ========================================
echo.
cd frontend
echo Limpiando cache...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
echo.
echo Iniciando servidor de desarrollo...
echo.
echo Abre tu navegador en: http://localhost:3000
echo.
echo IMPORTANTE: Usa el DROPDOWN de sexo (no escribas)
echo.
npm start

# 🐷 AGROFARM - Sistema de Gestión Porcina

**Sistema integral de gestión y trazabilidad para producción porcina**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-orange)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 📋 Descripción

AGROFARM es un sistema web completo para la gestión profesional de granjas porcinas, desarrollado como proyecto de grado. Permite el control integral de inventarios, seguimiento sanitario, gestión nutricional, trazabilidad reproductiva y análisis de producción.

### 🎯 Características Principales

- **Gestión de Inventario**: Control completo de animales con códigos de arete, razas y estados
- **Módulo Sanitario**: Registro de vacunas, tratamientos y diagnósticos veterinarios
- **Nutrición y Alimentación**: Control de consumos, inventario de alimentos y costos
- **Producción y Pesajes**: Seguimiento de pesos, ganancias diarias promedio (GDP) y conversión alimenticia
- **Reproducción**: Gestión de montas, gestaciones, partos y lechones
- **Perfiles de Usuario**: Sistema de roles (Admin, Veterinario, Usuario)
- **Dashboard Analítico**: Estadísticas y métricas clave en tiempo real
- **API RESTful**: Backend escalable con arquitectura modular

## 🏗️ Arquitectura del Sistema

```
AGROFARM-SISTEMA/
├── backend-api/          # API REST - Node.js/Express
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # Definición de endpoints
│   │   ├── middlewares/  # Autenticación y validaciones
│   │   ├── config/       # Configuración de base de datos
│   │   └── utils/        # Utilidades (JWT, validadores)
│   └── database/         # Scripts SQL y datos
├── frontend/             # Aplicación web - React
│   ├── src/
│   │   ├── pages/        # Páginas principales
│   │   ├── components/   # Componentes reutilizables
│   │   ├── services/     # Cliente API
│   │   └── routes/       # Rutas protegidas
│   └── public/           # Assets estáticos
└── docs/                 # Documentación técnica
```

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js 20+** - Entorno de ejecución JavaScript
- **Express.js** - Framework web minimalista
- **Supabase (PostgreSQL)** - Base de datos relacional en la nube
- **JWT** - Autenticación mediante tokens
- **bcryptjs** - Hash seguro de contraseñas

### Frontend
- **React 19.2.1** - Biblioteca UI con Hooks
- **Tailwind CSS** - Framework CSS utility-first
- **Axios** - Cliente HTTP para consumo de API
- **React Router** - Navegación SPA

### DevOps & Deployment
- **Render** - Hosting backend (https://api-agrofarm.onrender.com)
- **Vercel** - Hosting frontend
- **Git/GitHub** - Control de versiones
- **npm** - Gestión de paquetes

## 📦 Instalación y Configuración

### Requisitos Previos
- Node.js 20 o superior
- npm 9 o superior
- Cuenta en Supabase (base de datos)
- Git

### 1. Clonar Repositorio
```bash
git clone https://github.com/JULIANRAMOS11/AGROFARM-SISTEMA.git
cd AGROFARM-SISTEMA
```

### 2. Configurar Backend
```bash
cd backend-api
npm install

# Crear archivo .env (copiar de .env.example)
cp .env.example .env

# Editar .env con tus credenciales de Supabase
# DATABASE_HOST=...
# DATABASE_PASSWORD=...
# JWT_SECRET=...
```

### 3. Configurar Base de Datos
```bash
# Ejecutar scripts SQL en Supabase SQL Editor (en orden):
# 1. database/00_cleanup.sql
# 2. database/01_types_enums.sql
# 3. database/02_constraints.sql
# 4. database/03_functions_triggers.sql
# 5. database/04_optimizacion_indices.sql
# 6. database/DATOS_PROFESIONALES_COMPLETOS.sql (datos de prueba)
```

### 4. Configurar Frontend
```bash
cd ../frontend
npm install

# Crear archivo .env
echo "REACT_APP_API_URL=http://localhost:3000/api" > .env
```

### 5. Ejecutar en Desarrollo
```bash
# Terminal 1 - Backend (puerto 3000)
cd backend-api
npm run dev

# Terminal 2 - Frontend (puerto 3001)
cd frontend
npm start
```

## 🌐 Despliegue en Producción

El sistema está desplegado en:
- **Backend API**: https://api-agrofarm.onrender.com/api
- **Frontend Web**: https://agrofarm-sistema.vercel.app (configurar según tu deployment)

Ver [docs/deployment.md](docs/deployment.md) para instrucciones detalladas.

## 📚 Documentación Adicional

- **[backend-api/README.md](backend-api/README.md)** - Documentación de la API
- **[backend-api/KEEP_ALIVE.md](backend-api/KEEP_ALIVE.md)** - Configuración Render
- **[backend-api/database/README_CARGAR_DATOS.md](backend-api/database/README_CARGAR_DATOS.md)** - Cómo cargar datos de prueba
- **[docs/deployment.md](docs/deployment.md)** - Guía de despliegue completa

## 🔑 Usuarios de Prueba

Después de cargar `DATOS_PROFESIONALES_COMPLETOS.sql`:

| Usuario | Password | Rol | Descripción |
|---------|----------|-----|-------------|
| `admin` | `admin123` | ADMIN | Acceso completo al sistema |
| `veterinario` | `vet123` | VETERINARIO | Acceso a módulos sanitarios |
| `operario` | `op123` | USER | Acceso básico |

## 📊 Módulos del Sistema

### 1. Dashboard
- Resumen general de la granja
- Indicadores clave de rendimiento (KPIs)
- Estadísticas de inventario por etapa

### 2. Gestión de Cerdos
- CRUD completo de animales
- Filtrado por estado, sexo, etapa
- Historial individual

### 3. Sanidad
- Registro de vacunaciones
- Control de tratamientos
- Diagnósticos veterinarios
- Protocolos sanitarios

### 4. Nutrición
- Inventario de alimentos
- Registro de consumos diarios
- Cálculo de costos alimenticios

### 5. Producción
- Registro de pesos
- Seguimiento de GDP (Ganancia Diaria Promedio)
- Análisis de conversión alimenticia

### 6. Reproducción
- Gestión de montas (natural/IA)
- Control de gestaciones
- Registro de partos
- Seguimiento de camadas

### 7. Perfil de Usuario
- Actualización de datos personales
- Cambio de contraseña
- Configuración de avatar

## 🛠️ Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con nodemon (auto-reload)
npm start        # Producción
```

### Frontend
```bash
npm start        # Desarrollo (puerto 3001)
npm run build    # Build para producción
npm test         # Ejecutar tests
```

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (salt rounds: 10)
- Autenticación JWT con expiración de 7 días
- Rutas protegidas con middleware de autorización
- Validación de datos en backend
- Variables de entorno para credenciales sensibles

## 🤝 Contribución

Este es un proyecto académico de graduación. Para contribuciones o sugerencias:

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 👨‍💻 Autor

**Julián Ramos Guarín**
- GitHub: [@JULIANRAMOS11](https://github.com/JULIANRAMOS11)
- Proyecto de Grado - Ingeniería de Sistemas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Supabase por la infraestructura de base de datos
- Render por el hosting del backend
- Comunidad de React y Node.js por las herramientas

---

**Versión**: 2.0.0  
**Última actualización**: Febrero 2026  
**Estado**: Producción ✅


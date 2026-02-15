# 📁 GUÍA DE ESTRUCTURA DEL PROYECTO

**AGROFARM - Sistema Optimizado para Graduación**

## 🎯 Estructura Limpia y Profesional

```
AGROFARM-SISTEMA/
│
├── 📂 backend-api/                    # Backend Node.js/Express
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── db.js                  # Conexión a Supabase PostgreSQL
│   │   ├── 📂 controllers/            # Lógica de negocio
│   │   │   ├── auth.controller.js     # Registro y login
│   │   │   ├── nutricion.controller.js
│   │   │   ├── perfil.controller.js
│   │   │   ├── pigs.controller.js     # CRUD de cerdos
│   │   │   ├── produccion.controller.js
│   │   │   ├── reproduccion.controller.js
│   │   │   └── sanidad.controller.js
│   │   ├── 📂 middlewares/            # Filtros de peticiones
│   │   │   ├── auth.middleware.js     # Verificación JWT
│   │   │   ├── errorHandler.middleware.js
│   │   │   └── validators.middleware.js
│   │   ├── 📂 routes/                 # Definición de endpoints
│   │   │   ├── auth.routes.js         # POST /api/auth/login
│   │   │   ├── nutricion.routes.js    # GET/POST /api/nutricion/*
│   │   │   ├── perfil.routes.js
│   │   │   ├── pigs.routes.js         # GET/POST/PUT /api/pigs/*
│   │   │   ├── produccion.routes.js
│   │   │   ├── reproduccion.routes.js
│   │   │   └── sanidad.routes.js
│   │   ├── 📂 utils/                  # Funciones auxiliares
│   │   │   ├── dateHelpers.js         # Formateo de fechas
│   │   │   ├── jwt.js                 # Generación de tokens
│   │   │   ├── responseHelpers.js
│   │   │   └── validators.js          # Validaciones custom
│   │   └── index.js                   # Punto de entrada del servidor
│   │
│   ├── 📂 database/                   # Scripts SQL
│   │   ├── 00_cleanup.sql             # Limpieza de tablas
│   │   ├── 01_types_enums.sql         # Tipos y enums
│   │   ├── 02_constraints.sql         # Constraints y foreign keys
│   │   ├── 03_functions_triggers.sql  # Funciones PL/pgSQL
│   │   ├── 04_optimizacion_indices.sql
│   │   ├── 05_datos_prueba.sql        # Datos básicos
│   │   ├── 06_agregar_campos_pigs.sql
│   │   ├── 99_testing.sql             # Consultas de testing
│   │   ├── CONSULTAS_UTILES.sql       # Queries útiles
│   │   ├── DATOS_PROFESIONALES_COMPLETOS.sql  # 150+ registros reales
│   │   ├── EJECUTAR_ACTUALIZACION.sql
│   │   ├── INSTRUCCIONES_RAPIDAS.txt  # Guía rápida SQL
│   │   ├── README_CARGAR_DATOS.md     # Cómo cargar datos
│   │   └── RESUMEN_DATOS_PROFESIONALES.md
│   │
│   ├── .env.example                   # Template de variables de entorno
│   ├── .gitignore
│   ├── package.json                   # Dependencias backend
│   ├── KEEP_ALIVE.md                  # Configuración Render
│   └── README.md                      # Documentación API
│
├── 📂 frontend/                       # Frontend React
│   ├── 📂 src/
│   │   ├── 📂 components/             # Componentes reutilizables
│   │   │   ├── Header.jsx             # Barra superior con usuario
│   │   │   ├── PigForm.jsx            # Formulario crear/editar cerdo
│   │   │   ├── PigList.jsx            # Tabla de cerdos
│   │   │   └── Sidebar.jsx            # Menú lateral navegación
│   │   ├── 📂 pages/                  # Páginas principales
│   │   │   ├── Dashboard.jsx          # /dashboard
│   │   │   ├── Login.jsx              # /login
│   │   │   ├── Nutricion.jsx          # /nutricion
│   │   │   ├── Perfil.jsx             # /perfil
│   │   │   ├── Produccion.jsx         # /produccion
│   │   │   ├── Register.jsx           # /register
│   │   │   ├── Reproduccion.jsx       # /reproduccion
│   │   │   └── Sanidad.jsx            # /sanidad
│   │   ├── 📂 routes/
│   │   │   └── PrivateRoute.jsx       # HOC para rutas protegidas
│   │   ├── 📂 services/
│   │   │   └── api.js                 # Cliente Axios configurado
│   │   ├── App.js                     # Componente raíz + rutas
│   │   ├── App.css
│   │   ├── index.js                   # Punto de entrada React
│   │   └── index.css                  # Estilos globales
│   │
│   ├── 📂 public/
│   │   ├── index.html                 # HTML base
│   │   ├── manifest.json
│   │   └── robots.txt
│   │
│   ├── .env.example                   # Template variables entorno
│   ├── .gitignore
│   ├── package.json                   # Dependencias frontend
│   ├── tailwind.config.js             # Configuración Tailwind CSS
│   ├── vercel.json                    # Configuración Vercel
│   └── README.md                      # Documentación frontend
│
├── 📂 docs/                           # Documentación técnica
│   ├── deployment.md                  # Guía de despliegue
│   └── 📂 postman/
│       ├── Agrofarm.postman_collection.json  # Colección API
│       └── Agrofarm.postman_environment.json
│
├── README.md                          # 📘 Documentación principal
├── PROBAR_LOCAL.bat                   # Script Windows inicio rápido
└── .gitignore                         # Archivos ignorados por Git
```

## 🎨 Convenciones de Código

### Backend (Node.js)
- **Nombres de archivos**: `nombre.tipo.js` (ej: `auth.controller.js`)
- **Funciones**: `camelCase` (ej: `getAllPigs`, `createPig`)
- **Rutas**: `/api/recurso` (ej: `/api/pigs`, `/api/auth/login`)
- **Variables de entorno**: `UPPERCASE_SNAKE_CASE` (ej: `DATABASE_HOST`)

### Frontend (React)
- **Componentes**: `PascalCase.jsx` (ej: `Header.jsx`, `PigForm.jsx`)
- **Páginas**: `PascalCase.jsx` (ej: `Dashboard.jsx`)
- **Funciones**: `camelCase` (ej: `handleSubmit`, `fetchPigs`)
- **CSS**: Tailwind utility classes preferidas sobre CSS personalizado

## 🔑 Archivos Clave para Entender

### Para Entender el Backend:
1. **`backend-api/src/index.js`** - Inicio del servidor, middlewares globales
2. **`backend-api/src/routes/*.routes.js`** - Ver todos los endpoints disponibles
3. **`backend-api/src/controllers/*.controller.js`** - Lógica de cada módulo
4. **`backend-api/src/config/db.js`** - Conexión a base de datos

### Para Entender el Frontend:
1. **`frontend/src/App.js`** - Rutas de la aplicación
2. **`frontend/src/pages/*.jsx`** - Páginas principales (una por módulo)
3. **`frontend/src/services/api.js`** - Cliente API (todas las peticiones)
4. **`frontend/src/components/*.jsx`** - Componentes reutilizables

### Para Entender la Base de Datos:
1. **`backend-api/database/01_types_enums.sql`** - Estructura de tablas
2. **`backend-api/database/DATOS_PROFESIONALES_COMPLETOS.sql`** - Datos de ejemplo

## 📊 Flujo de Datos

```
Usuario Frontend (React)
    ↓ (Axios HTTP Request)
    ↓
API Backend (Express.js)
    ↓ (auth.middleware verifica JWT)
    ↓
Controller (lógica de negocio)
    ↓ (query() ejecuta SQL)
    ↓
Base de Datos (Supabase PostgreSQL)
    ↓ (devuelve rows)
    ↓
Controller (formatea respuesta)
    ↓ (res.json())
    ↓
Frontend (actualiza estado React)
    ↓
Usuario ve resultado
```

## 🚀 Para Empezar a Desarrollar

### 1. Instalar Dependencias
```bash
cd backend-api && npm install
cd ../frontend && npm install
```

### 2. Configurar Variables de Entorno
```bash
# backend-api/.env
DATABASE_HOST=tu-proyecto.supabase.co
DATABASE_PASSWORD=tu-password
JWT_SECRET=tu-secreto-random

# frontend/.env
REACT_APP_API_URL=http://localhost:3000/api
```

### 3. Cargar Base de Datos
- Ejecutar scripts de `backend-api/database/` en orden numérico en Supabase

### 4. Ejecutar Proyecto
```bash
# Terminal 1 - Backend
cd backend-api && npm run dev

# Terminal 2 - Frontend
cd frontend && npm start
```

## 📝 Notas Importantes

### ✅ Archivos Eliminados (Ya No Existen)
- ❌ `legacy/` - Código HTML antiguo
- ❌ `android-code/` - Pruebas Android
- ❌ `backend-api/src/data/*.json` - Datos mock
- ❌ `node_modules/` - Se regeneran con `npm install`
- ❌ `frontend/build/` - Se regenera con `npm run build`
- ❌ Archivos MD duplicados (8 eliminados)

### ⚠️ NO Subir a Git
- `.env` (credenciales sensibles)
- `node_modules/` (muy pesado, se regenera)
- `build/` (se genera en deploy)
- `.DS_Store` / `Thumbs.db` (archivos de sistema)

### ✨ Ventajas de Esta Estructura
- **Modular**: Cada módulo (sanidad, nutrición, etc.) tiene su controller y routes
- **Escalable**: Fácil agregar nuevos módulos
- **Mantenible**: Código limpio sin comentarios excesivos
- **Profesional**: Estructura estándar de la industria
- **Documentado**: README claro en cada carpeta importante

---

**💡 Tip**: Lee los README.md de cada carpeta (backend-api/, frontend/, docs/) para entender cada subsistema en detalle.

**🎓 Para tu presentación de grado**: 
- Muestra la estructura modular
- Explica el flujo de datos (Frontend → API → BD)
- Destaca la seguridad (JWT, bcrypt, validaciones)
- Menciona las tecnologías modernas (React 19, Supabase)

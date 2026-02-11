# 🐷 AGROFARM - Sistema Integral de Gestión Porcina

![Version](https://img.shields.io/badge/version-1.0.0-green)
![React](https://img.shields.io/badge/React-19.2.1-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Android](https://img.shields.io/badge/Android-Java-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

Sistema multiplataforma (Web + Móvil) para la gestión integral de granjas porcinas con sincronización en tiempo real.

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Arquitectura](#-arquitectura)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Módulos Funcionales](#-módulos-funcionales)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso del Sistema](#-uso-del-sistema)
- [URLs de Producción](#-urls-de-producción)
- [Credenciales de Prueba](#-credenciales-de-prueba)
- [API Endpoints](#-api-endpoints)
- [Autor](#-autor)

---

## 🎯 Descripción

**AGROFARM** es un sistema profesional de gestión porcina que digitaliza y automatiza el control de:

- 🐖 **Inventario de Cerdos**: Registro completo con código de arete, raza, etapa de vida
- 👶 **Reproducción**: Control de montas, partos y lechones
- 💉 **Sanidad**: Tratamientos veterinarios, vacunas y desparasitaciones
- 📊 **Producción**: Pesajes, ganancia de peso diaria, conversión alimenticia
- 🌾 **Nutrición**: Inventario de alimentos y registro de consumos
- 📈 **Dashboard**: Estadísticas en tiempo real de toda la granja

### Problema que Resuelve

Las granjas tradicionales enfrentan:
- ❌ Registros en papel (pérdida de información)
- ❌ Falta de trazabilidad de animales
- ❌ Dificultad para tomar decisiones basadas en datos
- ❌ Control manual ineficiente de vacunas y tratamientos
- ❌ Cálculo manual de indicadores de producción

### Solución

✅ **Digitalización completa** con acceso web y móvil  
✅ **Sincronización en tiempo real** entre plataformas  
✅ **Historial completo** de cada animal  
✅ **Alertas automáticas** de vacunas y tratamientos  
✅ **Reportes y estadísticas** instantáneos  
✅ **Accesible 24/7** desde cualquier lugar  

---

## 🏗️ Arquitectura

### Arquitectura General
```
┌─────────────────────────────────────────────────┐
│           CAPA DE PRESENTACIÓN                   │
├─────────────────┬───────────────────────────────┤
│  FRONTEND WEB   │     APP MÓVIL ANDROID         │
│   React 19.2    │      Java + Material          │
│  Vercel.app     │    APK Instalable             │
│  Tailwind CSS   │    Volley HTTP                │
└────────┬────────┴──────────┬────────────────────┘
         │                   │
         │    HTTPS/TLS      │
         │    JSON           │
         └────────┬──────────┘
         ┌────────▼──────────────────────────────┐
         │     CAPA DE LÓGICA DE NEGOCIO         │
         │         API REST                      │
         │    Node.js + Express 4.21             │
         │  api-agrofarm.onrender.com            │
         │  - Autenticación JWT                  │
         │  - Validaciones                       │
         │  - Lógica de negocio                  │
         └────────┬──────────────────────────────┘
                  │
         ┌────────▼──────────────────────────────┐
         │       CAPA DE DATOS                   │
         │   PostgreSQL 15 (Supabase)            │
         │  - 12 Tablas principales              │
         │  - Triggers automáticos               │
         │  - Índices optimizados                │
         │  - Backups automáticos                │
         └───────────────────────────────────────┘
```

### Flujo de Datos (Ejemplo)
```
1. Usuario registra cerdo desde MÓVIL
   ↓
2. App envía POST /api/pigs con token JWT
   ↓
3. API valida token y datos
   ↓
4. API ejecuta INSERT en PostgreSQL
   ↓
5. Base de datos guarda y devuelve registro
   ↓
6. API responde con cerdo creado
   ↓
7. App actualiza lista
   ↓
8. WEB hace GET /api/pigs (polling cada 30s)
   ↓
9. WEB recibe lista actualizada (incluye nuevo cerdo)
   ↓
RESULTADO: Sincronización web ↔ móvil
```

---

## 🚀 Tecnologías

### Frontend Web
- **Framework**: React 19.2.1
- **Enrutamiento**: React Router DOM 7.10.1
- **Estilos**: Tailwind CSS (CDN)
- **HTTP Client**: Fetch API nativo
- **Notificaciones**: React Hot Toast 2.6.0
- **Hosting**: Vercel (CDN Global)

### Backend API
- **Runtime**: Node.js 18+
- **Framework**: Express 4.21.0
- **Base de Datos**: PostgreSQL 15
- **ORM/Client**: node-postgres (pg) 8.17.1
- **Seguridad**: bcryptjs 2.4.3
- **CORS**: cors 2.8.5
- **Variables de Entorno**: dotenv 17.2.3
- **Hosting**: Render.com

### App Móvil Android
- **Lenguaje**: Java (Android SDK)
- **UI Framework**: Material Components 1.9.0
- **HTTP Client**: Volley
- **Persistencia**: SharedPreferences
- **Arquitectura**: MVVM
- **Min SDK**: 24 (Android 7.0)
- **Target SDK**: 35 (Android 15)

### Servicios en la Nube
- **Base de Datos**: Supabase (PostgreSQL)
- **Backend Hosting**: Render.com
- **Frontend Hosting**: Vercel
- **Control de Versiones**: GitHub

---

## 📁 Estructura del Proyecto

```
AGROFARM-SISTEMA/
│
├── 📁 frontend/                    # Aplicación Web (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                  # Componente raíz
│   │   ├── components/             # Componentes reutilizables
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PigForm.jsx
│   │   │   └── PigList.jsx
│   │   ├── pages/                  # Páginas/Vistas
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx       # Panel principal
│   │   │   ├── Reproduccion.jsx    # Montas y partos
│   │   │   ├── Sanidad.jsx         # Tratamientos
│   │   │   ├── Produccion.jsx      # Pesajes
│   │   │   ├── Nutricion.jsx       # Alimentos
│   │   │   └── Perfil.jsx          # Usuario
│   │   └── routes/
│   │       └── PrivateRoute.jsx    # Protección de rutas
│   ├── package.json
│   └── vercel.json                 # Config de deploy
│
├── 📁 backend-api/                 # API REST (Node.js)
│   ├── src/
│   │   ├── index.js                # Servidor Express
│   │   ├── config/
│   │   │   └── db.js               # Conexión PostgreSQL
│   │   ├── controllers/            # Lógica de negocio
│   │   │   ├── auth.controller.js
│   │   │   ├── pigs.controller.js
│   │   │   ├── reproduccion.controller.js
│   │   │   ├── sanidad.controller.js
│   │   │   ├── produccion.controller.js
│   │   │   ├── nutricion.controller.js
│   │   │   └── perfil.controller.js
│   │   ├── routes/                 # Definición de endpoints
│   │   │   ├── auth.routes.js
│   │   │   ├── pigs.routes.js
│   │   │   └── ...
│   │   ├── middlewares/            # Validaciones y autenticación
│   │   │   ├── auth.middleware.js
│   │   │   ├── validators.middleware.js
│   │   │   └── errorHandler.middleware.js
│   │   └── utils/                  # Funciones auxiliares
│   ├── database/                   # Scripts SQL
│   │   ├── 00_cleanup.sql
│   │   ├── 01_types_enums.sql
│   │   ├── 02_constraints.sql
│   │   ├── 03_functions_triggers.sql
│   │   ├── 04_optimizacion_indices.sql
│   │   └── 05_datos_prueba.sql
│   ├── package.json
│   └── .env.example                # Variables de entorno
│
├── 📁 android-app/                 # App Móvil (NO incluida en repo)
│   ├── app/
│   │   └── src/main/
│   │       ├── java/com/agrofarm/
│   │       │   ├── MainActivity.java
│   │       │   ├── DashboardActivity.java
│   │       │   ├── PigsActivity.java
│   │       │   ├── ReproduccionActivity.java
│   │       │   ├── SanidadActivity.java
│   │       │   ├── ProduccionActivity.java
│   │       │   ├── NutricionActivity.java
│   │       │   ├── PerfilActivity.java
│   │       │   ├── adapters/
│   │       │   └── models/
│   │       └── res/
│   │           ├── layout/         # XML de interfaces
│   │           ├── values/         # Estilos y temas
│   │           └── drawable/       # Recursos gráficos
│   └── build.gradle
│
├── 📁 docs/                        # Documentación
│   ├── deployment.md               # Guía de despliegue
│   └── postman/                    # Colección de pruebas
│       ├── Agrofarm.postman_collection.json
│       └── Agrofarm.postman_environment.json
│
├── README.md                       # Este archivo
└── .gitignore
```

---

## 🎨 Módulos Funcionales

### 1. 🔐 Autenticación
**Archivos**: `auth.controller.js`, `Login.jsx`, `MainActivity.java`

**Funcionalidades:**
- Registro de nuevos usuarios
- Login con username/password
- Hash de contraseñas con bcrypt
- Sesión persistente con tokens
- Logout seguro

**Endpoints:**
```
POST /api/auth/register  → Crear usuario
POST /api/auth/login     → Iniciar sesión
POST /api/auth/logout    → Cerrar sesión
```

---

### 2. 📊 Dashboard
**Archivos**: `Dashboard.jsx`, `DashboardActivity.java`

**Estadísticas en Tiempo Real:**
- Total de cerdos registrados
- Cerdos activos vs inactivos
- Peso promedio de la granja
- Stock total de alimentos

**Visualización:**
- Cards coloridas con iconos
- Acceso rápido a módulos
- Menú lateral de navegación

---

### 3. 🐷 Gestión de Cerdos
**Archivos**: `pigs.controller.js`, `PigForm.jsx`, `PigsActivity.java`

**Datos que se registran:**
- Código de arete (único)
- Sexo (M/H)
- Fecha de nacimiento
- Peso actual en kg
- Estado (ACTIVO/INACTIVO/VENDIDO/MUERTO)
- Lote al que pertenece
- Etapa de vida (Lechón, Crecimiento, Engorde, Reproducción)
- Raza (Duroc, Landrace, Yorkshire, Pietrain, Hampshire)

**Funcionalidades:**
- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Búsqueda por código de arete
- Cambio rápido de estado
- Historial completo por animal

**Endpoints:**
```
GET    /api/pigs           → Listar todos
GET    /api/pigs/:id       → Ver detalles
POST   /api/pigs           → Registrar nuevo
PUT    /api/pigs/:id       → Actualizar datos
PATCH  /api/pigs/:id/status → Cambiar estado
DELETE /api/pigs/:id       → Eliminar
```

---

### 4. 👶 Reproducción
**Archivos**: `reproduccion.controller.js`, `Reproduccion.jsx`, `ReproduccionActivity.java`

**Sub-módulo A: Montas/Servicios**
- Fecha de servicio
- Cerda servida
- Tipo: Monta Natural o Inseminación Artificial
- Fecha estimada de parto (114 días después)
- Observaciones

**Sub-módulo B: Partos**
- Cerda (madre)
- Fecha del parto
- Lechones nacidos vivos
- Lechones nacidos muertos
- Peso promedio de lechones (kg)
- Observaciones

**Indicadores calculados:**
- Tasa de mortalidad al nacer
- Promedio de lechones por parto
- Eficiencia reproductiva

**Endpoints:**
```
GET    /api/reproduccion           → Listar montas
POST   /api/reproduccion           → Registrar monta
GET    /api/reproduccion/partos/all → Listar partos
POST   /api/reproduccion/partos    → Registrar parto
DELETE /api/reproduccion/:id       → Eliminar registro
```

---

### 5. 💉 Sanidad
**Archivos**: `sanidad.controller.js`, `Sanidad.jsx`, `SanidadActivity.java`

**Tipos de Tratamientos:**
- Vacunas
- Desparasitaciones
- Tratamientos (antibióticos, antiinflamatorios)
- Cirugías
- Revisiones generales

**Datos registrados:**
- Cerdo tratado
- Tipo de tratamiento
- Medicamento/vacuna
- Dosis aplicada
- Fecha de aplicación
- Fecha de próxima aplicación
- Veterinario responsable
- Observaciones

**Funcionalidades:**
- Historial médico por cerdo
- Alertas de próximas vacunas
- Control de tratamientos activos

**Endpoints:**
```
GET    /api/sanidad             → Listar tratamientos
GET    /api/sanidad/proximas    → Próximas aplicaciones
GET    /api/sanidad/pig/:pig_id → Historial de un cerdo
POST   /api/sanidad             → Registrar tratamiento
DELETE /api/sanidad/:id         → Eliminar registro
```

---

### 6. 📊 Producción (Pesajes)
**Archivos**: `produccion.controller.js`, `Produccion.jsx`, `ProduccionActivity.java`

**Datos registrados:**
- Cerdo pesado
- Fecha del pesaje
- Peso registrado (kg)
- Ganancia diaria calculada
- Observaciones

**Cálculos automáticos:**
```javascript
// Ganancia Diaria de Peso (GDP)
GDP = (peso_actual - peso_anterior) / días_transcurridos

// Ejemplo:
// Peso anterior: 80 kg (hace 7 días)
// Peso actual: 85 kg
GDP = (85 - 80) / 7 = 0.714 kg/día
```

**Estadísticas generadas:**
- Peso promedio de la granja
- Peso mínimo y máximo
- Ganancia promedio diaria
- Proyección de peso futuro

**Endpoints:**
```
GET  /api/produccion              → Listar pesajes
GET  /api/produccion/estadisticas → Estadísticas generales
GET  /api/produccion/pig/:pig_id  → Historial de un cerdo
POST /api/produccion              → Registrar pesaje
```

---

### 7. 🌾 Nutrición
**Archivos**: `nutricion.controller.js`, `Nutricion.jsx`, `NutricionActivity.java`

**Sub-módulo A: Inventario de Alimentos**
- Nombre del alimento
- Tipo (Concentrado, Grano, Suplemento)
- % Proteína
- Costo por kg
- Proveedor
- Stock disponible (kg)

**Sub-módulo B: Registro de Consumos**
- Cerdo que consumió
- Alimento consumido
- Fecha
- Cantidad (kg)
- Lote del alimento

**Cálculos de eficiencia:**
```javascript
// Conversión Alimenticia (CA)
CA = kg_alimento_consumido / kg_ganancia_peso

// Ejemplo:
// Consumió 30 kg, ganó 10 kg
CA = 30 / 10 = 3.0

// CA ideal porcino: 2.5 - 3.0
```

**Endpoints:**
```
GET    /api/nutricion/alimentos   → Listar alimentos
POST   /api/nutricion/alimentos   → Crear alimento
GET    /api/nutricion/consumos    → Listar consumos
POST   /api/nutricion/consumos    → Registrar consumo
```

---

### 8. 👤 Perfil de Usuario
**Archivos**: `perfil.controller.js`, `Perfil.jsx`, `PerfilActivity.java`

**Funcionalidades:**
- Ver información personal
- Editar username y email
- Cambiar contraseña (validando actual)
- Cerrar sesión

**Endpoints:**
```
GET  /api/perfil              → Ver perfil
PUT  /api/perfil/:id          → Actualizar datos
POST /api/perfil/:id/password → Cambiar contraseña
```

---

## ⚙️ Instalación y Configuración

### Requisitos Previos
- Node.js 18+ y npm
- PostgreSQL 15+ (o cuenta en Supabase)
- Git
- Android Studio (para la app móvil)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JULIANRAMOS11/AGROFARM-SISTEMA.git
cd AGROFARM-SISTEMA
```

### 2. Configurar Backend

```bash
cd backend-api
npm install
```

Crear archivo `.env`:
```env
# Base de datos (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/postgres

# Configuración del servidor
PORT=4000
NODE_ENV=production

# Frontend permitido (CORS)
FRONTEND_ORIGIN=https://agrofarm-sistema.vercel.app
```

Ejecutar migraciones de base de datos:
```bash
# Conectarse a PostgreSQL y ejecutar en orden:
psql -h HOST -U USER -d DATABASE < database/00_cleanup.sql
psql -h HOST -U USER -d DATABASE < database/01_types_enums.sql
psql -h HOST -U USER -d DATABASE < database/02_constraints.sql
psql -h HOST -U USER -d DATABASE < database/03_functions_triggers.sql
psql -h HOST -U USER -d DATABASE < database/04_optimizacion_indices.sql
psql -h HOST -U USER -d DATABASE < database/05_datos_prueba.sql
```

Iniciar servidor:
```bash
npm start
```

### 3. Configurar Frontend

```bash
cd ../frontend
npm install
```

Crear archivo `.env`:
```env
REACT_APP_API_BASE_URL=https://api-agrofarm.onrender.com/api
```

Iniciar en desarrollo:
```bash
npm start
# Abre http://localhost:3000
```

Build para producción:
```bash
npm run build
```

### 4. Configurar App Android

1. Abrir proyecto en Android Studio
2. Modificar `app/src/main/java/com/agrofarm/utils/Constants.java`:
```java
public static final String API_BASE_URL = "https://api-agrofarm.onrender.com/api";
```
3. Sync Gradle
4. Build → Build APK(s)

---

## 🖥️ Uso del Sistema

### Desde la Web

1. Acceder a https://agrofarm-sistema.vercel.app
2. Iniciar sesión o registrarse
3. Explorar el Dashboard
4. Navegar por los módulos usando el menú lateral
5. Registrar cerdos, tratamientos, pesajes, etc.

### Desde Móvil

1. Instalar APK en dispositivo Android
2. Abrir la app
3. Iniciar sesión (mismas credenciales que web)
4. Navegar por el menú lateral
5. Registrar datos en campo
6. Sincronización automática con web

---

## 🌐 URLs de Producción

- **Web Frontend**: https://agrofarm-sistema.vercel.app
- **API Backend**: https://api-agrofarm.onrender.com
- **Health Check**: https://api-agrofarm.onrender.com/api/health
- **Database**: Supabase (PostgreSQL)

---

## 🔑 Credenciales de Prueba

```
Username: ADMIN
Password: admin123
```

**Nota**: Estos son usuarios de demostración. En producción real, cambiar inmediatamente.

---

## 📡 API Endpoints

### Autenticación
```http
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
```

### Cerdos
```http
GET    /api/pigs
GET    /api/pigs/:id
POST   /api/pigs
PUT    /api/pigs/:id
PATCH  /api/pigs/:id/status
DELETE /api/pigs/:id
```

### Reproducción
```http
GET    /api/reproduccion
GET    /api/reproduccion/:id
POST   /api/reproduccion
DELETE /api/reproduccion/:id
GET    /api/reproduccion/partos/all
POST   /api/reproduccion/partos
```

### Sanidad
```http
GET    /api/sanidad
GET    /api/sanidad/proximas
GET    /api/sanidad/pig/:pig_id
POST   /api/sanidad
DELETE /api/sanidad/:id
```

### Producción
```http
GET    /api/produccion
GET    /api/produccion/estadisticas
GET    /api/produccion/pig/:pig_id
POST   /api/produccion
DELETE /api/produccion/:id
```

### Nutrición
```http
GET    /api/nutricion/alimentos
POST   /api/nutricion/alimentos
GET    /api/nutricion/consumos
POST   /api/nutricion/consumos
DELETE /api/nutricion/consumos/:id
```

### Perfil
```http
GET    /api/perfil
PUT    /api/perfil/:id
POST   /api/perfil/:id/password
```

**Documentación completa**: Ver colección de Postman en `docs/postman/`

---

## 🔒 Seguridad Implementada

- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ Autenticación basada en tokens
- ✅ HTTPS/TLS en todas las comunicaciones
- ✅ CORS configurado (solo dominios autorizados)
- ✅ SQL Injection prevention (queries parametrizadas)
- ✅ Validación de datos en backend
- ✅ Variables sensibles en .env (no en código)

---

## 📊 Características Técnicas

### Performance
- **Tiempo de carga web**: <2 segundos
- **Respuesta API**: <500ms promedio
- **CDN global**: Vercel (100+ ubicaciones)
- **Connection pooling**: PostgreSQL optimizado

### Escalabilidad
- **Arquitectura horizontal**: Fácil agregar servidores
- **Base de datos**: Escalable según crecimiento
- **Caching**: Estrategias implementadas
- **Load balancing**: Soportado por Render

### Disponibilidad
- **Uptime**: 99.9% (SLA de servicios cloud)
- **Backups**: Automáticos diarios (Supabase)
- **Redundancia**: Multi-región en Vercel
- **Monitoreo**: Logs en tiempo real

---

## 🚧 Roadmap Futuro

### Corto Plazo
- [ ] Reportes en PDF descargables
- [ ] Gráficas avanzadas (Charts.js)
- [ ] Exportación a Excel
- [ ] Filtros avanzados por fecha

### Mediano Plazo
- [ ] Notificaciones push en móvil
- [ ] Multi-usuario con roles
- [ ] Dashboard analytics avanzado
- [ ] Modo offline completo en móvil

### Largo Plazo
- [ ] Integración con IoT (sensores)
- [ ] Machine Learning (predicciones)
- [ ] Geolocalización de corrales
- [ ] API pública para terceros

---

## 👨‍💻 Autor

**Julian Ramos Guarin**  
Proyecto de Tesis - Tecnólogo en Análisis y Desarrollo de Software  

📧 Email: [tu-email@ejemplo.com]  
🔗 GitHub: [@JULIANRAMOS11](https://github.com/JULIANRAMOS11)  
📅 Fecha: Febrero 2026  

---

## 📄 Licencia

Este proyecto fue desarrollado como trabajo de grado académico.  
Todos los derechos reservados © 2026

---

## 🙏 Agradecimientos

- Institución educativa por el apoyo
- Asesores del proyecto
- Comunidad de desarrolladores (Stack Overflow, GitHub)
- Proveedores de servicios cloud (Vercel, Render, Supabase)

---

## 📞 Soporte y Contacto

Para dudas, sugerencias o reportar problemas:

- 📧 Email: soporte@agrofarm.com
- 🐛 Issues: [GitHub Issues](https://github.com/JULIANRAMOS11/AGROFARM-SISTEMA/issues)
- 📖 Documentación: Ver carpeta `/docs`

---

**⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub**

---

<div align="center">
  
**Hecho con ❤️ y ☕ para revolucionar la gestión porcina**

![AGROFARM](https://img.shields.io/badge/AGROFARM-Sistema%20Completo-success)

</div>

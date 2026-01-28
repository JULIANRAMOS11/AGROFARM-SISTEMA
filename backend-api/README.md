# Backend API - AGROFARM Sistema Porcino 🐷

API RESTful para gestión integral de granja porcina. Construido con Node.js 18+, Express y PostgreSQL (Supabase).

## 📋 Características

- ✅ Autenticación de usuarios (bcrypt)
- ✅ Gestión completa de cerdos (CRUD)
- ✅ Módulo de Reproducción (servicios + partos)
- ✅ Módulo de Sanidad (vacunas, tratamientos)
- ✅ Módulo de Producción (peso, estadísticas)
- ✅ Módulo de Nutrición (alimentos + consumo)
- ✅ Gestión de Perfil de usuario
- ✅ Middlewares profesionales
- ✅ Utilidades reutilizables

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env  # Completar con credenciales de Supabase

# Ejecutar en desarrollo
npm start
```

## 📁 Estructura del Proyecto

```
src/
├── config/          # Configuración (conexión DB)
├── controllers/     # Lógica de negocio (7 módulos)
├── routes/          # Definición de endpoints (7 archivos)
├── middlewares/     # Validación, auth, errores
├── utils/           # Funciones helper
├── data/            # JSON legacy (desarrollo)
└── index.js         # Entry point
```

Ver detalles completos en: [docs/REFACTORIZACION_BACKEND.md](../docs/REFACTORIZACION_BACKEND.md)

## 🔧 Variables de Entorno

```env
PORT=4000
DATABASE_URL=postgresql://user:pass@host:5432/database?sslmode=require
NODE_ENV=development
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Cerdos
- `GET /api/pigs` - Listar todos
- `GET /api/pigs/:id` - Obtener por ID
- `POST /api/pigs` - Crear cerdo
- `PUT /api/pigs/:id` - Actualizar cerdo
- `PATCH /api/pigs/:id/status` - Cambiar estado
- `DELETE /api/pigs/:id` - Eliminar cerdo

### Reproducción (9 endpoints)
- `GET /api/reproduccion` - Servicios reproductivos
- `POST /api/reproduccion` - Registrar servicio
- `PUT /api/reproduccion/:id/estado` - Actualizar estado
- `GET /api/reproduccion/partos` - Listar partos
- `POST /api/reproduccion/partos` - Registrar parto
- Y más...

### Sanidad (7 endpoints)
- `GET /api/sanidad` - Registros sanitarios
- `POST /api/sanidad` - Nuevo registro
- `GET /api/sanidad/proximas` - Próximas aplicaciones
- Y más...

### Producción (7 endpoints)
- `GET /api/produccion` - Registros de peso
- `POST /api/produccion` - Registrar peso
- `GET /api/produccion/estadisticas` - Estadísticas globales
- Y más...

### Nutrición (11 endpoints)
- `GET /api/nutricion/alimentos` - Catálogo de alimentos
- `POST /api/nutricion/alimentos` - Crear alimento
- `GET /api/nutricion/consumos` - Consumos registrados
- `POST /api/nutricion/consumos` - Registrar consumo
- Y más...

### Perfil (4 endpoints)
- `GET /api/perfil` - Obtener perfil
- `PUT /api/perfil` - Actualizar perfil
- `POST /api/perfil/cambiar-password` - Cambiar contraseña
- `DELETE /api/perfil` - Eliminar cuenta

### Health Check
- `GET /health` - Estado del servidor y DB

**Total: 38+ endpoints**

## 🛡️ Middlewares Disponibles

```javascript
// Autenticación
import { validateAuth, validateRole } from "./middlewares/auth.middleware.js";

// Validación
import { validateRequiredFields, validateId } from "./middlewares/validators.middleware.js";

// Manejo de errores
import { notFound, errorHandler } from "./middlewares/errorHandler.middleware.js";
```

## 🔨 Utilidades

```javascript
// Validadores
import { isValidEmail, isValidPhone } from "./utils/validators.js";

// Helpers de fecha
import { calculateExpectedBirthDate, formatDateToSQL } from "./utils/dateHelpers.js";

// Respuestas HTTP
import { successResponse, errorResponse } from "./utils/responseHelpers.js";
```

## 🌐 Deploy (Render)

1. Crear nuevo Web Service en Render
2. Conectar repositorio de GitHub
3. Configurar variables de entorno:
   - `DATABASE_URL` (Supabase pooler)
   - `PORT` (automático en Render)
   - `NODE_ENV=production`
4. Build Command: `npm install`
5. Start Command: `node src/index.js`
6. Health Check: `/health`

## 📊 Base de Datos (Supabase)

11 tablas principales:
- `users` - Usuarios del sistema
- `pigs` - Inventario de cerdos
- `reproduccion` - Servicios reproductivos
- `partos` - Registros de partos
- `sanidad` - Registros sanitarios
- `produccion` - Pesos y crecimiento
- `alimentacion` - Catálogo de alimentos
- `consumo_alimento` - Consumos registrados
- `lotes` - Agrupación de cerdos
- `etapas` - Etapas productivas
- `razas` - Catálogo de razas

Ver esquema completo en: [docs/database-schema.sql](../docs/database-schema.sql)

## 🧪 Testing

```bash
# Probar health check
curl http://localhost:4000/health

# Probar login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

## 📝 Scripts NPM

```bash
npm start          # Ejecutar servidor
npm run dev        # Desarrollo con nodemon (si está configurado)
npm test           # Tests (pendiente implementar)
```

## 🔗 Enlaces

- **Frontend**: https://agrofarm-sistema.vercel.app
- **API Producción**: https://api-agrofarm.onrender.com
- **Repositorio**: (tu repo de GitHub)

## 📖 Documentación Adicional

- [Documentación de Implementación](../docs/IMPLEMENTACION_MODULOS.md)
- [Refactorización Backend](../docs/REFACTORIZACION_BACKEND.md)
- [Estado del Proyecto](../docs/PROJECT_STATUS.md)
- [Despliegue](../docs/deployment.md)
- [Colección Postman](../docs/postman/)

## 👨‍💻 Desarrollo

```bash
# Clonar repositorio
git clone <tu-repo>
cd backend-api

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env

# Ejecutar
npm start
```

## 🐛 Solución de Problemas

### Error de conexión a DB
- Verifica que `DATABASE_URL` esté configurada correctamente
- Asegúrate de usar el pooler de Supabase (port 6543)
- Incluye `?sslmode=require` en la URL

### Puerto en uso
- Cambia el `PORT` en `.env`
- O cierra el proceso: `npx kill-port 4000`

### CORS errors
- Verifica que el origen del frontend esté en `allowedOrigins` (index.js)

## 📄 Licencia

MIT (o la que uses)

## 👥 Contribución

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

**¿Preguntas?** Revisa la documentación en `docs/` o abre un issue.

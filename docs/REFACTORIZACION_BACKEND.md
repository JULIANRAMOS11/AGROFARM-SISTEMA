# Refactorización Backend - Arquitectura Profesional

## 📁 Nueva Estructura del Proyecto

```
backend-api/
├── src/
│   ├── config/                    # Configuraciones
│   │   └── db.js                  # Conexión PostgreSQL/Supabase
│   │
│   ├── controllers/               # Lógica de Negocio (7 módulos)
│   │   ├── auth.controller.js     # Autenticación (login/register)
│   │   ├── pigs.controller.js     # CRUD de cerdos
│   │   ├── reproduccion.controller.js   # Servicios + Partos
│   │   ├── sanidad.controller.js  # Registros sanitarios
│   │   ├── produccion.controller.js     # Peso + Estadísticas
│   │   ├── nutricion.controller.js      # Alimentos + Consumos
│   │   └── perfil.controller.js   # Gestión de perfil usuario
│   │
│   ├── routes/                    # Definición de Endpoints
│   │   ├── auth.routes.js         # POST /api/auth/login, /register
│   │   ├── pigs.routes.js         # CRUD /api/pigs
│   │   ├── reproduccion.routes.js # /api/reproduccion + /partos
│   │   ├── sanidad.routes.js      # /api/sanidad
│   │   ├── produccion.routes.js   # /api/produccion + /estadisticas
│   │   ├── nutricion.routes.js    # /api/nutricion + /alimentos + /consumos
│   │   └── perfil.routes.js       # /api/perfil
│   │
│   ├── middlewares/               # **NUEVO** Middlewares reutilizables
│   │   ├── auth.middleware.js     # validateAuth, validateRole, requestLogger
│   │   ├── validators.middleware.js  # validateRequiredFields, validateEmail, validateId
│   │   └── errorHandler.middleware.js  # notFound, errorHandler, asyncHandler
│   │
│   ├── utils/                     # **NUEVO** Utilidades comunes
│   │   ├── validators.js          # isValidEmail, isValidPhone, sanitizeString
│   │   ├── dateHelpers.js         # calculateExpectedBirthDate, formatDateToSQL
│   │   └── responseHelpers.js     # successResponse, errorResponse, createdResponse
│   │
│   ├── data/                      # Datos legacy (JSON)
│   │   ├── pigs.json              # Datos de prueba
│   │   └── users.json             # Usuarios de prueba
│   │
│   └── index.js                   # **ACTUALIZADO** Entry point con middlewares
│
├── package.json
├── .env                           # Variables de entorno
└── README.md
```

---

## ✨ Mejoras Implementadas

### 1. **Middlewares Profesionales** 
Centralización de validación y manejo de errores:

- **auth.middleware.js**: Validación de tokens, roles y logging de requests
- **validators.middleware.js**: Validación de campos requeridos, emails, IDs, fechas
- **errorHandler.middleware.js**: Manejo global de errores 404/500 + async wrapper

### 2. **Utilidades Reutilizables**
Funciones helper para evitar código duplicado:

- **validators.js**: `isValidEmail()`, `isValidPhone()`, `sanitizeString()`
- **dateHelpers.js**: `calculateExpectedBirthDate()`, `calculateAgeInDays()`, `formatDateToSQL()`
- **responseHelpers.js**: `successResponse()`, `errorResponse()`, `createdResponse()`

### 3. **index.js Modernizado**
Entry point con mejor organización:

```javascript
// ✅ Imports organizados
import { requestLogger } from "./middlewares/auth.middleware.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.middleware.js";

// ✅ Middleware de logging global
app.use(requestLogger);

// ✅ Rutas organizadas
app.use("/api/auth", authRoutes);
app.use("/api/pigs", pigsRoutes);
// ... más rutas

// ✅ Manejo de errores al final
app.use(notFound);
app.use(errorHandler);
```

---

## 🎯 Patrón de Arquitectura Aplicado

### **MVC + Clean Architecture**

**Model** (implícito en queries SQL)
- No usamos ORM, SQL directo en controllers
- Pool de conexiones en `config/db.js`

**View** (JSON API)
- Respuestas estandarizadas con `responseHelpers.js`

**Controller** (lógica de negocio)
- 7 controllers especializados
- Responsabilidad única por módulo

**Middlewares** (capa transversal)
- Autenticación, validación, logging, errores
- Reutilizables en cualquier ruta

**Utils** (helpers)
- Funciones puras sin dependencias
- Validadores, formateadores, helpers

---

## 📊 Estadísticas del Proyecto

| Métrica | Cantidad |
|---------|----------|
| **Controllers** | 7 archivos |
| **Routes** | 7 archivos |
| **Middlewares** | 3 archivos |
| **Utils** | 3 archivos |
| **Total Endpoints** | 38+ endpoints |
| **Tablas DB** | 11 tablas |

---

## 🚀 Cómo Usar los Middlewares

### Ejemplo: Validar campos requeridos

```javascript
import { validateRequiredFields } from "../middlewares/validators.middleware.js";

router.post("/", 
  validateRequiredFields(['nombre', 'email']), 
  createPig
);
```

### Ejemplo: Validar ID en rutas

```javascript
import { validateId } from "../middlewares/validators.middleware.js";

router.get("/:id", validateId, getPigById);
```

### Ejemplo: Respuestas estandarizadas

```javascript
import { successResponse, errorResponse } from "../utils/responseHelpers.js";

export const getPigs = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM pigs");
    return successResponse(res, rows, "Cerdos obtenidos exitosamente");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
```

---

## 🔧 Próximas Mejoras Sugeridas

- [ ] Implementar JWT real en `auth.middleware.js`
- [ ] Agregar `models/` con esquemas de validación (Joi/Yup)
- [ ] Crear `services/` para lógica compleja (separar de controllers)
- [ ] Agregar tests unitarios con Jest/Mocha
- [ ] Documentar API con Swagger/OpenAPI
- [ ] Implementar rate limiting y compresión
- [ ] Agregar Winston para logging avanzado

---

## ✅ Verificación

El servidor arranca correctamente con la nueva estructura:

```bash
cd backend-api
node src/index.js

# Output:
🚀 API AGROFARM corriendo en http://localhost:4000
📊 Ambiente: development
```

Todos los imports están actualizados y funcionando sin errores.

---

## 📝 Cambios en index.js

**Antes:**
```javascript
app.use((req, res) => res.status(404).json({ error: "Not found" }));
```

**Después:**
```javascript
// Middlewares profesionales
import { requestLogger } from "./middlewares/auth.middleware.js";
import { notFound, errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(requestLogger); // Log automático de requests
app.use(notFound);      // Manejo de 404
app.use(errorHandler);  // Manejo de errores 500
```

---

## 🎉 Resultado Final

✅ Estructura profesional y escalable  
✅ Middlewares reutilizables  
✅ Utilidades comunes centralizadas  
✅ Manejo de errores estandarizado  
✅ Código más limpio y mantenible  
✅ Sin errores al arrancar el servidor  
✅ Preparado para crecer con el proyecto  

**La refactorización está completa y el backend sigue funcionando correctamente.**

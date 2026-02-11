# 🐷 AGROFARM - Sistema Integral de Gestión Porcina

![Version](https://img.shields.io/badge/version-1.0.0-green)
![React](https://img.shields.io/badge/React-19.2.1-blue)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Android](https://img.shields.io/badge/Android-Java-orange)

Sistema multiplataforma (Web + Móvil Android) para la gestión integral de granjas porcinas con sincronización en tiempo real.

---

## 🎯 ¿Qué es AGROFARM?

**AGROFARM** es un sistema profesional que digitaliza y automatiza el control completo de granjas porcinas:

- 🐖 **Gestión de Cerdos**: Inventario completo con trazabilidad
- 👶 **Reproducción**: Control de montas, partos y lechones
- 💉 **Sanidad**: Tratamientos veterinarios y vacunas
- 📊 **Producción**: Pesajes y ganancia de peso
- 🌾 **Nutrición**: Inventario de alimentos y consumos
- 📈 **Dashboard**: Estadísticas en tiempo real

---

## 🌐 URLs de Producción

- **🌍 Web Frontend**: https://agrofarm-sistema.vercel.app
- **🔌 API Backend**: https://api-agrofarm.onrender.com
- **📊 Health Check**: https://api-agrofarm.onrender.com/api/health

---

## 🔑 Credenciales de Prueba

```
Username: ADMIN
Password: admin123
```

---

## 📚 Documentación Completa

👉 **[Ver README Completo](./README_COMPLETO.md)** con:
- Arquitectura detallada del sistema
- Explicación de todas las tecnologías
- Guías de instalación paso a paso
- Documentación de API endpoints
- Estructura del código
- Y mucho más...

---

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ y npm
- Cuenta Supabase (PostgreSQL)
- Git

### Instalación

**1. Clonar repositorio:**
```bash
git clone https://github.com/JULIANRAMOS11/AGROFARM-SISTEMA.git
cd AGROFARM-SISTEMA
```

**2. Backend:**
```bash
cd backend-api
npm install
cp .env.example .env
# Editar .env con tus credenciales de Supabase
npm start
```

**3. Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Editar .env con la URL de tu API
npm start
```

**4. Base de datos:**
```bash
# Ejecutar scripts SQL en Supabase en orden:
# database/00_cleanup.sql
# database/01_types_enums.sql
# database/02_constraints.sql
# database/03_functions_triggers.sql
# database/04_optimizacion_indices.sql
# database/05_datos_prueba.sql
```

---

## 📁 Estructura del Proyecto

```
AGROFARM-SISTEMA/
├── 📁 frontend/          # React Web App
│   ├── src/
│   │   ├── pages/        # Dashboard, Cerdos, Reproducción, etc.
│   │   ├── components/   # Componentes reutilizables
│   │   └── routes/       # Rutas protegidas
│   └── package.json
│
├── 📁 backend-api/       # API REST Node.js
│   ├── src/
│   │   ├── controllers/  # Lógica de negocio
│   │   ├── routes/       # Endpoints
│   │   ├── middlewares/  # Autenticación y validación
│   │   └── config/       # Conexión DB
│   └── database/         # Scripts SQL
│
├── 📁 docs/              # Documentación
│   ├── deployment.md
│   └── postman/          # Colección API
│
└── README_COMPLETO.md    # Documentación extendida
```

---

## 🛠️ Tecnologías

### Frontend Web
- **React** 19.2.1
- **Tailwind CSS**
- **React Router DOM** 7.10.1
- **React Hot Toast**
- **Vercel** (Hosting)

### Backend API
- **Node.js** 18+
- **Express** 4.21.0
- **PostgreSQL** 15 (Supabase)
- **bcryptjs** (Seguridad)
- **Render.com** (Hosting)

### App Móvil Android
- **Java** (Android SDK)
- **Material Components** 1.9.0
- **Volley** (HTTP Client)
- **MVVM** Architecture

---

## 📡 API Endpoints Principales

### Autenticación
```http
POST /api/auth/register   # Registro de usuario
POST /api/auth/login      # Inicio de sesión
```

### Cerdos
```http
GET    /api/pigs          # Listar todos
POST   /api/pigs          # Crear cerdo
PUT    /api/pigs/:id      # Actualizar
PATCH  /api/pigs/:id/status  # Cambiar estado
DELETE /api/pigs/:id      # Eliminar
```

### Reproducción
```http
GET  /api/reproduccion             # Listar montas
POST /api/reproduccion             # Registrar monta
GET  /api/reproduccion/partos/all  # Listar partos
POST /api/reproduccion/partos      # Registrar parto
```

### Sanidad
```http
GET  /api/sanidad          # Tratamientos
POST /api/sanidad          # Registrar tratamiento
GET  /api/sanidad/proximas # Próximas vacunas
```

### Producción
```http
GET  /api/produccion              # Pesajes
POST /api/produccion              # Registrar pesaje
GET  /api/produccion/estadisticas # Estadísticas
```

### Nutrición
```http
GET  /api/nutricion/alimentos  # Inventario
POST /api/nutricion/alimentos  # Crear alimento
GET  /api/nutricion/consumos   # Consumos
POST /api/nutricion/consumos   # Registrar consumo
```

**📖 Documentación completa**: Ver colección Postman en `docs/postman/`

---

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Autenticación basada en tokens
- ✅ HTTPS/TLS en todas las comunicaciones
- ✅ CORS configurado
- ✅ SQL Injection prevention
- ✅ Validación de datos en backend

---

## 📊 Características

### Funcionalidades
- ✅ Sistema multiplataforma (Web + Móvil)
- ✅ Sincronización en tiempo real
- ✅ Dashboard con estadísticas
- ✅ Control completo del ciclo de vida porcino
- ✅ Historial completo por animal
- ✅ Reportes y análisis
- ✅ Diseño responsive

### Técnicas
- ✅ Arquitectura RESTful
- ✅ Base de datos relacional
- ✅ Deploy automático (CI/CD)
- ✅ Escalable y mantenible
- ✅ Documentación completa

---

## 👨‍💻 Autor

**Julian Ramos Guarin**  
Proyecto de Tesis - Tecnólogo en Análisis y Desarrollo de Software  

🔗 GitHub: [@JULIANRAMOS11](https://github.com/JULIANRAMOS11)  
📅 Fecha: Febrero 2026  

---

## 📄 Licencia

Este proyecto fue desarrollado como trabajo de grado académico.  
Todos los derechos reservados © 2026

---

## 🙏 Agradecimientos

Agradecimientos a la institución educativa, asesores del proyecto y comunidad de desarrolladores.

---

## 📞 Soporte

Para más información, consultar:
- 📖 [Documentación Completa](./README_COMPLETO.md)
- 📚 [Guía de Deployment](./docs/deployment.md)
- 🧪 [Colección Postman](./docs/postman/)

---

<div align="center">

**Hecho con ❤️ para revolucionar la gestión porcina**

⭐ **Si te fue útil, considera darle una estrella en GitHub** ⭐

![AGROFARM](https://img.shields.io/badge/AGROFARM-Sistema%20Completo-success)

</div>


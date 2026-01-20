# AGROFARM-SISTEMA

Suite completa: frontend React, backend Express/PostgreSQL (Supabase) y documentación para despliegue.

## Estructura
- `frontend/` React CRA, router con `HashRouter` para GitHub Pages.
- `backend-api/` API principal (Express + pg).
- `docs/postman/` Colección y environment para pruebas.
- `docs/deployment.md` Pasos de hosting.
- `legacy/` Referencias históricas (`api-login/` y HTML antiguo).

## Requisitos
- Node.js 18+ y npm.
- Cuenta Supabase (PostgreSQL) y URL pooler.
- Cuentas en GitHub (GH Pages) y Render/Railway para backend.

## Setup rápido
1) Clonar este repo en `C:\Proyectos\AGROFARM-SISTEMA`.
2) Backend:
   - Copiar `.env.example` -> `.env` y completar `DATABASE_URL`, `FRONTEND_ORIGIN`.
   - `cd backend-api && npm install`.
   - Crear tablas en Supabase (SQL abajo).
   - `npm start` (o `npm run dev` si agregas nodemon).
3) Frontend:
   - Copiar `.env.example` -> `.env` y ajustar `REACT_APP_API_BASE_URL`.
   - `cd frontend && npm install`.
   - `npm start` para desarrollo.
   - `npm run deploy` para publicar en GH Pages.
4) Postman:
   - Importar colección y environment desde `docs/postman/`.
   - Setear variable `BASE_URL` al backend (`http://localhost:4000/api` o URL en Render/Railway).

## Variables de entorno
- Backend (`backend-api/.env`):
  - `PORT`: puerto local, ej. 4000
  - `DATABASE_URL`: cadena completa de Supabase (pooler)
  - `FRONTEND_ORIGIN`: lista separada por comas de orígenes permitidos (dev + GH Pages)
- Frontend (`frontend/.env`):
  - `REACT_APP_API_BASE_URL`: base de la API (`/api`)

## SQL inicial (Supabase)
```sql
CREATE TABLE users (
  id serial PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'USER',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE pigs (
  id serial PRIMARY KEY,
  codigo_arete text NOT NULL,
  sexo text NOT NULL,
  fecha_nacimiento date NOT NULL,
  estado text DEFAULT 'ACTIVO',
  etapa text DEFAULT 'DESCONOCIDA',
  peso_actual numeric DEFAULT 0,
  lote text DEFAULT 'SIN_LOTE',
  created_at timestamptz DEFAULT now()
);
```

## Endpoints clave
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/pigs`
- `GET /api/pigs/:id`
- `POST /api/pigs`
- `PUT /api/pigs/:id`
- `PATCH /api/pigs/:id/status`
- `DELETE /api/pigs/:id`

## Deploy (resumen)
- Frontend: GitHub Pages (`npm run deploy`, usa `HashRouter`).
- Backend: Render o Railway (Node 18, env `DATABASE_URL`, `PORT`, health `/health`).
- BD: Supabase (plan free).

## Legacy
- `legacy/api-login/`: API anterior (no usar en producción).
- `legacy/html-legacy/`: HTML estático de la primera versión.

# Deployment AGROFARM-SISTEMA

## Backend (Render)
1. Crear nuevo Web Service desde repo (carpeta `backend-api`).
2. Runtime: Node 18+. Start command: `npm start`. Root dir: `backend-api`.
3. Variables:
   - `DATABASE_URL=postgresql://...` (Supabase pooler)
   - `PORT=4000`
   - `FRONTEND_ORIGIN=https://<tu-usuario>.github.io/AGROFARM-SISTEMA`
4. Health check: `/health`.

## Backend (Railway alternativa)
1. Nuevo proyecto > Deploy from repo (root `backend-api`).
2. Variables igual que arriba.
3. Asegura puerto 4000 o el que asigne Railway (usa `process.env.PORT`).

## Frontend (GitHub Pages)
1. Ajustar `homepage` en `frontend/package.json`.
2. `npm install` y `npm run deploy`.
3. Asegurar `HashRouter` en `src/App.js`.

## Base de datos (Supabase)
1. Crear proyecto Supabase.
2. Ir a SQL editor y ejecutar el DDL de tablas `users` y `pigs`.
3. Copiar la cadena pooler y usarla en `DATABASE_URL` (`sslmode=require` implícito).

## Postman
1. Importar `docs/postman/Agrofarm.postman_collection.json`.
2. Importar environment `docs/postman/Agrofarm.postman_environment.json`.
3. Setear `BASE_URL` al backend desplegado.

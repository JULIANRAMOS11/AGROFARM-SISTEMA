# frontend (AGROFARM)

SPA en React (CRA) con `HashRouter` para GitHub Pages.

## Requisitos
- Node.js 18+

## Instalación
```bash
npm install
cp .env.example .env  # ajustar REACT_APP_API_BASE_URL
npm start
```

## Variables de entorno
- `REACT_APP_API_BASE_URL` → ej. `http://localhost:4000/api` o URL del backend en Render/Railway.

## Scripts
- `npm start` → desarrollo
- `npm run build` → build estático
- `npm run deploy` → publica en GH Pages (requiere `homepage` configurado)

## Router
- Usa `HashRouter` para evitar 404 en GH Pages.

## Deploy GH Pages
- Ajusta `homepage` en `package.json` a `https://<tu-usuario>.github.io/AGROFARM-SISTEMA`.
- Ejecuta `npm run deploy`.

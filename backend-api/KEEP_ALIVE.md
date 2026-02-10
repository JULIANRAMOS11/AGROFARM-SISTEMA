# Keep Alive Configuration

Para mantener el backend activo en Render (plan gratuito) sin que se duerma, usa uno de estos servicios gratuitos:

## Opción 1: UptimeRobot (Recomendado)

1. Regístrate en: https://uptimerobot.com (gratis)
2. Crea un nuevo monitor:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Agrofarm API
   - **URL**: `https://api-agrofarm.onrender.com/health`
   - **Monitoring Interval**: 5 minutos
3. Guarda y activa

## Opción 2: Cron-job.org

1. Regístrate en: https://cron-job.org (gratis)
2. Crea un nuevo cronjob:
   - **Title**: Agrofarm Keep Alive
   - **URL**: `https://api-agrofarm.onrender.com/health`
   - **Schedule**: */10 * * * * (cada 10 minutos)
3. Guarda y activa

## Opción 3: BetterUptime

1. Regístrate en: https://betteruptime.com (gratis)
2. Crea un nuevo monitor:
   - **URL**: `https://api-agrofarm.onrender.com/health`
   - **Check frequency**: 3 minutos
3. Activa

## Endpoints disponibles

- `/health` - Health check simple (más rápido)
- `/api/health` - Health check simple
- `/api/health/db` - Health check con verificación de base de datos

**Recomendación**: Usa `/health` para el ping automático ya que es más ligero y no consume recursos de la base de datos.

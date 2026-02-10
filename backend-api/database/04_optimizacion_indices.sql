-- =============================================================================
-- OPTIMIZACIÓN DE ÍNDICES - AGROFARM DB
-- Fecha: Febrero 2026
-- Propósito: Mejorar rendimiento para 1000+ cerdos y múltiples consultas
-- =============================================================================

-- =============================================================================
-- PARTE 1: ELIMINAR ÍNDICES REDUNDANTES
-- =============================================================================
-- Libera espacio y reduce coste en operaciones de escritura (INSERT/UPDATE)

DROP INDEX IF EXISTS public.idx_consumo_pig;
DROP INDEX IF EXISTS public.idx_produccion_pig;
DROP INDEX IF EXISTS public.idx_reproduccion_pig;
DROP INDEX IF EXISTS public.idx_sanidad_pig;
DROP INDEX IF EXISTS public.idx_pigs_lote;

-- =============================================================================
-- PARTE 2: ÍNDICES COMPUESTOS PARA CONSULTAS FRECUENTES
-- =============================================================================
-- Optimizan consultas que filtran por cerdo + fecha (reportes, gráficas, etc)

-- Producción por cerdo y rango de fechas
CREATE INDEX IF NOT EXISTS idx_produccion_pig_fecha 
ON public.produccion (pig_id, fecha);

-- Consumo de alimento por cerdo, alimento y fecha
CREATE INDEX IF NOT EXISTS idx_consumo_alimento_pig_alimento_fecha 
ON public.consumo_alimento (pig_id, alimento_id, fecha);

-- Partos por reproducción y fecha
CREATE INDEX IF NOT EXISTS idx_partos_reproduccion_fecha 
ON public.partos (reproduccion_id, fecha_parto);

-- =============================================================================
-- PARTE 3: ÍNDICE PARA BÚSQUEDAS PARCIALES (OPCIONAL)
-- =============================================================================
-- Útil si la UI permite buscar cerdos por código con LIKE '%abc%'
-- Aumenta espacio usado pero mejora significativamente búsquedas tipo "contiene"

CREATE INDEX IF NOT EXISTS idx_pigs_codigo_arete_trgm 
ON public.pigs USING gin (codigo_arete gin_trgm_ops);

-- =============================================================================
-- PARTE 4: ÍNDICES PARA FILTROS COMBINADOS
-- =============================================================================
-- Optimiza consultas tipo "mostrar cerdos del lote X en etapa Y"

CREATE INDEX IF NOT EXISTS idx_pigs_lote_etapa 
ON public.pigs (lote_id, etapa_id);

-- =============================================================================
-- PARTE 5: ACTUALIZAR ESTADÍSTICAS
-- =============================================================================
-- Después de cambios en índices, actualizar estadísticas del query planner

ANALYZE public.pigs;
ANALYZE public.produccion;
ANALYZE public.consumo_alimento;
ANALYZE public.partos;

-- =============================================================================
-- VERIFICACIÓN POST-APLICACIÓN (ejecutar manualmente)
-- =============================================================================
-- Verifica que los índices se crearon correctamente:
-- SELECT schemaname, tablename, indexname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;

-- Monitorea consultas lentas (requiere pg_stat_statements):
-- SELECT query, calls, total_time, mean_time 
-- FROM pg_stat_statements 
-- ORDER BY total_time DESC 
-- LIMIT 20;

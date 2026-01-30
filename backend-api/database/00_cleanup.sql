-- =============================================================================
-- PASO 0: LIMPIEZA (Ejecutar primero)
-- =============================================================================

-- Eliminar Triggers
DROP TRIGGER IF EXISTS trg_actualizar_stock ON consumo_alimento;
DROP TRIGGER IF EXISTS trg_check_sexo_reproduccion ON reproduccion;
DROP TRIGGER IF EXISTS trg_validar_parto_logico ON partos;

-- Eliminar Funciones
DROP FUNCTION IF EXISTS fn_gestionar_stock_consumo();
DROP FUNCTION IF EXISTS fn_validar_reproduccion_sexo();
DROP FUNCTION IF EXISTS fn_validar_parto_estado();

-- Eliminar Constraints (Borrarlos si existen para re-crearlos limpios)
ALTER TABLE produccion DROP CONSTRAINT IF EXISTS check_produccion_valores_positivos;
ALTER TABLE produccion DROP CONSTRAINT IF EXISTS check_produccion_fecha_valida;
ALTER TABLE consumo_alimento DROP CONSTRAINT IF EXISTS check_consumo_cantidad_positiva;

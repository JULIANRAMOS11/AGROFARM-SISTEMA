-- =============================================================================
-- PASO 2: RESTRICCIONES (Ejecutar tercero)
-- =============================================================================

-- Tabla Producción
ALTER TABLE produccion
ADD CONSTRAINT check_produccion_valores_positivos
CHECK (
    peso >= 0 AND 
    edad_dias >= 0 AND 
    (ganancia_diaria IS NULL OR ganancia_diaria >= 0) AND
    (consumo_alimento_kg IS NULL OR consumo_alimento_kg >= 0)
);

ALTER TABLE produccion
ADD CONSTRAINT check_produccion_fecha_valida
CHECK (fecha <= CURRENT_DATE);

-- Tabla Consumo
ALTER TABLE consumo_alimento
ADD CONSTRAINT check_consumo_cantidad_positiva
CHECK (cantidad_kg > 0);

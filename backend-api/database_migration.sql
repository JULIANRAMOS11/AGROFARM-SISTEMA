/*
  --------------------------------------------------------------------------------
  -- SCRIPT DE MIGRACIÓN: DEFENSA EN PROFUNDIDAD (Base de Datos)
  -- PROYECTO: AGROFARM-SISTEMA
  -- AUTOR: Equipo de Desarrollo (SENA)
  -- DESCRIPCIÓN: Implementa reglas de negocio estrictas, tipos de datos robustos
  --              y automatización mediante triggers directamente en PostgreSQL.
  --------------------------------------------------------------------------------
*/

-- =============================================================================
-- 1. TIPOS DE DATOS Y DOMINIOS (ENUMS)
-- =============================================================================
/* 
   EXPLICACIÓN TÉCNICA:
   Se reemplazan los campos de texto libre por TIPOS ENUMERADOS (ENUMs).
   Esto garantiza que la base de datos RECHACE cualquier valor que no esté
   predefinido en la regla de negocio (ej: 'Macho', 'Hembra').
   
   NOTA: Si ya existen datos con otros valores, este paso fallará.
         Se recomienda limpiar los datos antes de ejecutar.
*/

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo_porcino') THEN
        CREATE TYPE sexo_porcino AS ENUM ('Macho', 'Hembra');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_reproduccion') THEN
        CREATE TYPE estado_reproduccion AS ENUM ('VACIA', 'GESTANTE', 'CONFIRMADA', 'PARTO_REALIZADO', 'FALLIDA');
    END IF;
END $$;

-- Aplicar los ENUMS a las tablas (CAST necesario para convertir texto existente)
-- IMPORTANTE: Asegúrate de que los datos en 'sexo' sean exactamente 'Macho' o 'Hembra'.
ALTER TABLE pigs 
ALTER COLUMN sexo TYPE sexo_porcino USING sexo::sexo_porcino;

ALTER TABLE reproduccion 
ALTER COLUMN estado TYPE estado_reproduccion USING estado::estado_reproduccion;


-- =============================================================================
-- 2. RESTRICCIONES DE INTEGRIDAD (CHECK CONSTRAINTS)
-- =============================================================================
/* 
   EXPLICACIÓN TÉCNICA:
   Los CHECK CONSTRAINTS son reglas lógicas que cada fila debe cumplir.
   Protegen contra errores humanos (ej: pesos negativos) o lógicos (ej: fechas futuras).
*/

-- TABLA: PRODUCCION
-- Regla: No existen pesos ni edades negativas.
ALTER TABLE produccion
ADD CONSTRAINT check_produccion_valores_positivos
CHECK (
    peso >= 0 AND 
    edad_dias >= 0 AND 
    (ganancia_diaria IS NULL OR ganancia_diaria >= 0) AND
    (consumo_alimento_kg IS NULL OR consumo_alimento_kg >= 0)
);

-- Regla: No registrar datos con fecha futura (Viajeros del tiempo no permitidos).
ALTER TABLE produccion
ADD CONSTRAINT check_produccion_fecha_valida
CHECK (fecha <= CURRENT_DATE);

-- TABLA: CONSUMO_ALIMENTO (Nutrición)
-- Regla: No se puede consumir una cantidad negativa o cero.
ALTER TABLE consumo_alimento
ADD CONSTRAINT check_consumo_cantidad_positiva
CHECK (cantidad_kg > 0);


-- =============================================================================
-- 3. AUTOMATIZACIÓN DE INVENTARIO (TRIGGERS)
-- =============================================================================
/* 
   EXPLICACIÓN TÉCNICA:
   Se implementa un TRIGGER 'BEFORE INSERT' que actúa como un guardián.
   Antes de guardar un consumo, verifica el stock y lo descuenta.
   Si el stock llegaría a ser negativo, ABORTA la transacción con un error.
*/

CREATE OR REPLACE FUNCTION fn_gestionar_stock_consumo()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual DECIMAL(10,2);
    nombre_alimento TEXT;
BEGIN
    -- 1. Obtener el stock actual y nombre del alimento
    SELECT stock_kg, nombre_alimento INTO stock_actual, nombre_alimento
    FROM alimentacion
    WHERE id = NEW.alimento_id;

    -- 2. Validar si existe el alimento
    IF NOT FOUND THEN
        RAISE EXCEPTION 'El alimento con ID % no existe.', NEW.alimento_id;
    END IF;

    -- 3. Validar si hay suficiente stock
    IF stock_actual < NEW.cantidad_kg THEN
        RAISE EXCEPTION 'Stock insuficiente para "%". Disponible: % kg, Solicitado: % kg.', 
                        nombre_alimento, stock_actual, NEW.cantidad_kg;
    END IF;

    -- 4. Descontar del stock (Si todo está bien)
    UPDATE alimentacion
    SET stock_kg = stock_kg - NEW.cantidad_kg
    WHERE id = NEW.alimento_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear el Trigger
DROP TRIGGER IF EXISTS trg_actualizar_stock ON consumo_alimento;

CREATE TRIGGER trg_actualizar_stock
BEFORE INSERT ON consumo_alimento
FOR EACH ROW
EXECUTE FUNCTION fn_gestionar_stock_consumo();


-- =============================================================================
-- 4. INTEGRIDAD DE NEGOCIO CRUZADA (REPRODUCCIÓN)
-- =============================================================================
/* 
   EXPLICACIÓN TÉCNICA:
   Validaciones complejas que cruzan información entre tablas.
   Asegura la coherencia biológica del sistema.
*/

-- A. VALIDAR QUE SOLO HEMBRAS TENGAN SERVICIOS
CREATE OR REPLACE FUNCTION fn_validar_reproduccion_sexo()
RETURNS TRIGGER AS $$
DECLARE
    sexo_cerdo sexo_porcino;
BEGIN
    SELECT sexo INTO sexo_cerdo FROM pigs WHERE id = NEW.pig_id;
    
    IF sexo_cerdo <> 'Hembra' THEN
        RAISE EXCEPTION 'Error de Integridad Biológica: Solo se pueden registrar servicios a cerdas (Hembras).';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_sexo_reproduccion ON reproduccion;

CREATE TRIGGER trg_check_sexo_reproduccion
BEFORE INSERT OR UPDATE ON reproduccion
FOR EACH ROW
EXECUTE FUNCTION fn_validar_reproduccion_sexo();


-- B. VALIDAR QUE EL PARTO CORRESPONDA A UNA GESTACIÓN ACTIVA
CREATE OR REPLACE FUNCTION fn_validar_parto_estado()
RETURNS TRIGGER AS $$
DECLARE
    estado_actual estado_reproduccion;
BEGIN
    -- Obtener estado del servicio de reproducción asociado
    SELECT estado INTO estado_actual FROM reproduccion WHERE id = NEW.reproduccion_id;

    -- Solo permitir parto si está GESTANTE o CONFIRMADA
    IF estado_actual NOT IN ('GESTANTE', 'CONFIRMADA') THEN
        RAISE EXCEPTION 'Error de Flujo: No se puede registrar un parto para un servicio en estado "%". Debe estar GESTANTE o CONFIRMADA.', estado_actual;
    END IF;

    -- Opcional: Actualizar el estado a PARTO_REALIZADO automáticamente
    UPDATE reproduccion SET estado = 'PARTO_REALIZADO' WHERE id = NEW.reproduccion_id;

    RETURN NEW; -- Permitir la inserción del parto
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_validar_parto_logico ON partos;

CREATE TRIGGER trg_validar_parto_logico
BEFORE INSERT ON partos
FOR EACH ROW
EXECUTE FUNCTION fn_validar_parto_estado();

-- =============================================================================
-- FIN DEL SCRIPT DE MIGRACIÓN
-- =============================================================================

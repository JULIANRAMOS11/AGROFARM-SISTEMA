-- =============================================================================
-- PASO 3: AUTOMATIZACIÓN (Ejecutar cuarto)
-- =============================================================================

-- 1. Trigger de Stock (Nutrición)
CREATE OR REPLACE FUNCTION fn_gestionar_stock_consumo()
RETURNS TRIGGER AS $$
DECLARE
    stock_actual DECIMAL(10,2);
    nombre_alimento TEXT;
BEGIN
    SELECT stock_kg, nombre_alimento INTO stock_actual, nombre_alimento
    FROM alimentacion WHERE id = NEW.alimento_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El alimento con ID % no existe.', NEW.alimento_id;
    END IF;

    IF stock_actual < NEW.cantidad_kg THEN
        RAISE EXCEPTION 'Stock insuficiente para "%". Disponible: % kg, Solicitado: % kg.', 
                        nombre_alimento, stock_actual, NEW.cantidad_kg;
    END IF;

    UPDATE alimentacion
    SET stock_kg = stock_kg - NEW.cantidad_kg
    WHERE id = NEW.alimento_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_actualizar_stock
BEFORE INSERT ON consumo_alimento
FOR EACH ROW
EXECUTE FUNCTION fn_gestionar_stock_consumo();

-- 2. Trigger de Sexo (Reproducción)
CREATE OR REPLACE FUNCTION fn_validar_reproduccion_sexo()
RETURNS TRIGGER AS $$
DECLARE
    sexo_cerdo sexo_porcino;
BEGIN
    SELECT sexo INTO sexo_cerdo FROM pigs WHERE id = NEW.pig_id;
    
    IF sexo_cerdo <> 'Hembra' THEN
        RAISE EXCEPTION 'Error de Integridad: Solo se pueden registrar servicios a cerdas (Hembras).';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_sexo_reproduccion
BEFORE INSERT OR UPDATE ON reproduccion
FOR EACH ROW
EXECUTE FUNCTION fn_validar_reproduccion_sexo();

-- 3. Trigger de Partos Logicos
CREATE OR REPLACE FUNCTION fn_validar_parto_estado()
RETURNS TRIGGER AS $$
DECLARE
    estado_actual estado_reproduccion;
BEGIN
    SELECT estado INTO estado_actual FROM reproduccion WHERE id = NEW.reproduccion_id;

    IF estado_actual NOT IN ('GESTANTE', 'CONFIRMADA') THEN
        RAISE EXCEPTION 'Error de Flujo: No se puede registrar un parto para un servicio en estado "%".', estado_actual;
    END IF;

    -- Actualizar estado automáticamente
    UPDATE reproduccion SET estado = 'PARTO_REALIZADO' WHERE id = NEW.reproduccion_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_validar_parto_logico
BEFORE INSERT ON partos
FOR EACH ROW
EXECUTE FUNCTION fn_validar_parto_estado();

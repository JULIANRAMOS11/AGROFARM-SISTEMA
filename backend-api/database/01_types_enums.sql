-- =============================================================================
-- PASO 1: MIGRACIÓN SEGURA DE TIPOS (Estrategia "Column Swap")
-- =============================================================================

-- 1. Crear Tipos (Idemmpotente)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sexo_porcino') THEN
        CREATE TYPE sexo_porcino AS ENUM ('Macho', 'Hembra');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'estado_reproduccion') THEN
        CREATE TYPE estado_reproduccion AS ENUM ('VACIA', 'GESTANTE', 'CONFIRMADA', 'PARTO_REALIZADO', 'FALLIDA');
    END IF;
END $$;

-- 2. Eliminar Vista Dependiente (Necesario para tocar la tabla pigs)
DROP VIEW IF EXISTS pigs_v;

-- 3. MIGRACIÓN TABLA PIGS (Columna Temporal + Limpieza)
-- Creamos columna temporal
ALTER TABLE pigs ADD COLUMN IF NOT EXISTS sexo_new sexo_porcino;

-- Migramos datos normalizando (Macho/macho/m -> Macho, Hembra/hembra/f -> Hembra)
UPDATE pigs SET sexo_new = CASE 
    WHEN lower(sexo::text) LIKE 'm%' THEN 'Macho'::sexo_porcino
    WHEN lower(sexo::text) LIKE 'h%' THEN 'Hembra'::sexo_porcino
    WHEN lower(sexo::text) LIKE 'f%' THEN 'Hembra'::sexo_porcino -- Por si acaso 'Female'
    ELSE NULL -- Datos basura quedan NULL y se pueden revisar luego
END;

-- Reemplazo de columnas (Swap)
ALTER TABLE pigs DROP COLUMN sexo;
ALTER TABLE pigs RENAME COLUMN sexo_new TO sexo;


-- 4. MIGRACIÓN TABLA REPRODUCCION (Columna Temporal + Limpieza)
ALTER TABLE reproduccion ADD COLUMN IF NOT EXISTS estado_new estado_reproduccion;

UPDATE reproduccion SET estado_new = CASE 
    WHEN lower(estado::text) LIKE 'vac%' THEN 'VACIA'::estado_reproduccion
    WHEN lower(estado::text) LIKE 'ges%' THEN 'GESTANTE'::estado_reproduccion
    WHEN lower(estado::text) LIKE 'con%' THEN 'CONFIRMADA'::estado_reproduccion
    WHEN lower(estado::text) LIKE 'par%' THEN 'PARTO_REALIZADO'::estado_reproduccion
    WHEN lower(estado::text) LIKE 'fal%' THEN 'FALLIDA'::estado_reproduccion
    ELSE 'VACIA'::estado_reproduccion -- Default seguro
END;

ALTER TABLE reproduccion DROP COLUMN estado;
ALTER TABLE reproduccion RENAME COLUMN estado_new TO estado;


-- 5. Restaurar la Vista (pigs_v) con los nuevos tipos
CREATE OR REPLACE VIEW pigs_v AS 
SELECT 
    p.id, 
    p.codigo_arete, 
    p.sexo, 
    p.fecha_nacimiento, 
    p.estado, 
    p.peso_actual, 
    p.lote_id, 
    l.nombre AS lote_nombre, 
    p.etapa_id, 
    e.nombre AS etapa_nombre, 
    p.raza_id, 
    r.nombre AS raza_nombre, 
    p.created_at 
FROM pigs p 
LEFT JOIN lotes l ON p.lote_id = l.id 
LEFT JOIN etapas e ON p.etapa_id = e.id 
LEFT JOIN razas r ON p.raza_id = r.id;

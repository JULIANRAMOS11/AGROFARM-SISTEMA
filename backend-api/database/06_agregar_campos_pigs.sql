-- =============================================================================
-- ACTUALIZACIÓN TABLA PIGS - Agregar campos faltantes
-- Ejecuta esto en Supabase SQL Editor
-- =============================================================================

-- Agregar columnas nuevas si no existen
DO $$ 
BEGIN
    -- Columna nombre
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='nombre') THEN
        ALTER TABLE pigs ADD COLUMN nombre VARCHAR(100);
    END IF;
    
    -- Columna raza (texto)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='raza') THEN
        ALTER TABLE pigs ADD COLUMN raza VARCHAR(50);
    END IF;
    
    -- Columna ubicacion
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='ubicacion') THEN
        ALTER TABLE pigs ADD COLUMN ubicacion VARCHAR(100);
    END IF;
    
    -- Columna observaciones
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='observaciones') THEN
        ALTER TABLE pigs ADD COLUMN observaciones TEXT;
    END IF;
END $$;

-- Verificar la estructura
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pigs'
ORDER BY ordinal_position;

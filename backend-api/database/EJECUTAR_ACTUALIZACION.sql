-- =============================================================================
-- 🔧 SCRIPT DE ACTUALIZACIÓN - Ejecuta esto desde VS Code
-- =============================================================================
-- INSTRUCCIONES:
-- 1. Abre la extensión Database Client (ícono de cilindro en la barra lateral)
-- 2. Conéctate a tu base de datos Supabase
-- 3. Haz clic derecho en este archivo → "Run Query"
-- 4. O selecciona todo (Ctrl+A) y presiona Ctrl+E
-- =============================================================================

-- Verificar si las columnas ya existen
SELECT 
    table_name, 
    column_name, 
    data_type,
    character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pigs'
ORDER BY ordinal_position;

-- Agregar columnas si no existen
DO $$ 
BEGIN
    RAISE NOTICE '🔍 Verificando columnas de la tabla pigs...';
    
    -- Columna nombre
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='pigs' AND column_name='nombre'
    ) THEN
        ALTER TABLE pigs ADD COLUMN nombre VARCHAR(100);
        RAISE NOTICE '✅ Columna "nombre" creada';
    ELSE
        RAISE NOTICE '⚠️ Columna "nombre" ya existe';
    END IF;
    
    -- Columna raza
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='pigs' AND column_name='raza'
    ) THEN
        ALTER TABLE pigs ADD COLUMN raza VARCHAR(50);
        RAISE NOTICE '✅ Columna "raza" creada';
    ELSE
        RAISE NOTICE '⚠️ Columna "raza" ya existe';
    END IF;
    
    -- Columna ubicacion
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='pigs' AND column_name='ubicacion'
    ) THEN
        ALTER TABLE pigs ADD COLUMN ubicacion VARCHAR(100);
        RAISE NOTICE '✅ Columna "ubicacion" creada';
    ELSE
        RAISE NOTICE '⚠️ Columna "ubicacion" ya existe';
    END IF;
    
    -- Columna observaciones
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name='pigs' AND column_name='observaciones'
    ) THEN
        ALTER TABLE pigs ADD COLUMN observaciones TEXT;
        RAISE NOTICE '✅ Columna "observaciones" creada';
    ELSE
        RAISE NOTICE '⚠️ Columna "observaciones" ya existe';
    END IF;
    
    RAISE NOTICE '🎉 Actualización completada!';
END $$;

-- Verificar estructura final
SELECT 
    column_name, 
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'pigs'
ORDER BY ordinal_position;

-- Ver datos actuales (primeros 5 registros)
SELECT * FROM pigs LIMIT 5;

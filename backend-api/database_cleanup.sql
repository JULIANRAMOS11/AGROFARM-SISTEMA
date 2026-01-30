/*
  --------------------------------------------------------------------------------
  -- SCRIPT DE LIMPIEZA: DEFENSA EN PROFUNDIDAD (Base de Datos)
  -- AUTOR: Equipo de Desarrollo (SENA)
  -- DESCRIPCIÓN: Elimina los objetos creados previamente para resolver conflictos
  --              de metadata o errores extraños (como 42809) al intentar re-crearlos.
  -- NOTA: Ejecutar este script ANTES del database_migration.sql si hay errores.
  --------------------------------------------------------------------------------
*/

-- 1. ELIMINAR TRIGGERS (Primero, porque dependen de las funciones)
DROP TRIGGER IF EXISTS trg_actualizar_stock ON consumo_alimento;
DROP TRIGGER IF EXISTS trg_check_sexo_reproduccion ON reproduccion;
DROP TRIGGER IF EXISTS trg_validar_parto_logico ON partos;

-- 2. ELIMINAR FUNCIONES TRIGGERS
DROP FUNCTION IF EXISTS fn_gestionar_stock_consumo();
DROP FUNCTION IF EXISTS fn_validar_reproduccion_sexo();
DROP FUNCTION IF EXISTS fn_validar_parto_estado();

-- 3. ELIMINAR CHECK CONSTRAINTS (Si ya existen)
-- Nota: PostgreSQL no tiene IF EXISTS directo para constraints en ALTER TABLE,
-- por lo que usamos un bloque anónimo para intentar borrarlos sin fallar.
DO $$ 
BEGIN
    ALTER TABLE produccion DROP CONSTRAINT IF EXISTS check_produccion_valores_positivos;
    ALTER TABLE produccion DROP CONSTRAINT IF EXISTS check_produccion_fecha_valida;
    ALTER TABLE consumo_alimento DROP CONSTRAINT IF EXISTS check_consumo_cantidad_positiva;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignorar errores si no existen las tablas o constraints
END $$;

-- 4. LOS TIPOS ENUM NO SE BORRAN (Es peligroso si hay datos usándolos).
--    Solo borramos los objetos lógicos.

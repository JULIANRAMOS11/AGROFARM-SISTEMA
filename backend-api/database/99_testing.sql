/*
  --------------------------------------------------------------------------------
  -- PRUEBA DE FUEGO: VALIDACIÓN DE BLINDAJE
  -- DESCRIPCIÓN: Intenta ejecutar operaciones ILEGALES.
  -- RESULTADO ESPERADO: Todas deben fallar con un mensaje de error claro.
  --------------------------------------------------------------------------------
*/

-- PRUEBA 1: Integridad Numérica
-- Intenta insertar un peso negativo.
-- ESPERADO: ERROR: new row for relation "produccion" violates check constraint "check_produccion_valores_positivos"
INSERT INTO produccion (pig_id, fecha, peso, edad_dias)
SELECT id, CURRENT_DATE, -50, 100 FROM pigs LIMIT 1;


-- PRUEBA 2: Viajeros del Tiempo
-- Intenta insertar una fecha futura.
-- ESPERADO: ERROR: ... violates check constraint "check_produccion_fecha_valida"
INSERT INTO produccion (pig_id, fecha, peso, edad_dias)
SELECT id, '2030-01-01', 50, 100 FROM pigs LIMIT 1;


-- PRUEBA 3: Vigilante de Stock
-- Intenta consumir 1 tonelada de alimento (asumiendo que no tienes tanto stock).
-- ESPERADO: ERROR: Stock insuficiente para "Nombre Alimento"...
INSERT INTO consumo_alimento (pig_id, alimento_id, fecha, cantidad_kg)
SELECT 
    (SELECT id FROM pigs LIMIT 1), 
    (SELECT id FROM alimentacion LIMIT 1), 
    CURRENT_DATE, 
    10000;


-- PRUEBA 4: Biología Porcina
-- Intenta registrar un servicio a un Macho (si tienes alguno).
-- ESPERADO: ERROR: Solo se pueden registrar servicios a cerdas (Hembras).
INSERT INTO reproduccion (pig_id, tipo_servicio, fecha_servicio, estado)
SELECT id, 'MONTA_NATURAL', CURRENT_DATE, 'GESTANTE' 
FROM pigs WHERE sexo = 'Macho' LIMIT 1;

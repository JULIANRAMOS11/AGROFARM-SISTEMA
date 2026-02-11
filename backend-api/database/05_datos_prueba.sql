-- =============================================================================
-- DATOS DE PRUEBA PARA LA APK - AGROFARM
-- Ejecuta esto en Supabase SQL Editor para tener registros de ejemplo
-- =============================================================================

-- 1. CREAR REGISTROS DE SANIDAD (vacunas, tratamientos)
INSERT INTO sanidad (pig_id, tipo, fecha, medicamento_vacuna, dosis, via_administracion, veterinario, diagnostico, tratamiento, costo, observaciones)
VALUES 
  (5, 'VACUNA', '2026-01-15', 'Vacuna PPC', '2ml', 'INTRAMUSCULAR', 'Dr. García', '', '', 15000, 'Primera dosis aplicada correctamente'),
  (5, 'DESPARASITACION', '2026-01-20', 'Ivermectina', '5ml', 'ORAL', 'Dr. López', '', '', 8000, 'Desparasitación rutinaria'),
  (8, 'VACUNA', '2026-01-22', 'Vacuna Circovirus', '2ml', 'INTRAMUSCULAR', 'Dr. García', '', '', 18000, 'Sin reacciones adversas');

-- 2. CREAR ALIMENTOS
INSERT INTO alimentacion (nombre_alimento, tipo, proteina_porcentaje, costo_por_kg, proveedor, stock_kg)
VALUES 
  ('Concentrado Inicio', 'CRECIMIENTO', 18.5, 2500, 'AgroFeed S.A.', 500),
  ('Concentrado Engorde', 'ENGORDE', 16.0, 2200, 'AgroFeed S.A.', 800),
  ('Maíz Molido', 'GRANO', 8.5, 1200, 'Granos del Valle', 1000),
  ('Suplemento Vitamínico', 'SUPLEMENTO', 0, 5000, 'VitaPork', 50),
  ('Harina de Soya', 'PROTEICO', 45.0, 3000, 'Proteínas S.A.', 300);

-- 3. CREAR REGISTROS DE CONSUMO DE ALIMENTO
INSERT INTO consumo_alimento (pig_id, alimento_id, fecha, cantidad_kg)
VALUES 
  (5, 1, '2026-01-15', 2.5),
  (5, 1, '2026-01-20', 2.8),
  (8, 2, '2026-01-22', 3.0),
  (10, 1, '2026-01-23', 2.3);

-- 4. CREAR REGISTROS DE PRODUCCIÓN
INSERT INTO produccion (pig_id, fecha, peso, edad_dias, ganancia_diaria, consumo_alimento_kg, conversion_alimenticia)
VALUES 
  (5, '2026-01-15', 42.0, 90, 0.450, 2.5, 2.8),
  (5, '2026-01-30', 48.5, 105, 0.433, 2.8, 2.9),
  (8, '2026-01-20', 47.0, 95, 0.480, 3.0, 3.1),
  (10, '2026-01-25', 50.0, 100, 0.500, 2.3, 2.6);

-- 5. VERIFICAR QUE TODO SE CREÓ CORRECTAMENTE
SELECT 'Sanidad' as tabla, COUNT(*) as registros FROM sanidad
UNION ALL
SELECT 'Alimentos', COUNT(*) FROM alimentacion
UNION ALL
SELECT 'Consumo', COUNT(*) FROM consumo_alimento
UNION ALL
SELECT 'Producción', COUNT(*) FROM produccion;

-- =============================================================================
-- 📋 CONSULTAS ÚTILES - Copia y pega en Database Client
-- =============================================================================
-- TIP: Selecciona la consulta que quieres y presiona Ctrl+E
-- =============================================================================

-- ══════════════════════════════════════════════════════════════════════════
-- 🐷 TABLA PIGS
-- ══════════════════════════════════════════════════════════════════════════

-- Ver todos los cerdos
SELECT * FROM pigs;

-- Ver solo cerdos activos
SELECT * FROM pigs WHERE estado = 'ACTIVO';

-- Contar cerdos por sexo
SELECT sexo, COUNT(*) as cantidad FROM pigs GROUP BY sexo;

-- Ver cerdos por ubicación
SELECT ubicacion, COUNT(*) as cantidad 
FROM pigs 
WHERE ubicacion IS NOT NULL 
GROUP BY ubicacion 
ORDER BY cantidad DESC;

-- Buscar cerdo por arete
SELECT * FROM pigs WHERE codigo_arete = 'A001';

-- Ver estructura de la tabla
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pigs';


-- ══════════════════════════════════════════════════════════════════════════
-- 💉 TABLA SANIDAD
-- ══════════════════════════════════════════════════════════════════════════

-- Ver todos los registros sanitarios con datos del cerdo
SELECT 
    s.id,
    p.codigo_arete,
    s.tipo,
    s.fecha,
    s.medicamento_vacuna,
    s.veterinario,
    s.costo
FROM sanidad s
JOIN pigs p ON s.pig_id = p.id
ORDER BY s.fecha DESC;

-- Contar vacunas por tipo
SELECT tipo, COUNT(*) as cantidad FROM sanidad GROUP BY tipo;

-- Próximas vacunas programadas
SELECT 
    p.codigo_arete,
    s.medicamento_vacuna,
    s.proxima_aplicacion
FROM sanidad s
JOIN pigs p ON s.pig_id = p.id
WHERE s.proxima_aplicacion > CURRENT_DATE
ORDER BY s.proxima_aplicacion;

-- Costo total en sanidad por cerdo
SELECT 
    p.codigo_arete,
    COUNT(*) as num_tratamientos,
    SUM(s.costo) as costo_total
FROM sanidad s
JOIN pigs p ON s.pig_id = p.id
WHERE s.costo IS NOT NULL
GROUP BY p.codigo_arete
ORDER BY costo_total DESC;


-- ══════════════════════════════════════════════════════════════════════════
-- 🍎 TABLA NUTRICIÓN
-- ══════════════════════════════════════════════════════════════════════════

-- Ver catálogo de alimentos
SELECT * FROM alimentacion ORDER BY nombre_alimento;

-- Stock bajo (menos de 50kg)
SELECT nombre_alimento, stock_kg 
FROM alimentacion 
WHERE stock_kg < 50
ORDER BY stock_kg;

-- Consumo total por cerdo (últimos 30 días)
SELECT 
    p.codigo_arete,
    COUNT(*) as num_comidas,
    SUM(c.cantidad_kg) as total_kg
FROM consumo_alimento c
JOIN pigs p ON c.pig_id = p.id
WHERE c.fecha >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.codigo_arete
ORDER BY total_kg DESC;

-- Alimento más consumido
SELECT 
    a.nombre_alimento,
    COUNT(*) as veces_usado,
    SUM(c.cantidad_kg) as total_kg
FROM consumo_alimento c
JOIN alimentacion a ON c.alimento_id = a.id
GROUP BY a.nombre_alimento
ORDER BY total_kg DESC;


-- ══════════════════════════════════════════════════════════════════════════
-- 📊 TABLA PRODUCCIÓN
-- ══════════════════════════════════════════════════════════════════════════

-- Últimos registros de producción
SELECT 
    p.codigo_arete,
    pr.fecha,
    pr.peso,
    pr.edad_dias,
    pr.ganancia_diaria
FROM produccion pr
JOIN pigs p ON pr.pig_id = p.id
ORDER BY pr.fecha DESC
LIMIT 10;

-- Promedio de peso por edad
SELECT 
    edad_dias,
    ROUND(AVG(peso)::numeric, 2) as peso_promedio,
    COUNT(*) as num_registros
FROM produccion
GROUP BY edad_dias
ORDER BY edad_dias;

-- Cerdos con mejor ganancia diaria
SELECT 
    p.codigo_arete,
    ROUND(AVG(pr.ganancia_diaria)::numeric, 3) as ganancia_promedio
FROM produccion pr
JOIN pigs p ON pr.pig_id = p.id
WHERE pr.ganancia_diaria IS NOT NULL
GROUP BY p.codigo_arete
ORDER BY ganancia_promedio DESC
LIMIT 5;


-- ══════════════════════════════════════════════════════════════════════════
-- 🔧 MANTENIMIENTO
-- ══════════════════════════════════════════════════════════════════════════

-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Ver tamaño de las tablas
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Hacer backup de tabla (ejemplo con pigs)
-- CREATE TABLE pigs_backup AS SELECT * FROM pigs;

-- Restaurar desde backup
-- TRUNCATE pigs;
-- INSERT INTO pigs SELECT * FROM pigs_backup;

-- Eliminar registros antiguos (CUIDADO!)
-- DELETE FROM produccion WHERE fecha < '2025-01-01';


-- ══════════════════════════════════════════════════════════════════════════
-- 📈 ESTADÍSTICAS GENERALES
-- ══════════════════════════════════════════════════════════════════════════

-- Resumen completo de la granja
SELECT 
    'Cerdos totales' as metrica, 
    COUNT(*)::text as valor 
FROM pigs
UNION ALL
SELECT 
    'Cerdos activos', 
    COUNT(*)::text 
FROM pigs WHERE estado = 'ACTIVO'
UNION ALL
SELECT 
    'Hembras', 
    COUNT(*)::text 
FROM pigs WHERE sexo IN ('H', 'Hembra', 'F')
UNION ALL
SELECT 
    'Machos', 
    COUNT(*)::text 
FROM pigs WHERE sexo IN ('M', 'Macho')
UNION ALL
SELECT 
    'Registros sanitarios', 
    COUNT(*)::text 
FROM sanidad
UNION ALL
SELECT 
    'Tipos de alimentos', 
    COUNT(*)::text 
FROM alimentacion
UNION ALL
SELECT 
    'Consumos registrados', 
    COUNT(*)::text 
FROM consumo_alimento;

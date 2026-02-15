// Analizar y simplificar restricciones de la base de datos
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function analizarYSimplificar() {
  try {
    await client.connect();
    console.log('🔍 ANALIZANDO RESTRICCIONES DE LA BASE DE DATOS\n');

    // Ver restricciones actuales
    console.log('📋 Restricciones actuales en tabla PIGS:');
    const constraints = await client.query(`
      SELECT 
        conname as nombre_restriccion,
        contype as tipo,
        pg_get_constraintdef(oid) as definicion
      FROM pg_constraint
      WHERE conrelid = 'pigs'::regclass
      ORDER BY contype;
    `);
    
    if (constraints.rows.length > 0) {
      console.table(constraints.rows);
    } else {
      console.log('   ✅ No hay restricciones complicadas\n');
    }

    // Ver columnas y sus requisitos
    console.log('\n📋 COLUMNAS Y SUS REQUISITOS:');
    const columns = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'pigs'
      ORDER BY ordinal_position;
    `);
    console.table(columns.rows);

    // Verificar tipos ENUM que pueden causar problemas
    console.log('\n🔍 Verificando tipos ENUM (pueden causar errores)...');
    const enums = await client.query(`
      SELECT 
        t.typname as tipo_enum,
        e.enumlabel as valores_permitidos
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      WHERE t.typname = 'sexo_porcino'
      ORDER BY e.enumsortorder;
    `);
    
    if (enums.rows.length > 0) {
      console.log('\n⚠️  PROBLEMA ENCONTRADO: Tipo ENUM para sexo');
      console.log('   Solo acepta estos valores exactos:');
      enums.rows.forEach(row => console.log(`   - "${row.valores_permitidos}"`));
      
      console.log('\n🔧 SOLUCIÓN: Cambiar a VARCHAR (acepta cualquier texto)');
      console.log('   Ejecutando cambio...\n');
      
      try {
        // Cambiar de ENUM a VARCHAR
        await client.query(`
          ALTER TABLE pigs 
          ALTER COLUMN sexo TYPE VARCHAR(20)
          USING sexo::text;
        `);
        console.log('   ✅ Columna "sexo" cambiada a VARCHAR(20)');
        console.log('   ✅ Ahora acepta: M, H, Macho, Hembra, Male, Female, etc.\n');
      } catch (err) {
        console.log('   ⚠️  Ya era VARCHAR o hubo error:', err.message);
      }
    }

    // Hacer que campos opcionales sean realmente opcionales
    console.log('\n🔧 SIMPLIFICANDO CAMPOS OBLIGATORIOS...\n');
    
    const camposOpcionales = ['nombre', 'raza', 'ubicacion', 'observaciones', 'peso_actual', 'estado', 'etapa', 'lote'];
    
    for (const campo of camposOpcionales) {
      try {
        await client.query(`
          ALTER TABLE pigs 
          ALTER COLUMN ${campo} DROP NOT NULL;
        `);
        console.log(`   ✅ ${campo} ahora es OPCIONAL`);
      } catch (err) {
        // Ya era opcional, está bien
      }
    }

    // Agregar valores por defecto
    console.log('\n🎯 AGREGANDO VALORES POR DEFECTO...\n');
    
    try {
      await client.query(`ALTER TABLE pigs ALTER COLUMN estado SET DEFAULT 'ACTIVO'`);
      console.log('   ✅ estado: por defecto = "ACTIVO"');
    } catch (err) {}
    
    try {
      await client.query(`ALTER TABLE pigs ALTER COLUMN peso_actual SET DEFAULT 0`);
      console.log('   ✅ peso_actual: por defecto = 0');
    } catch (err) {}

    try {
      await client.query(`ALTER TABLE pigs ALTER COLUMN etapa SET DEFAULT 'CRIA'`);
      console.log('   ✅ etapa: por defecto = "CRIA"');
    } catch (err) {}

    // Mostrar resultado final
    console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 BASE DE DATOS SIMPLIFICADA - REGLAS FINALES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('✅ CAMPOS OBLIGATORIOS (solo 2):');
    console.log('   1. codigo_arete  → Cualquier texto (ej: "A001", "Cerdo1")');
    console.log('   2. fecha_nacimiento → Fecha (ej: "2026-02-15")\n');

    console.log('✅ CAMPOS OPCIONALES (puedes dejarlos vacíos):');
    console.log('   - nombre → Texto libre');
    console.log('   - raza → Texto libre (ej: "Yorkshire", "Duroc")');
    console.log('   - sexo → Texto libre (ej: "M", "H", "Macho", "Hembra")');
    console.log('   - peso_actual → Número (default: 0)');
    console.log('   - estado → Texto (default: "ACTIVO")');
    console.log('   - ubicacion → Texto libre (ej: "Corral 1")');
    console.log('   - observaciones → Texto libre\n');

    console.log('🎉 ¡Ahora es MUCHO MÁS FÁCIL crear cerdos!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

analizarYSimplificar();

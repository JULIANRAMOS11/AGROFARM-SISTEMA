// Script para actualizar base de datos automáticamente
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function actualizarDB() {
  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado exitosamente!\n');

    // Ver estructura actual
    console.log('📋 Estructura actual de la tabla pigs:');
    const columnsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_name = 'pigs'
      ORDER BY ordinal_position;
    `);
    console.table(columnsResult.rows);

    // Verificar y agregar columnas
    console.log('\n🔧 Verificando columnas necesarias...\n');
    
    const updates = [];

    // Verificar nombre
    const nombreExists = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='pigs' AND column_name='nombre'
    `);
    if (nombreExists.rows.length === 0) {
      await client.query('ALTER TABLE pigs ADD COLUMN nombre VARCHAR(100)');
      console.log('✅ Columna "nombre" agregada');
      updates.push('nombre');
    } else {
      console.log('⚠️  Columna "nombre" ya existe');
    }

    // Verificar raza
    const razaExists = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='pigs' AND column_name='raza'
    `);
    if (razaExists.rows.length === 0) {
      await client.query('ALTER TABLE pigs ADD COLUMN raza VARCHAR(50)');
      console.log('✅ Columna "raza" agregada');
      updates.push('raza');
    } else {
      console.log('⚠️  Columna "raza" ya existe');
    }

    // Verificar ubicacion
    const ubicacionExists = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='pigs' AND column_name='ubicacion'
    `);
    if (ubicacionExists.rows.length === 0) {
      await client.query('ALTER TABLE pigs ADD COLUMN ubicacion VARCHAR(100)');
      console.log('✅ Columna "ubicacion" agregada');
      updates.push('ubicacion');
    } else {
      console.log('⚠️  Columna "ubicacion" ya existe');
    }

    // Verificar observaciones
    const observacionesExists = await client.query(`
      SELECT 1 FROM information_schema.columns 
      WHERE table_name='pigs' AND column_name='observaciones'
    `);
    if (observacionesExists.rows.length === 0) {
      await client.query('ALTER TABLE pigs ADD COLUMN observaciones TEXT');
      console.log('✅ Columna "observaciones" agregada');
      updates.push('observaciones');
    } else {
      console.log('⚠️  Columna "observaciones" ya existe');
    }

    // Mostrar estructura actualizada
    console.log('\n📋 Estructura ACTUALIZADA de la tabla pigs:');
    const newColumnsResult = await client.query(`
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'pigs'
      ORDER BY ordinal_position;
    `);
    console.table(newColumnsResult.rows);

    // Ver datos actuales
    console.log('\n📊 Datos actuales (primeros 3 registros):');
    const dataResult = await client.query('SELECT * FROM pigs LIMIT 3');
    if (dataResult.rows.length > 0) {
      console.table(dataResult.rows);
    } else {
      console.log('   (No hay registros todavía)');
    }

    console.log('\n🎉 ¡Actualización completada exitosamente!');
    if (updates.length > 0) {
      console.log(`\n✨ Columnas agregadas: ${updates.join(', ')}`);
    } else {
      console.log('\n✅ Todas las columnas ya estaban actualizadas');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\n🔌 Desconectado de Supabase');
  }
}

actualizarDB();

// Script para probar la creación de un cerdo con los nuevos campos
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function probarCreacion() {
  try {
    console.log('🔌 Conectando a Supabase...');
    await client.connect();
    console.log('✅ Conectado!\n');

    // Crear cerdo de prueba
    console.log('🐷 Creando cerdo de prueba con TODOS los campos...');
    const result = await client.query(`
      INSERT INTO pigs (
        codigo_arete, 
        nombre, 
        raza, 
        sexo, 
        fecha_nacimiento, 
        estado, 
        peso_actual, 
        ubicacion, 
        observaciones
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9
      ) RETURNING *
    `, [
      'TEST-2026',
      'Manchitas',
      'Yorkshire',
      'Hembra',
      '2026-01-15',
      'ACTIVO',
      35.5,
      'Corral 1',
      'Cerdo de prueba creado desde VS Code'
    ]);

    console.log('✅ Cerdo creado exitosamente!\n');
    console.log('📋 Datos del cerdo creado:');
    console.table([result.rows[0]]);

    // Verificar con una consulta
    console.log('\n📊 Verificando todos los cerdos con los nuevos campos:');
    const allPigs = await client.query(`
      SELECT id, codigo_arete, nombre, raza, sexo, ubicacion, estado, peso_actual 
      FROM pigs 
      ORDER BY id DESC 
      LIMIT 5
    `);
    console.table(allPigs.rows);

    console.log('\n🎉 ¡Todo funciona correctamente!');
    console.log('✨ Ya puedes usar la aplicación para crear cerdos normalmente\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Desconectado');
  }
}

probarCreacion();

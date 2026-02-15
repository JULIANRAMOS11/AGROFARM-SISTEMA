// Demostración: Los cambios aquí = cambios en Supabase
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function demostrar() {
  try {
    await client.connect();
    console.log('🔌 CONECTADO A SUPABASE (EN LA NUBE)\n');

    // 1. Crear un cerdo único con timestamp
    const timestamp = new Date().toLocaleString('es-CO');
    console.log(`🆕 Creando cerdo desde VS Code a las ${timestamp}...`);
    
    const result = await client.query(`
      INSERT INTO pigs (
        codigo_arete, nombre, raza, sexo, fecha_nacimiento, 
        estado, peso_actual, ubicacion, observaciones
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, codigo_arete, nombre, created_at
    `, [
      `DEMO-${Date.now()}`,
      'Prueba Real',
      'Duroc',
      'Macho',
      '2026-02-15',
      'ACTIVO',
      40.0,
      'Galpón A',
      `Creado desde VS Code el ${timestamp}`
    ]);

    console.log('✅ Cerdo creado en Supabase!');
    console.log(`   ID: ${result.rows[0].id}`);
    console.log(`   Arete: ${result.rows[0].codigo_arete}`);
    console.log(`   Nombre: ${result.rows[0].nombre}\n`);

    // 2. Verificar que existe en Supabase
    console.log('🔍 Verificando en la base de datos de Supabase...');
    const verificar = await client.query(
      'SELECT * FROM pigs WHERE id = $1',
      [result.rows[0].id]
    );

    if (verificar.rows.length > 0) {
      console.log('✅ ¡CONFIRMADO! El cerdo está en Supabase:\n');
      console.table([{
        ID: verificar.rows[0].id,
        Arete: verificar.rows[0].codigo_arete,
        Nombre: verificar.rows[0].nombre,
        Raza: verificar.rows[0].raza,
        Ubicación: verificar.rows[0].ubicacion,
        Estado: verificar.rows[0].estado
      }]);
    }

    // 3. Contar total de cerdos
    const count = await client.query('SELECT COUNT(*) FROM pigs');
    console.log(`\n📊 Total de cerdos en Supabase: ${count.rows[0].count}`);

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 CONCLUSIÓN:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Los cambios desde VS Code = Cambios en Supabase');
    console.log('✅ NO es una copia local, es la nube real');
    console.log('✅ Si abres Supabase Dashboard, verás este cerdo');
    console.log('✅ Si usas tu app web, también lo verás');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🌐 Para verificarlo tú mismo:');
    console.log('1. Ve a: https://supabase.com/dashboard');
    console.log('2. Abre tu proyecto AGROFARM');
    console.log('3. Ve a: Table Editor → pigs');
    console.log(`4. Busca el cerdo con arete: ${result.rows[0].codigo_arete}`);
    console.log('5. ¡Ahí estará! 🎉\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
    console.log('🔌 Desconectado de Supabase');
  }
}

demostrar();

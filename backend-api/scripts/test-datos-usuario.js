// Probar exactamente con los datos que el usuario está poniendo
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function probarDatosUsuario() {
  try {
    await client.connect();
    console.log('🔍 PROBANDO CON EXACTAMENTE TUS DATOS...\n');

    // Intentar 1: Con "macho" minúscula (como lo escribiste)
    console.log('🧪 Test 1: Con sexo = "macho" (minúscula)');
    try {
      await client.query(`
        INSERT INTO pigs (codigo_arete, nombre, raza, sexo, fecha_nacimiento, peso_actual, ubicacion, observaciones)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, ['cerdo 01', 'piorky', 'cualquera', 'macho', '2026-02-15', 17, 'cualquiera', 'ninguna']);
      console.log('   ✅ FUNCIONÓ!\n');
    } catch (err) {
      console.log('   ❌ ERROR:', err.message);
      console.log('   📍 Problema encontrado!\n');
    }

    // Intentar 2: Con "Macho" mayúscula (correcto)
    console.log('🧪 Test 2: Con sexo = "Macho" (mayúscula inicial)');
    try {
      const result = await client.query(`
        INSERT INTO pigs (codigo_arete, nombre, raza, sexo, fecha_nacimiento, peso_actual, ubicacion, observaciones)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `, ['cerdo 01 CORRECTO', 'piorky', 'cualquera', 'Macho', '2026-02-15', 17, 'cualquiera', 'ninguna']);
      console.log('   ✅ FUNCIONÓ!');
      console.log('   📊 Cerdo creado:');
      console.table([{
        Arete: result.rows[0].codigo_arete,
        Nombre: result.rows[0].nombre,
        Raza: result.rows[0].raza,
        Sexo: result.rows[0].sexo,
        Peso: result.rows[0].peso_actual
      }]);
    } catch (err) {
      console.log('   ❌ ERROR:', err.message);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 DIAGNÓSTICO:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 DATOS QUE PUSISTE:');
    console.log('   arete: "cerdo 01" ✅');
    console.log('   nombre: "piorky" ✅');
    console.log('   raza: "cualquera" ✅');
    console.log('   sexo: "macho" ❌ (ESTE ES EL PROBLEMA)');
    console.log('   fecha: "2026-02-15" ✅');
    console.log('   peso: 17 ✅');
    console.log('   ubicacion: "cualquiera" ✅');
    console.log('   observaciones: "ninguna" ✅\n');

    console.log('❗ PROBLEMA ENCONTRADO:');
    console.log('   El campo "sexo" solo acepta EXACTAMENTE:');
    console.log('   → "Macho" (con M mayúscula)');
    console.log('   → "Hembra" (con H mayúscula)\n');
    
    console.log('   Tú escribiste: "macho" (todo minúscula)');
    console.log('   Por eso da error!\n');

    console.log('✅ SOLUCIÓN:');
    console.log('   Usa el DROPDOWN del formulario');
    console.log('   NO escribas nada a mano');
    console.log('   Solo haz click en: 🐗 Macho o 🐷 Hembra\n');

    // Verificar el frontend
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 VERIFICANDO EL FORMULARIO...\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

probarDatosUsuario();

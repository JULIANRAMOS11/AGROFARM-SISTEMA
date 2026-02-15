// GUÍA COMPLETA: Cómo llenar cada campo para crear un cerdo
import pg from 'pg';
const { Client } = pg;

const client = new Client({
  connectionString: "postgresql://postgres.krjddrckutmwvjceakpf:AgroFarm2026_DB_Julian@aws-1-us-east-1.pooler.supabase.com:6543/postgres"
});

async function crearEjemplos() {
  try {
    await client.connect();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📚 GUÍA COMPLETA: CÓMO CREAR UN CERDO SIN ERRORES');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('🔴 CAMPOS OBLIGATORIOS (no pueden estar vacíos):\n');
    console.log('1️⃣  codigo_arete (Identificador del cerdo)');
    console.log('   ✅ BIEN: "A001", "CERDO-1", "Juan123", "MACHO-001"');
    console.log('   ❌ MAL: Dejar vacío, poner espacios solos');
    console.log('   ⚠️  IMPORTANTE: Debe ser ÚNICO (no repetir)\n');

    console.log('2️⃣  fecha_nacimiento (Fecha de nacimiento)');
    console.log('   ✅ BIEN: "2026-02-15", "2025-12-25"');
    console.log('   ❌ MAL: "15/02/2026", "ayer", texto\n');

    console.log('3️⃣  sexo (Solo acepta 2 valores EXACTOS)');
    console.log('   ✅ BIEN: "Macho" o "Hembra" (con mayúscula inicial)');
    console.log('   ❌ MAL: "M", "H", "Male", "macho", "MACHO"\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🟢 CAMPOS OPCIONALES (puedes dejarlos vacíos o llenarlos):\n');
    
    console.log('4️⃣  nombre');
    console.log('   ✅ Cualquier texto: "Manchitas", "Cerdo #1", "Roberto"\n');
    
    console.log('5️⃣  raza');
    console.log('   ✅ Cualquier texto: "Yorkshire", "Duroc", "Mestizo"\n');
    
    console.log('6️⃣  peso_actual');
    console.log('   ✅ Número: 45.5, 30, 100.25');
    console.log('   ⚠️  Si lo dejas vacío, se pone 0 automáticamente\n');
    
    console.log('7️⃣  estado');
    console.log('   ✅ Cualquier texto: "ACTIVO", "INACTIVO"');
    console.log('   ⚠️  Si lo dejas vacío, se pone "ACTIVO" automáticamente\n');
    
    console.log('8️⃣  ubicacion');
    console.log('   ✅ Cualquier texto: "Corral 1", "Galpón A"\n');
    
    console.log('9️⃣  observaciones');
    console.log('   ✅ Cualquier texto: "Enfermo", "Vacunado ayer"\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🎯 EJEMPLOS REALES QUE FUNCIONAN:\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📝 EJEMPLO 1: Mínimo necesario (solo obligatorios)');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('codigo_arete: "CERDO-100"');
    console.log('fecha_nacimiento: "2026-02-15"');
    console.log('sexo: "Macho"');
    console.log('(Los demás campos se llenan automáticamente)\n');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('📝 EJEMPLO 2: Completo');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('codigo_arete: "DUROC-001"');
    console.log('nombre: "Pepito"');
    console.log('raza: "Duroc"');
    console.log('sexo: "Macho"');
    console.log('fecha_nacimiento: "2026-01-10"');
    console.log('peso_actual: 55.5');
    console.log('estado: "ACTIVO"');
    console.log('ubicacion: "Corral 3"');
    console.log('observaciones: "Comprado en feria"\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('🧪 PROBANDO CREAR CERDOS CON DIFERENTES FORMATOS...\n');

    // Ejemplo 1: Mínimo
    console.log('🐷 Test 1: Solo campos obligatorios...');
    try {
      const test1 = await client.query(`
        INSERT INTO pigs (codigo_arete, fecha_nacimiento, sexo)
        VALUES ($1, $2, $3)
        RETURNING codigo_arete, nombre, raza, sexo, peso_actual, estado
      `, ['TEST-MINIMO', '2026-02-10', 'Macho']);
      
      console.log('   ✅ ÉXITO! Cerdo creado:');
      console.table(test1.rows);
    } catch (err) {
      console.log('   ❌ ERROR:', err.message);
    }

    // Ejemplo 2: Con nombre y raza
    console.log('\n🐷 Test 2: Con nombre y raza...');
    try {
      const test2 = await client.query(`
        INSERT INTO pigs (codigo_arete, nombre, raza, fecha_nacimiento, sexo)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING codigo_arete, nombre, raza, sexo
      `, ['TEST-CON-NOMBRE', 'Juancho', 'Yorkshire', '2026-02-12', 'Hembra']);
      
      console.log('   ✅ ÉXITO! Cerdo creado:');
      console.table(test2.rows);
    } catch (err) {
      console.log('   ❌ ERROR:', err.message);
    }

    // Ejemplo 3: Todo completo
    console.log('\n🐷 Test 3: Todo completo...');
    try {
      const test3 = await client.query(`
        INSERT INTO pigs (
          codigo_arete, nombre, raza, sexo, fecha_nacimiento,
          peso_actual, estado, ubicacion, observaciones
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `, [
        'TEST-COMPLETO',
        'Lola',
        'Duroc',
        'Hembra',
        '2026-01-20',
        42.3,
        'ACTIVO',
        'Galpón B',
        'Cerdo de prueba completo'
      ]);
      
      console.log('   ✅ ÉXITO! Cerdo creado:\n');
      const display = {
        'Arete': test3.rows[0].codigo_arete,
        'Nombre': test3.rows[0].nombre,
        'Raza': test3.rows[0].raza,
        'Sexo': test3.rows[0].sexo,
        'Peso': test3.rows[0].peso_actual,
        'Ubicación': test3.rows[0].ubicacion,
        'Estado': test3.rows[0].estado
      };
      console.table([display]);
    } catch (err) {
      console.log('   ❌ ERROR:', err.message);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('❗ ERRORES COMUNES Y CÓMO EVITARLOS');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('🚫 Error: "duplicate key value"');
    console.log('   → Ya existe un cerdo con ese codigo_arete');
    console.log('   → Solución: Usa otro código único\n');
    
    console.log('🚫 Error: "invalid input value for enum sexo_porcino"');
    console.log('   → Escribiste el sexo mal');
    console.log('   → Solución: Usa exactamente "Macho" o "Hembra"\n');
    
    console.log('🚫 Error: "null value in column"');
    console.log('   → Falta un campo obligatorio');
    console.log('   → Solución: Llena codigo_arete, fecha_nacimiento y sexo\n');
    
    console.log('🚫 Error: "invalid input syntax for type date"');
    console.log('   → La fecha está mal escrita');
    console.log('   → Solución: Usa formato AAAA-MM-DD (2026-02-15)\n');

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ ¡Ahora ya sabes cómo crear cerdos sin errores!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    await client.end();
  }
}

crearEjemplos();

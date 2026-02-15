# 🎯 INSTRUCCIONES: CARGAR DATOS PROFESIONALES EN SUPABASE

## 📋 Pasos para ejecutar el script

### 1️⃣ Acceder a Supabase

1. Ve a: https://supabase.com/dashboard
2. Inicia sesión
3. Selecciona tu proyecto **AGROFARM**
4. En el menú lateral, haz clic en **"SQL Editor"** (ícono de base de datos)

### 2️⃣ Ejecutar el Script

1. Abre el archivo: `backend-api\database\DATOS_PROFESIONALES_COMPLETOS.sql`
2. **Copia TODO el contenido** (Ctrl+A → Ctrl+C)
3. En Supabase SQL Editor, pega el contenido completo
4. Haz clic en el botón **"Run"** (▶️) abajo a la derecha
5. Espera 10-15 segundos (el script cargará ~150 registros)

### 3️⃣ Verificar los Datos

Ejecuta estas consultas para verificar:

```sql
-- Ver todos los cerdos (debería mostrar 23 cerdos)
SELECT codigo_arete, nombre, sexo, raza, peso_actual, ubicacion 
FROM pigs 
ORDER BY codigo_arete;

-- Ver alimentos (debería mostrar 13 productos)
SELECT nombre, tipo, stock_kg, precio_por_kg 
FROM alimentos 
ORDER BY tipo, nombre;

-- Ver consumos recientes (debería mostrar ~30 registros)
SELECT c.fecha, p.nombre, p.codigo_arete, a.nombre as alimento, c.cantidad_kg
FROM consumos c
JOIN pigs p ON c.pig_id = p.id
JOIN alimentos a ON c.alimento_id = a.id
ORDER BY c.fecha DESC
LIMIT 20;

-- Ver registros de sanidad (debería mostrar ~25 registros)
SELECT s.tipo_registro, s.fecha, p.nombre, p.codigo_arete, s.medicamento
FROM sanidad s
JOIN pigs p ON s.pig_id = p.id
ORDER BY s.fecha DESC;

-- Ver producción (debería mostrar ~20 registros de pesos)
SELECT prod.fecha, p.nombre, p.codigo_arete, prod.peso_kg, prod.notas
FROM produccion prod
JOIN pigs p ON prod.pig_id = p.id
ORDER BY p.codigo_arete, prod.fecha;

-- Ver reproducción (debería mostrar ~13 registros)
SELECT * FROM reproduccion ORDER BY fecha_monta DESC;
```

### 4️⃣ Datos Incluidos

#### 🐷 **23 CERDOS ORGANIZADOS:**
- **3 Verracos** (Zeus, Thor, Apollo) - Reproductores machos
- **5 Cerdas** (Luna, Estrella, Diana, Venus, Aurora) - Reproductoras
- **5 Lechones** (Simba, Nala, Mufasa, Pumba, Timón) - En destete
- **5 Engorde** (Rambo, Rocky, Bella, Max, Rex) - Fase de crecimiento
- **3 Finalizadores** (Titan, Hércules, Goliath) - Listos para venta

#### 🍽️ **13 ALIMENTOS:**
- 4 Concentrados (Inicio, Levante, Engorde, Finalización)
- 3 Balanceados (Gestación, Lactancia, Reproductores)
- 2 Forrajes (King Grass, Alfalfa)
- 2 Suplementos (Vitamínico, Aminoácidos)
- 2 Vitaminas (Complejo B, AD3E)

#### 📊 **REGISTROS SINCRONIZADOS:**
- **~30 Consumos** de alimento (últimos días)
- **~25 Registros Sanidad** (vacunas, tratamientos, diagnósticos)
- **~20 Registros Producción** (evolución de pesos)
- **~13 Registros Reproducción** (montas y partos)

### 5️⃣ Características de los Datos

✅ **Nombres profesionales y realistas**
✅ **Datos sincronizados** entre módulos
✅ **Observaciones detalladas** en cada registro
✅ **Fechas coherentes** y progresivas
✅ **Cantidades realistas** de consumo, pesos, etc.
✅ **Trazabilidad completa** Cerdo → Nutrición → Sanidad → Producción → Reproducción

### 6️⃣ Después de Cargar los Datos

1. **Cierra sesión** en la aplicación web
2. **Vuelve a iniciar sesión** con: `julian` / `12345`
3. Verás todos los datos actualizados en cada módulo
4. Tu perfil mostrará: **Dr. Julián Ramos García** - Veterinario

---

## 🎨 Lo que Verás en Cada Módulo:

### 🐷 Dashboard / Gestión de Cerdos
- 23 cerdos perfectamente organizados
- Nombres profesionales
- Ubicaciones específicas (Corral A1, B2, C1, etc.)
- Observaciones detalladas
- Pesos actualizados

### 🍽️ Nutrición
**Tab Alimentos:**
- 13 productos organizados por tipo
- Stock en kilogramos
- Precios realistas
- Proveedores específicos

**Tab Consumos:**
- Registros diarios de alimentación
- Relacionados con cerdos reales
- Cantidades según etapa productiva
- Observaciones de cada consumo

### 💉 Sanidad
- **Vacunas:** Protocolo completo (Circovirus, Mycoplasma, Mal Rojo, etc.)
- **Tratamientos:** Casos clínicos resueltos (diarreas, cojeras, neumonías)
- **Diagnósticos:** Chequeos reproductivos, evaluaciones andrológicas
- Cada registro con veterinario asignado y observaciones

### 📊 Producción
- Evolución de pesos desde nacimiento
- Registros cada 15-30 días
- Ganancias diarias calculadas
- Notas de desarrollo

### 🐣 Reproducción
**Tab Montas:**
- 8 montas registradas
- Estados: CONFIRMADA, PENDIENTE, FALLIDA
- Métodos: Natural e Inseminación Artificial
- Fechas de parto estimadas

**Tab Partos:**
- 5 partos documentados
- Total nacidos, vivos, muertos
- Peso promedio de lechones
- Observaciones del parto

---

## 🔥 Beneficios

- **Interface se ve profesional** con datos reales
- **Todo está relacionado:** los consumos son de cerdos que existen, las vacunas de animales reales
- **Reportes tienen sentido:** estadísticas basadas en datos coherentes
- **Demo perfecta:** puedes mostrar el sistema con datos realistas
- **Testing completo:** todos los módulos tienen información para probar

---

## ⚠️ Nota Importante

Este script **ELIMINA** todos los datos de cerdos, alimentos, consumos, sanidad, producción y reproducción existentes. Solo mantiene:
- ✅ El usuario `julian`
- ✅ La estructura de la base de datos

Si quieres conservar algún dato actual, **NO ejecutes este script** o haz un backup primero.

---

## 🚀 ¿Listo?

1. Abre Supabase SQL Editor
2. Copia y pega el contenido de `DATOS_PROFESIONALES_COMPLETOS.sql`
3. Ejecuta (▶️ Run)
4. Refresca tu aplicación web
5. ¡Disfruta de datos organizados y profesionales! 🎉

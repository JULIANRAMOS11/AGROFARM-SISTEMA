# 🚀 INSTRUCCIONES DE ACTUALIZACIÓN - AGROFARM

## ⚠️ IMPORTANTE: Ejecuta esto ANTES de usar la aplicación

### Paso 1: Actualizar la base de datos en Supabase

**Ve a tu proyecto en Supabase → SQL Editor** y ejecuta este script:

```sql
-- =============================================================================
-- ACTUALIZACIÓN TABLA PIGS - Agregar campos faltantes
-- =============================================================================

-- Agregar columnas nuevas si no existen
DO $$ 
BEGIN
    -- Columna nombre
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='nombre') THEN
        ALTER TABLE pigs ADD COLUMN nombre VARCHAR(100);
    END IF;
    
    -- Columna raza (texto)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='raza') THEN
        ALTER TABLE pigs ADD COLUMN raza VARCHAR(50);
    END IF;
    
    -- Columna ubicacion
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='ubicacion') THEN
        ALTER TABLE pigs ADD COLUMN ubicacion VARCHAR(100);
    END IF;
    
    -- Columna observaciones
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='pigs' AND column_name='observaciones') THEN
        ALTER TABLE pigs ADD COLUMN observaciones TEXT;
    END IF;
END $$;

-- Verificar que se crearon correctamente
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'pigs'
ORDER BY ordinal_position;
```

**✅ Deberías ver estas columnas nuevas:**
- `nombre` (VARCHAR 100)
- `raza` (VARCHAR 50)
- `ubicacion` (VARCHAR 100)
- `observaciones` (TEXT)

---

## 🎯 ¿Qué se arregló?

### ✨ Funciones NUEVAS:

1. **✏️ EDITAR CERDOS** - Ahora puedes modificar cualquier cerdo registrado
2. **🗑️ ELIMINAR CERDOS** - Puedes eliminar cerdos de la base de datos
3. **✏️ EDITAR SANIDAD** - Edita registros sanitarios (vacunas, tratamientos)
4. **✏️ EDITAR NUTRICIÓN** - Edita alimentos y consumos registrados

### 🐷 Formulario de Cerdos - 100% Funcional:

**Campos que AHORA SÍ funcionan:**
- ✅ Código Arete (obligatorio)
- ✅ **Nombre** (nuevo campo)
- ✅ **Raza** (dropdown con opciones: Landrace, Yorkshire, Duroc, Pietrain, Hampshire, Berkshire, Criollo, Mestizo)
- ✅ Sexo (Macho/Hembra)  
- ✅ Fecha Nacimiento
- ✅ Peso Actual
- ✅ **Ubicación** (dropdown: Corral 1-3, Galpón A-B, Maternidad, Engorde, Cuarentena)
- ✅ **Observaciones** (nuevo campo)

---

## 📋 Cómo usar las nuevas funciones:

### 🐷 Gestión de Cerdos:
1. **Crear**: Haz clic en "Nuevo Cerdo", llena el formulario y guarda
2. **Editar**: Haz clic en el botón azul "Editar" en la tabla
3. **Eliminar**: Haz clic en el botón rojo "Eliminar" (pide confirmación)
4. **Desactivar**: Botón amarillo para cambiar estado ACTIVO/INACTIVO

### 💉 Módulo de Sanidad:
1. **Crear**: Botón verde "Nuevo Registro"
2. **Editar**: Botón azul de edición en la tabla
3. **Eliminar**: Botón rojo de eliminar

### 🍎 Módulo de Nutrición:
- **Tab Alimentos**: Registra concentrados, forrajes, suplementos
  - ✏️ Editar alimentos existentes
  - 🗑️ Eliminar del catálogo
  
- **Tab Consumos**: Registra cuánto comió cada cerdo
  - ✏️ Editar consumos registrados
  - 🗑️ Eliminar registros incorrectos

---

## 🔧 Cambios técnicos (Backend):

**Archivo modificado:** `backend-api/src/controllers/pigs.controller.js`

- `createPig()` - Ahora acepta: `nombre`, `raza` (texto), `ubicacion`, `observaciones`
- `updatePig()` - Actualizado para editar todos los campos nuevos

**IMPORTANTE:** El backend ya NO requiere `raza_id`, `lote_id`, `etapa_id`. Ahora trabaja con datos simples que el frontend envía.

---

## 🎨 Interfaz actualizada:

### Dashboard Principal:
- ✏️ Botón azul "Editar" en cada cerdo
- 🗑️ Botón rojo "Eliminar" con confirmación
- ⏸️ Botón amarillo "Desactivar/Activar"

### Formularios:
- Título dinámico: "✨ Nuevo Cerdo" o "🐷 Editar Cerdo"
- Botón cambia de "Guardar" a "Actualizar" automáticamente
- Al cancelar edición, vuelve al estado inicial

---

## 📦 Archivos nuevos creados:

1. `backend-api/database/06_agregar_campos_pigs.sql` - Script de migración
2. `INSTRUCCIONES_ACTUALIZACION.md` - Este archivo

---

## ✅ Verificación rápida:

Después de ejecutar el script SQL:

1. Ve al Dashboard
2. Haz clic en "Nuevo Cerdo"
3. Llena todos los campos (código arete, raza, ubicación)
4. Haz clic en "Registrar Cerdo"
5. **Debería guardarse SIN ERRORES** ✨

Si aparece error, revisa:
- ✅ Ejecutaste el script SQL en Supabase
- ✅ El backend está corriendo (`npm start` en backend-api)
- ✅ La variable `DATABASE_URL` en `.env` es correcta

---

## 🆘 Soporte:

Si algo falla, verifica en **Consola del navegador** (F12 → Console):
- Errores de red = Problema con backend/Supabase
- Errores de SQL = Revisa que columnas existan en la tabla `pigs`

---

**¡Todo está listo para usar! 🚀🐷**

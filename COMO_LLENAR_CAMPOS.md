# 📋 GUÍA RÁPIDA: CÓMO LLENAR CADA CAMPO AL CREAR CERDOS

## 🔴 **CAMPOS OBLIGATORIOS (3)**

### 1️⃣ `codigo_arete` (Identificador único del cerdo)

✅ **Ejemplos correctos:**
- `A001`
- `CERDO-1`
- `MACHO-123`
- `Juan789`

❌ **Errores comunes:**
- Dejar vacío
- Repetir un código que ya existe
- Usar solo espacios

⚠️ **IMPORTANTE:** Debe ser **ÚNICO** - no puede haber dos cerdos con el mismo

---

### 2️⃣ `fecha_nacimiento` (Fecha de nacimiento)

✅ **Formato correcto:** `AAAA-MM-DD`
- `2026-02-15`
- `2025-12-25`
- `2024-01-10`

❌ **Formatos incorrectos:**
- `15/02/2026` ❌
- `02-15-2026` ❌
- `ayer` ❌
- `15 de febrero` ❌

---

### 3️⃣ `sexo` (Solo 2 valores permitidos)

✅ **Valores correctos (EXACTOS):**
- `Macho` (con M mayúscula)
- `Hembra` (con H mayúscula)

❌ **Valores incorrectos:**
- `M` ❌
- `H` ❌
- `macho` ❌
- `MACHO` ❌
- `Male` ❌
- `Female` ❌

⚠️ **IMPORTANTE:** Escríbelo EXACTAMENTE como está arriba (con mayúscula inicial)

---

## 🟢 **CAMPOS OPCIONALES** (puedes dejarlos vacíos)

### 4️⃣ `nombre`
**Cualquier texto libre**
- `Manchitas`
- `Cerdo #1`
- `Roberto`
- `Pepito el Grande`

---

### 5️⃣ `raza`
**Cualquier texto libre**
- `Yorkshire`
- `Duroc`
- `Landrace`
- `Mestizo`
- `Pietrain`

---

### 6️⃣ `peso_actual`
**Número decimal**
- `45.5`
- `30`
- `100.25`
- `85.7`

⚠️ **Valor por defecto:** Si lo dejas vacío = `0`

---

### 7️⃣ `estado`
**Cualquier texto**
- `ACTIVO`
- `INACTIVO`
- `VENDIDO`
- `EN TRATAMIENTO`

⚠️ **Valor por defecto:** Si lo dejas vacío = `ACTIVO`

---

### 8️⃣ `ubicacion`
**Cualquier texto libre**
- `Corral 1`
- `Galpón A`
- `Maternidad`
- `Engorde`

---

### 9️⃣ `observaciones`
**Cualquier texto largo**
- `Cerdo comprado en feria`
- `Vacunado el 10 de enero`
- `Tiene problemas respiratorios`

---

## 🎯 **EJEMPLOS COMPLETOS**

### **Ejemplo 1: Mínimo necesario**
```
codigo_arete: CERDO-100
fecha_nacimiento: 2026-02-15
sexo: Macho

(Los demás campos se llenan automáticamente)
```

### **Ejemplo 2: Con algunos opcionales**
```
codigo_arete: DUROC-001
nombre: Pepito
raza: Duroc
sexo: Hembra
fecha_nacimiento: 2026-01-10
peso_actual: 55.5
ubicacion: Corral 3
```

### **Ejemplo 3: Todo completo**
```
codigo_arete: YORK-025
nombre: Lola
raza: Yorkshire
sexo: Hembra
fecha_nacimiento: 2025-12-20
peso_actual: 42.3
estado: ACTIVO
ubicacion: Galpón B
observaciones: Cerda reproductora, comprada en diciembre
```

---

## ❗ **ERRORES COMUNES Y SOLUCIONES**

| Error que aparece | ¿Qué significa? | Solución |
|-------------------|-----------------|----------|
| `duplicate key value` | Ya existe un cerdo con ese `codigo_arete` | Usa otro código único |
| `invalid input value for enum sexo_porcino` | Escribiste el sexo mal | Usa exactamente `Macho` o `Hembra` |
| `null value in column` | Falta un campo obligatorio | Llena `codigo_arete`, `fecha_nacimiento` y `sexo` |
| `invalid input syntax for type date` | La fecha está mal escrita | Usa formato `AAAA-MM-DD` (ej: `2026-02-15`) |

---

## ✅ **CHECKLIST ANTES DE CREAR**

Antes de hacer click en "Registrar Cerdo", verifica:

- [ ] `codigo_arete` está lleno y es único
- [ ] `fecha_nacimiento` tiene formato `AAAA-MM-DD`
- [ ] `sexo` es exactamente `Macho` o `Hembra` (con mayúscula inicial)
- [ ] Si llenaste `peso_actual`, es un número (no texto)

**¡Si cumples eso, NO habrá errores!** 🎉

---

## 🔧 **PARA DESARROLLADORES**

### Backend espera estos campos:
```javascript
{
  // OBLIGATORIOS
  codigo_arete: String (único),
  fecha_nacimiento: Date,
  sexo: Enum ('Macho', 'Hembra'),
  
  // OPCIONALES (con defaults)
  nombre: String | null,
  raza: String | null,
  peso_actual: Number | default: 0,
  estado: String | default: 'ACTIVO',
  etapa: String | default: 'CRIA',
  ubicacion: String | null,
  observaciones: Text | null
}
```

### Frontend debe enviar:
```javascript
// Formulario de creación
const formData = {
  codigo_arete: "A001",           // Required
  fecha_nacimiento: "2026-02-15", // Required
  sexo: "Macho",                  // Required (case-sensitive!)
  nombre: "Pepito",               // Optional
  raza: "Yorkshire",              // Optional
  peso_actual: 45.5,              // Optional (number, not string)
  estado: "ACTIVO",               // Optional
  ubicacion: "Corral 1",          // Optional
  observaciones: "..."            // Optional
};

await apiPost('/pigs', formData);
```

---

**Última actualización:** 15 de febrero de 2026  
**Versión de la base de datos:** v2.0 (simplificada)

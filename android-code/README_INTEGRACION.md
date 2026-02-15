# 🚀 GUÍA RÁPIDA: Conectar Android Studio al Backend AGROFARM

## 📋 PASOS PARA INTEGRAR (15 minutos)

### ✅ **PASO 1: Abrir tu proyecto en Android Studio**

1. Abre **Android Studio**
2. File → Open → Selecciona tu carpeta del proyecto Android
3. Espera a que cargue

---

### ✅ **PASO 2: Configurar `build.gradle.kts`**

1. Abre `app/build.gradle.kts` (o `build.gradle` si usas Groovy)
2. **Copia TODO** el contenido de `android-code/build.gradle.kts`
3. Pégalo reemplazando lo que tenías
4. Click en **"Sync Now"** arriba a la derecha ⚡
5. Espera a que descargue las librerías (puede tardar 2-3 minutos)

---

### ✅ **PASO 3: Configurar `AndroidManifest.xml`**

1. Abre `app/src/main/AndroidManifest.xml`
2. **Agrega los permisos** al inicio (después de `<manifest>`):

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

3. **Agrega esto** en `<application>`:

```xml
android:usesCleartextTraffic="true"
android:networkSecurityConfig="@xml/network_security_config"
```

Debe quedar así:
```xml
<application
    android:usesCleartextTraffic="true"
    android:networkSecurityConfig="@xml/network_security_config"
    ...resto del código...>
```

---

### ✅ **PASO 4: Crear archivo de configuración de red**

1. Click derecho en `app/src/main/res/`
2. New → Android Resource Directory
3. **Resource type:** xml
4. Click OK
5. Click derecho en la carpeta `res/xml/` que se creó
6. New → File → `network_security_config.xml`
7. **Copia TODO** el contenido de `android-code/network_security_config.xml`

---

### ✅ **PASO 5: Crear estructura de carpetas**

Dentro de `app/src/main/java/com/tuapp/`:

```
📁 network        ← Aquí van ApiConfig.kt y AgroFarmApiService.kt
📁 models         ← Aquí va Models.kt
📁 ui
  📁 auth         ← Aquí va LoginActivity.kt
  📁 main         ← Aquí van tus pantallas principales
  📁 pigs         ← Pantallas de cerdos
  📁 nutricion    ← Pantallas de nutrición
  📁 sanidad      ← Pantallas de sanidad
  📁 perfil       ← Pantallas de perfil
📁 utils          ← Aquí va PreferencesHelper.kt
```

**Crear carpetas:**
1. Click derecho en `java/com/tuapp/`
2. New → Package
3. Escribe el nombre (network, models, ui, utils, etc.)

---

### ✅ **PASO 6: Copiar archivos de código**

**Copia estos 5 archivos a tu proyecto:**

| Archivo | Destino |
|---------|---------|
| `ApiConfig.kt` | `app/src/main/java/com/tuapp/network/` |
| `AgroFarmApiService.kt` | `app/src/main/java/com/tuapp/network/` |
| `Models.kt` | `app/src/main/java/com/tuapp/models/` |
| `PreferencesHelper.kt` | `app/src/main/java/com/tuapp/utils/` |
| `LoginActivity.kt` | `app/src/main/java/com/tuapp/ui/auth/` |

⚠️ **IMPORTANTE:** Cambia el `package` en la primera línea de cada archivo por el tuyo:

```kotlin
// Si tu proyecto es com.agrofarm.app, úsalo
// Si es com.ejemplo.miapp, usa ese

package com.agrofarm.app.network  // ← Cambia esto según tu proyecto
```

---

### ✅ **PASO 7: Crear el layout de Login**

1. Click derecho en `app/src/main/res/layout/`
2. New → Layout Resource File
3. **File name:** `activity_login`
4. Root element: `androidx.constraintlayout.widget.ConstraintLayout`
5. Click OK
6. **Copia TODO** el contenido de `android-code/activity_login.xml`

---

### ✅ **PASO 8: Agregar colores e iconos (opcional)**

**Colores** (`res/values/colors.xml`):
```xml
<resources>
    <color name="green_primary">#10B981</color>
    <color name="green_dark">#059669</color>
    <color name="green_light">#D1FAE5</color>
</resources>
```

**Iconos:** Puedes omitirlos o usar los predeterminados de Material Icons.

---

### ✅ **PASO 9: ¡PROBAR!**

1. Conecta tu celular o inicia el emulador
2. Click en el botón **▶️ Run** (o Shift + F10)
3. Espera a que compile e instale
4. La app abrirá en el LOGIN
5. **Ingresa:**
   - Usuario: `julian`
   - Contraseña: `12345`
6. Click en **"Iniciar Sesión"**
7. Si funciona correctamente, verás **"¡Bienvenido!"** y entrará al dashboard

---

## 🎯 **CHECKLIST DE VERIFICACIÓN**

Marca lo que ya hiciste:

- [ ] ✅ Dependencias agregadas en `build.gradle.kts`
- [ ] ✅ **Sync Now** completado sin errores
- [ ] ✅ Permisos de internet en `AndroidManifest.xml`
- [ ] ✅ `network_security_config.xml` creado en `res/xml/`
- [ ] ✅ Carpetas (network, models, ui, utils) creadas
- [ ] ✅ `ApiConfig.kt` copiado con package correcto
- [ ] ✅ `AgroFarmApiService.kt` copiado
- [ ] ✅ `Models.kt` copiado
- [ ] ✅ `PreferencesHelper.kt` copiado
- [ ] ✅ `LoginActivity.kt` copiado
- [ ] ✅ `activity_login.xml` creado
- [ ] ✅ App compila sin errores
- [ ] ✅ Login funciona correctamente

---

## ❗ **ERRORES COMUNES Y SOLUCIONES**

### 1️⃣ **"Unresolved reference: databinding"**
**Solución:** Asegúrate de tener esto en `build.gradle.kts`:
```kotlin
buildFeatures {
    viewBinding = true
}
```
Luego haz **Sync Now**.

### 2️⃣ **"Unable to resolve host"**
**Solución:** Verifica que tu celular/emulador tenga internet. Abre Chrome y ve a google.com.

### 3️⃣ **"Cleartext HTTP traffic not permitted"**
**Solución:** Verifica que `network_security_config.xml` esté en `res/xml/` y que el `AndroidManifest.xml` tenga:
```xml
android:networkSecurityConfig="@xml/network_security_config"
```

### 4️⃣ **"Class not found LoginActivity"**
**Solución:** Limpia el proyecto:
- Build → Clean Project
- Build → Rebuild Project

### 5️⃣ **"Cannot access database"**
**Solución:** El backend está en Render y puede tardar 30 segundos en "despertar" si no se ha usado. Espera e intenta de nuevo.

---

## 📞 **¿NECESITAS AYUDA?**

Dime:
1. ¿En qué paso estás?
2. ¿Qué error te aparece?
3. Screenshot del error si es posible

Y te ayudo a resolverlo! 🚀

---

## 🎉 **SIGUIENTE PASO**

Una vez que el login funcione, puedo ayudarte a crear:
- 📱 **Dashboard** con estadísticas
- 🐷 **Lista de cerdos** con RecyclerView
- ➕ **Formulario para crear cerdo**
- 📊 **Módulo de nutrición**
- 💉 **Módulo de sanidad**

¡Solo dime qué quieres primero! 😊

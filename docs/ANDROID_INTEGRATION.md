# 📱 Integración Android - AGROFARM

## 🎯 Objetivo
Conectar tu app Android al backend de AGROFARM que está en:
**https://api-agrofarm.onrender.com/api**

---

## 📋 PASO 1: Configurar Permisos de Internet

### `AndroidManifest.xml`
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.agrofarm.app">

    <!-- ⚠️ IMPORTANTE: Agregar estos permisos -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".AgroFarmApp"
        android:usesCleartextTraffic="true"
        android:networkSecurityConfig="@xml/network_security_config"
        ...>
        
    </application>
</manifest>
```

### `res/xml/network_security_config.xml` (crear este archivo)
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">api-agrofarm.onrender.com</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

---

## 📋 PASO 2: Agregar Dependencias (Retrofit para llamadas HTTP)

### `build.gradle.kts (Module: app)` o `build.gradle`
```kotlin
dependencies {
    // Retrofit para peticiones HTTP
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    
    // OkHttp para interceptores y logging
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Coroutines para operaciones asíncronas
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
    
    // ViewModel y LiveData
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
}
```

Después de agregar, haz click en **"Sync Now"** arriba a la derecha.

---

## 📋 PASO 3: Crear Clases para el API

### 1️⃣ `ApiConfig.kt` - Configuración del API
```kotlin
package com.agrofarm.app.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiConfig {
    private const val BASE_URL = "https://api-agrofarm.onrender.com/api/"
    
    // Token de autenticación (guardar después del login)
    var authToken: String? = null
    
    // Interceptor para agregar el token a todas las peticiones
    private val authInterceptor = Interceptor { chain ->
        val request = chain.request().newBuilder()
        authToken?.let {
            request.addHeader("Authorization", "Bearer $it")
        }
        chain.proceed(request.build())
    }
    
    // Logging para debugging
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    // Cliente HTTP
    private val client = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    // Retrofit instance
    val apiService: AgroFarmApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AgroFarmApiService::class.java)
    }
}
```

### 2️⃣ `Models.kt` - Modelos de datos
```kotlin
package com.agrofarm.app.models

import com.google.gson.annotations.SerializedName

// Login
data class LoginRequest(
    val username: String,
    val password: String
)

data class LoginResponse(
    val token: String,
    val user: User
)

data class User(
    val id: Int,
    val username: String,
    @SerializedName("nombre_completo") val nombreCompleto: String?,
    val email: String?,
    val telefono: String?,
    val cargo: String?
)

// Cerdos
data class Pig(
    val id: Int,
    @SerializedName("codigo_arete") val codigoArete: String,
    val nombre: String?,
    val raza: String?,
    val sexo: String,
    @SerializedName("fecha_nacimiento") val fechaNacimiento: String,
    @SerializedName("peso_actual") val pesoActual: String?,
    val estado: String,
    val etapa: String?,
    val lote: String?,
    val ubicacion: String?,
    val observaciones: String?,
    @SerializedName("created_at") val createdAt: String
)

data class CreatePigRequest(
    @SerializedName("codigo_arete") val codigoArete: String,
    val nombre: String?,
    val raza: String?,
    val sexo: String,
    @SerializedName("fecha_nacimiento") val fechaNacimiento: String,
    @SerializedName("peso_actual") val pesoActual: Double?,
    val ubicacion: String?,
    val observaciones: String?
)

// Respuestas genéricas
data class ApiResponse<T>(
    val ok: Boolean = true,
    val data: T? = null,
    val error: String? = null
)
```

### 3️⃣ `AgroFarmApiService.kt` - Endpoints del API
```kotlin
package com.agrofarm.app.network

import com.agrofarm.app.models.*
import retrofit2.Response
import retrofit2.http.*

interface AgroFarmApiService {
    
    // ═══ AUTH ═══
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: Map<String, String>): Response<LoginResponse>
    
    // ═══ CERDOS ═══
    @GET("pigs")
    suspend fun getPigs(): Response<List<Pig>>
    
    @GET("pigs/{id}")
    suspend fun getPig(@Path("id") id: Int): Response<Pig>
    
    @POST("pigs")
    suspend fun createPig(@Body pig: CreatePigRequest): Response<Pig>
    
    @PUT("pigs/{id}")
    suspend fun updatePig(@Path("id") id: Int, @Body pig: CreatePigRequest): Response<Pig>
    
    @DELETE("pigs/{id}")
    suspend fun deletePig(@Path("id") id: Int): Response<Map<String, String>>
    
    @PUT("pigs/{id}/estado")
    suspend fun togglePigStatus(@Path("id") id: Int): Response<Pig>
    
    // ═══ PERFIL ═══
    @GET("perfil/{id}")
    suspend fun getProfile(@Path("id") id: Int): Response<User>
    
    @PUT("perfil/{id}")
    suspend fun updateProfile(@Path("id") id: Int, @Body user: Map<String, String>): Response<User>
    
    // ═══ SANIDAD ═══
    @GET("sanidad/registro/{pig_id}")
    suspend fun getHealthRecords(@Path("pig_id") pigId: Int): Response<List<Any>>
    
    @POST("sanidad/registro")
    suspend fun createHealthRecord(@Body record: Map<String, Any>): Response<Any>
    
    // ═══ NUTRICIÓN ═══
    @GET("nutricion/alimentos")
    suspend fun getAlimentos(): Response<List<Any>>
    
    @GET("nutricion/consumos")
    suspend fun getConsumos(): Response<List<Any>>
    
    @POST("nutricion/consumos")
    suspend fun createConsumo(@Body consumo: Map<String, Any>): Response<Any>
}
```

---

## 📋 PASO 4: Ejemplo de Uso - Activity de Login

```kotlin
package com.agrofarm.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.agrofarm.app.databinding.ActivityLoginBinding
import com.agrofarm.app.models.LoginRequest
import com.agrofarm.app.network.ApiConfig
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.text.toString()
            val password = binding.etPassword.text.toString()
            
            if (username.isNotEmpty() && password.isNotEmpty()) {
                login(username, password)
            } else {
                Toast.makeText(this, "Completa todos los campos", Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun login(username: String, password: String) {
        lifecycleScope.launch {
            try {
                val response = ApiConfig.apiService.login(
                    LoginRequest(username, password)
                )
                
                if (response.isSuccessful && response.body() != null) {
                    val loginData = response.body()!!
                    
                    // Guardar token
                    ApiConfig.authToken = loginData.token
                    
                    // Guardar en SharedPreferences
                    getSharedPreferences("agrofarm", MODE_PRIVATE).edit()
                        .putString("token", loginData.token)
                        .putString("username", loginData.user.username)
                        .apply()
                    
                    Toast.makeText(this@LoginActivity, "Bienvenido!", Toast.LENGTH_SHORT).show()
                    
                    // Ir al dashboard
                    startActivity(Intent(this@LoginActivity, DashboardActivity::class.java))
                    finish()
                } else {
                    Toast.makeText(this@LoginActivity, "Usuario o contraseña incorrectos", Toast.LENGTH_SHORT).show()
                }
                
            } catch (e: Exception) {
                Toast.makeText(this@LoginActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
```

---

## 📋 PASO 5: Ejemplo - Listar Cerdos

```kotlin
package com.agrofarm.app.ui.pigs

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.agrofarm.app.databinding.ActivityPigsBinding
import com.agrofarm.app.network.ApiConfig
import kotlinx.coroutines.launch

class PigsActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityPigsBinding
    private lateinit var adapter: PigAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPigsBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        loadPigs()
    }
    
    private fun setupRecyclerView() {
        adapter = PigAdapter()
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@PigsActivity)
            adapter = this@PigsActivity.adapter
        }
    }
    
    private fun loadPigs() {
        lifecycleScope.launch {
            try {
                val response = ApiConfig.apiService.getPigs()
                
                if (response.isSuccessful && response.body() != null) {
                    adapter.submitList(response.body())
                } else {
                    Toast.makeText(this@PigsActivity, "Error al cargar cerdos", Toast.LENGTH_SHORT).show()
                }
                
            } catch (e: Exception) {
                Toast.makeText(this@PigsActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
            }
        }
    }
}
```

---

## 🎯 RESUMEN RÁPIDO

### ✅ Checklist de Integración:

1. ☑️ **Permisos de Internet** en `AndroidManifest.xml`
2. ☑️ **Network Security Config** creado
3. ☑️ **Dependencias Retrofit** agregadas en `build.gradle`
4. ☑️ **Sync Project** ejecutado
5. ☑️ **ApiConfig.kt** creado (configuración)
6. ☑️ **Models.kt** creado (modelos de datos)
7. ☑️ **AgroFarmApiService.kt** creado (endpoints)
8. ☑️ **LoginActivity** implementado con ejemplo
9. ☑️ **Token guardado** en SharedPreferences
10. ☑️ **Probar login** con usuarios reales

---

## 📍 URLs DEL BACKEND:

```
Base URL: https://api-agrofarm.onrender.com/api

Endpoints principales:
- POST /auth/login          → Iniciar sesión
- POST /auth/register       → Registrarse
- GET  /pigs                → Listar cerdos
- POST /pigs                → Crear cerdo
- PUT  /pigs/:id            → Editar cerdo
- DELETE /pigs/:id          → Eliminar cerdo
- GET  /nutricion/alimentos → Listar alimentos
- GET  /sanidad/registro    → Registros de salud
```

---

## 🔐 EJEMPLO DE PETICIÓN CON TOKEN:

```kotlin
// El token se agrega automáticamente en ApiConfig
// Pero también puedes hacerlo manual:

@GET("pigs")
suspend fun getPigs(
    @Header("Authorization") token: String
): Response<List<Pig>>

// Uso:
val response = apiService.getPigs("Bearer $token")
```

---

## ❓ PREGUNTAS FRECUENTES:

### 1. ¿Cómo pruebo si funciona?
```kotlin
lifecycleScope.launch {
    try {
        val response = ApiConfig.apiService.login(
            LoginRequest("julian", "12345")
        )
        Log.d("TEST", "Response: ${response.body()}")
    } catch (e: Exception) {
        Log.e("TEST", "Error: ${e.message}")
    }
}
```

### 2. ¿Dónde está mi proyecto Android?
Probablemente en: `C:\Users\TuUsuario\AndroidStudioProjects\AgroFarm`

### 3. ¿Necesito crear las pantallas?
Sí, necesitas crear los layouts XML o usar Jetpack Compose para las vistas.

---

## 📞 NECESITAS MÁS AYUDA:

Dime:
1. ¿En qué carpeta está tu proyecto Android?
2. ¿Usas Kotlin o Java?
3. ¿Qué pantalla quieres crear primero (Login, Dashboard, Lista de cerdos)?

¡Y te ayudo a implementarlo! 🚀

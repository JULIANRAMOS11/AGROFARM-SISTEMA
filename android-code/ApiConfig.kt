package com.agrofarm.app.network

import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

/**
 * Configuración centralizada del API de AGROFARM
 * 
 * INSTRUCCIONES:
 * 1. Copiar este archivo a: app/src/main/java/com/agrofarm/app/network/
 * 2. Asegúrate de tener las dependencias en build.gradle
 * 3. Usa ApiConfig.apiService para hacer peticiones
 */
object ApiConfig {
    
    // ⚠️ IMPORTANTE: Esta es la URL de tu backend en Render
    private const val BASE_URL = "https://api-agrofarm.onrender.com/api/"
    
    // Token de autenticación (se guarda después del login)
    var authToken: String? = null
    
    // Interceptor para agregar el token automáticamente a todas las peticiones
    private val authInterceptor = Interceptor { chain ->
        val request = chain.request().newBuilder()
        authToken?.let {
            request.addHeader("Authorization", "Bearer $it")
        }
        chain.proceed(request.build())
    }
    
    // Logging para ver las peticiones en el Logcat (útil para debugging)
    private val loggingInterceptor = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }
    
    // Cliente HTTP con timeout de 30 segundos
    private val client = OkHttpClient.Builder()
        .addInterceptor(authInterceptor)
        .addInterceptor(loggingInterceptor)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .writeTimeout(30, TimeUnit.SECONDS)
        .build()
    
    // Instancia de Retrofit (se crea solo una vez)
    val apiService: AgroFarmApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(AgroFarmApiService::class.java)
    }
}

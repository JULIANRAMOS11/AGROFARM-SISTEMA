package com.agrofarm.app.network

import com.agrofarm.app.models.*
import retrofit2.Response
import retrofit2.http.*

/**
 * Interfaz de Retrofit con todos los endpoints del API de AGROFARM
 * 
 * INSTRUCCIONES:
 * - Todas las funciones son suspend (usar con coroutines)
 * - Usar lifecycleScope.launch para llamarlas desde Activity/Fragment
 * - El token se agrega automáticamente por ApiConfig
 */
interface AgroFarmApiService {
    
    // ═══════════════════════════════════════
    // AUTH - Autenticación
    // ═══════════════════════════════════════
    
    /**
     * Login - Iniciar sesión
     * POST /api/auth/login
     * Body: { "username": "julian", "password": "12345" }
     */
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    /**
     * Register - Registrarse
     * POST /api/auth/register
     */
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<LoginResponse>
    
    // ═══════════════════════════════════════
    // PIGS - Gestión de Cerdos
    // ═══════════════════════════════════════
    
    /**
     * Obtener todos los cerdos
     * GET /api/pigs
     */
    @GET("pigs")
    suspend fun getPigs(): Response<List<Pig>>
    
    /**
     * Obtener un cerdo por ID
     * GET /api/pigs/{id}
     */
    @GET("pigs/{id}")
    suspend fun getPig(@Path("id") id: Int): Response<Pig>
    
    /**
     * Crear un nuevo cerdo
     * POST /api/pigs
     * 
     * IMPORTANTE:
     * - sexo debe ser: "Macho" o "Hembra" (con mayúscula)
     * - fecha_nacimiento formato: "2026-02-15"
     */
    @POST("pigs")
    suspend fun createPig(@Body pig: CreatePigRequest): Response<Pig>
    
    /**
     * Actualizar un cerdo
     * PUT /api/pigs/{id}
     */
    @PUT("pigs/{id}")
    suspend fun updatePig(
        @Path("id") id: Int, 
        @Body pig: CreatePigRequest
    ): Response<Pig>
    
    /**
     * Eliminar un cerdo
     * DELETE /api/pigs/{id}
     */
    @DELETE("pigs/{id}")
    suspend fun deletePig(@Path("id") id: Int): Response<Map<String, String>>
    
    /**
     * Cambiar estado del cerdo (ACTIVO ↔ INACTIVO)
     * PUT /api/pigs/{id}/estado
     */
    @PUT("pigs/{id}/estado")
    suspend fun togglePigStatus(@Path("id") id: Int): Response<Pig>
    
    // ═══════════════════════════════════════
    // PERFIL - Gestión de Usuario
    // ═══════════════════════════════════════
    
    /**
     * Obtener perfil del usuario
     * GET /api/perfil/{id}
     */
    @GET("perfil/{id}")
    suspend fun getProfile(@Path("id") id: Int): Response<User>
    
    /**
     * Actualizar perfil
     * PUT /api/perfil/{id}
     */
    @PUT("perfil/{id}")
    suspend fun updateProfile(
        @Path("id") id: Int, 
        @Body user: Map<String, String>
    ): Response<User>
    
    /**
     * Cambiar contraseña
     * POST /api/auth/change-password
     */
    @POST("auth/change-password")
    suspend fun changePassword(@Body data: Map<String, String>): Response<Map<String, String>>
    
    // ═══════════════════════════════════════
    // SANIDAD - Registros de Salud
    // ═══════════════════════════════════════
    
    /**
     * Obtener registros de sanidad de un cerdo
     * GET /api/sanidad/registro/{pig_id}
     */
    @GET("sanidad/registro/{pig_id}")
    suspend fun getHealthRecords(@Path("pig_id") pigId: Int): Response<List<RegistroSanidad>>
    
    /**
     * Crear registro de sanidad
     * POST /api/sanidad/registro
     */
    @POST("sanidad/registro")
    suspend fun createHealthRecord(@Body record: Map<String, Any>): Response<RegistroSanidad>
    
    /**
     * Actualizar registro de sanidad
     * PUT /api/sanidad/registro/{id}
     */
    @PUT("sanidad/registro/{id}")
    suspend fun updateHealthRecord(
        @Path("id") id: Int,
        @Body record: Map<String, Any>
    ): Response<RegistroSanidad>
    
    /**
     * Eliminar registro de sanidad
     * DELETE /api/sanidad/registro/{id}
     */
    @DELETE("sanidad/registro/{id}")
    suspend fun deleteHealthRecord(@Path("id") id: Int): Response<Map<String, String>>
    
    // ═══════════════════════════════════════
    // NUTRICIÓN - Alimentos y Consumo
    // ═══════════════════════════════════════
    
    /**
     * Obtener todos los alimentos
     * GET /api/nutricion/alimentos
     */
    @GET("nutricion/alimentos")
    suspend fun getAlimentos(): Response<List<Alimento>>
    
    /**
     * Crear alimento
     * POST /api/nutricion/alimentos
     */
    @POST("nutricion/alimentos")
    suspend fun createAlimento(@Body alimento: Map<String, Any>): Response<Alimento>
    
    /**
     * Actualizar alimento
     * PUT /api/nutricion/alimentos/{id}
     */
    @PUT("nutricion/alimentos/{id}")
    suspend fun updateAlimento(
        @Path("id") id: Int,
        @Body alimento: Map<String, Any>
    ): Response<Alimento>
    
    /**
     * Eliminar alimento
     * DELETE /api/nutricion/alimentos/{id}
     */
    @DELETE("nutricion/alimentos/{id}")
    suspend fun deleteAlimento(@Path("id") id: Int): Response<Map<String, String>>
    
    /**
     * Obtener todos los consumos
     * GET /api/nutricion/consumos
     */
    @GET("nutricion/consumos")
    suspend fun getConsumos(): Response<List<Consumo>>
    
    /**
     * Crear consumo de alimento
     * POST /api/nutricion/consumos
     */
    @POST("nutricion/consumos")
    suspend fun createConsumo(@Body consumo: Map<String, Any>): Response<Consumo>
    
    /**
     * Actualizar consumo
     * PUT /api/nutricion/consumos/{id}
     */
    @PUT("nutricion/consumos/{id}")
    suspend fun updateConsumo(
        @Path("id") id: Int,
        @Body consumo: Map<String, Any>
    ): Response<Consumo>
    
    /**
     * Eliminar consumo
     * DELETE /api/nutricion/consumos/{id}
     */
    @DELETE("nutricion/consumos/{id}")
    suspend fun deleteConsumo(@Path("id") id: Int): Response<Map<String, String>>
    
    // ═══════════════════════════════════════
    // PRODUCCIÓN
    // ═══════════════════════════════════════
    
    /**
     * Obtener registros de producción
     * GET /api/produccion
     */
    @GET("produccion")
    suspend fun getProduccion(): Response<List<Any>>
    
    /**
     * Crear registro de producción
     * POST /api/produccion
     */
    @POST("produccion")
    suspend fun createProduccion(@Body data: Map<String, Any>): Response<Any>
    
    // ═══════════════════════════════════════
    // REPRODUCCIÓN
    // ═══════════════════════════════════════
    
    /**
     * Obtener registros de reproducción
     * GET /api/reproduccion
     */
    @GET("reproduccion")
    suspend fun getReproduccion(): Response<List<Any>>
    
    /**
     * Crear registro de reproducción
     * POST /api/reproduccion
     */
    @POST("reproduccion")
    suspend fun createReproduccion(@Body data: Map<String, Any>): Response<Any>
}

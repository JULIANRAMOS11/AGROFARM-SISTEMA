package com.agrofarm.app.network

import com.agrofarm.app.models.*
import retrofit2.Response
import retrofit2.http.*

interface AgroFarmApiService {
    
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>
    
    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<LoginResponse>
    
    @GET("pigs")
    suspend fun getPigs(): Response<List<Pig>>
    
    @GET("pigs/{id}")
    suspend fun getPig(@Path("id") id: Int): Response<Pig>
    
    @POST("pigs")
    suspend fun createPig(@Body pig: CreatePigRequest): Response<Pig>
    
    @PUT("pigs/{id}")
    suspend fun updatePig(
        @Path("id") id: Int, 
        @Body pig: CreatePigRequest
    ): Response<Pig>
    
    @DELETE("pigs/{id}")
    suspend fun deletePig(@Path("id") id: Int): Response<Map<String, String>>
    
    @PUT("pigs/{id}/estado")
    suspend fun togglePigStatus(@Path("id") id: Int): Response<Pig>
    
    @GET("perfil/{id}")
    suspend fun getProfile(@Path("id") id: Int): Response<User>
    
    @PUT("perfil/{id}")
    suspend fun updateProfile(
        @Path("id") id: Int, 
        @Body user: Map<String, String>
    ): Response<User>
    
    @POST("auth/change-password")
    suspend fun changePassword(@Body data: Map<String, String>): Response<Map<String, String>>
    
    @GET("sanidad/registro/{pig_id}")
    suspend fun getHealthRecords(@Path("pig_id") pigId: Int): Response<List<RegistroSanidad>>
    
    @POST("sanidad/registro")
    suspend fun createHealthRecord(@Body record: Map<String, Any>): Response<RegistroSanidad>
    
    @PUT("sanidad/registro/{id}")
    suspend fun updateHealthRecord(
        @Path("id") id: Int,
        @Body record: Map<String, Any>
    ): Response<RegistroSanidad>
    
    @DELETE("sanidad/registro/{id}")
    suspend fun deleteHealthRecord(@Path("id") id: Int): Response<Map<String, String>>
    
    @GET("nutricion/alimentos")
    suspend fun getAlimentos(): Response<List<Alimento>>
    
    @POST("nutricion/alimentos")
    suspend fun createAlimento(@Body alimento: Map<String, Any>): Response<Alimento>
    
    @PUT("nutricion/alimentos/{id}")
    suspend fun updateAlimento(
        @Path("id") id: Int,
        @Body alimento: Map<String, Any>
    ): Response<Alimento>
    
    @DELETE("nutricion/alimentos/{id}")
    suspend fun deleteAlimento(@Path("id") id: Int): Response<Map<String, String>>
    
    @GET("nutricion/consumos")
    suspend fun getConsumos(): Response<List<Consumo>>
    
    @POST("nutricion/consumos")
    suspend fun createConsumo(@Body consumo: Map<String, Any>): Response<Consumo>
    
    @PUT("nutricion/consumos/{id}")
    suspend fun updateConsumo(
        @Path("id") id: Int,
        @Body consumo: Map<String, Any>
    ): Response<Consumo>
    
    @DELETE("nutricion/consumos/{id}")
    suspend fun deleteConsumo(@Path("id") id: Int): Response<Map<String, String>>
    
    @GET("produccion")
    suspend fun getProduccion(): Response<List<Any>>
    
    @POST("produccion")
    suspend fun createProduccion(@Body data: Map<String, Any>): Response<Any>
    
    @GET("reproduccion")
    suspend fun getReproduccion(): Response<List<Any>>
    
    @POST("reproduccion")
    suspend fun createReproduccion(@Body data: Map<String, Any>): Response<Any>
}

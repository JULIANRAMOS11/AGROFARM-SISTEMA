package com.agrofarm.app.models

import com.google.gson.annotations.SerializedName

data class LoginRequest(
    val username: String,
    val password: String
)

data class RegisterRequest(
    val username: String,
    val password: String,
    @SerializedName("nombre_completo") val nombreCompleto: String,
    val email: String?,
    val telefono: String?,
    val cargo: String?
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
    val nombre: String? = null,
    val raza: String? = null,
    val sexo: String,
    @SerializedName("fecha_nacimiento") val fechaNacimiento: String,
    @SerializedName("peso_actual") val pesoActual: Double? = null,
    val ubicacion: String? = null,
    val observaciones: String? = null
)

data class Alimento(
    val id: Int,
    @SerializedName("nombre_alimento") val nombreAlimento: String,
    val tipo: String,
    @SerializedName("proteina_porcentaje") val proteinaPorcentaje: String?,
    @SerializedName("costo_por_kg") val costoPorKg: String?,
    val proveedor: String?,
    @SerializedName("stock_kg") val stockKg: String,
    val observaciones: String?
)

data class Consumo(
    val id: Int,
    @SerializedName("pig_id") val pigId: Int,
    @SerializedName("alimento_id") val alimentoId: Int,
    val fecha: String,
    @SerializedName("cantidad_kg") val cantidadKg: String,
    @SerializedName("etapa_productiva") val etapaProductiva: String?,
    val observaciones: String?,
    @SerializedName("codigo_arete") val codigoArete: String?,
    @SerializedName("nombre_cerdo") val nombreCerdo: String?,
    @SerializedName("nombre_alimento") val nombreAlimento: String?
)

data class RegistroSanidad(
    val id: Int,
    @SerializedName("pig_id") val pigId: Int,
    @SerializedName("tipo_registro") val tipoRegistro: String,
    val fecha: String,
    val diagnostico: String?,
    val tratamiento: String?,
    val medicamento: String?,
    val dosis: String?,
    val veterinario: String?,
    val observaciones: String?,
    @SerializedName("codigo_arete") val codigoArete: String?
)

data class ApiResponse<T>(
    val ok: Boolean = true,
    val data: T? = null,
    val error: String? = null,
    val message: String? = null
)

data class ErrorResponse(
    val error: String,
    val detail: String? = null
)

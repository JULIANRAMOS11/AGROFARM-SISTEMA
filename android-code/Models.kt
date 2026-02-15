package com.agrofarm.app.models

import com.google.gson.annotations.SerializedName

// ═══════════════════════════════════════
// AUTENTICACIÓN
// ═══════════════════════════════════════

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

// ═══════════════════════════════════════
// CERDOS (PIGS)
// ═══════════════════════════════════════

data class Pig(
    val id: Int,
    @SerializedName("codigo_arete") val codigoArete: String,
    val nombre: String?,
    val raza: String?,
    val sexo: String, // "Macho" o "Hembra"
    @SerializedName("fecha_nacimiento") val fechaNacimiento: String, // "2026-02-15"
    @SerializedName("peso_actual") val pesoActual: String?, // "17.00"
    val estado: String, // "ACTIVO" o "INACTIVO"
    val etapa: String?, // "CRIA", "ENGORDE", etc.
    val lote: String?,
    val ubicacion: String?,
    val observaciones: String?,
    @SerializedName("created_at") val createdAt: String
)

data class CreatePigRequest(
    @SerializedName("codigo_arete") val codigoArete: String,
    val nombre: String? = null,
    val raza: String? = null,
    val sexo: String, // OBLIGATORIO: "Macho" o "Hembra"
    @SerializedName("fecha_nacimiento") val fechaNacimiento: String, // OBLIGATORIO: "2026-02-15"
    @SerializedName("peso_actual") val pesoActual: Double? = null,
    val ubicacion: String? = null,
    val observaciones: String? = null
)

// ═══════════════════════════════════════
// NUTRICIÓN
// ═══════════════════════════════════════

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

// ═══════════════════════════════════════
// SANIDAD
// ═══════════════════════════════════════

data class RegistroSanidad(
    val id: Int,
    @SerializedName("pig_id") val pigId: Int,
    @SerializedName("tipo_registro") val tipoRegistro: String, // "VACUNA", "TRATAMIENTO", "DIAGNOSTICO"
    val fecha: String,
    val diagnostico: String?,
    val tratamiento: String?,
    val medicamento: String?,
    val dosis: String?,
    val veterinario: String?,
    val observaciones: String?,
    @SerializedName("codigo_arete") val codigoArete: String?
)

// ═══════════════════════════════════════
// RESPUESTAS GENÉRICAS
// ═══════════════════════════════════════

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

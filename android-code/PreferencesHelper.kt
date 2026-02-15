package com.agrofarm.app.utils

import android.content.Context
import android.content.SharedPreferences
import com.agrofarm.app.models.User
import com.google.gson.Gson

/**
 * Helper para guardar y recuperar datos de SharedPreferences
 * 
 * INSTRUCCIONES:
 * Copiar a: app/src/main/java/com/agrofarm/app/utils/
 */
class PreferencesHelper(context: Context) {
    
    private val prefs: SharedPreferences = 
        context.getSharedPreferences("agrofarm_prefs", Context.MODE_PRIVATE)
    
    private val gson = Gson()
    
    companion object {
        private const val KEY_TOKEN = "token"
        private const val KEY_USER = "user"
        private const val KEY_USER_ID = "user_id"
        private const val KEY_USERNAME = "username"
    }
    
    // ═══ TOKEN ═══
    
    fun saveToken(token: String) {
        prefs.edit().putString(KEY_TOKEN, token).apply()
    }
    
    fun getToken(): String? {
        return prefs.getString(KEY_TOKEN, null)
    }
    
    // ═══ USER ═══
    
    fun saveUser(user: User) {
        val userJson = gson.toJson(user)
        prefs.edit()
            .putString(KEY_USER, userJson)
            .putInt(KEY_USER_ID, user.id)
            .putString(KEY_USERNAME, user.username)
            .apply()
    }
    
    fun getUser(): User? {
        val userJson = prefs.getString(KEY_USER, null) ?: return null
        return try {
            gson.fromJson(userJson, User::class.java)
        } catch (e: Exception) {
            null
        }
    }
    
    fun getUserId(): Int {
        return prefs.getInt(KEY_USER_ID, -1)
    }
    
    fun getUsername(): String? {
        return prefs.getString(KEY_USERNAME, null)
    }
    
    // ═══ SESSION ═══
    
    fun isLoggedIn(): Boolean {
        return getToken() != null
    }
    
    fun clear() {
        prefs.edit().clear().apply()
    }
    
    fun logout() {
        clear()
    }
}

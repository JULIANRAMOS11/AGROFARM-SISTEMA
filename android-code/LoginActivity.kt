package com.agrofarm.app.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.agrofarm.app.R
import com.agrofarm.app.databinding.ActivityLoginBinding
import com.agrofarm.app.models.LoginRequest
import com.agrofarm.app.network.ApiConfig
import com.agrofarm.app.ui.main.DashboardActivity
import com.agrofarm.app.utils.PreferencesHelper
import kotlinx.coroutines.launch

/**
 * Pantalla de Login - AGROFARM
 * 
 * INSTRUCCIONES:
 * 1. Crear el layout: activity_login.xml con:
 *    - EditText: etUsername
 *    - EditText: etPassword
 *    - Button: btnLogin
 *    - ProgressBar: progressBar
 *    - TextView: tvRegister (opcional)
 * 
 * 2. Copiar este archivo a: app/src/main/java/com/agrofarm/app/ui/auth/
 * 
 * 3. Agregar en AndroidManifest.xml:
 *    <activity android:name=".ui.auth.LoginActivity" />
 */
class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    private lateinit var prefs: PreferencesHelper
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        prefs = PreferencesHelper(this)
        
        // Si ya hay sesión, ir directo al dashboard
        if (prefs.isLoggedIn()) {
            goToDashboard()
            return
        }
        
        setupUI()
    }
    
    private fun setupUI() {
        binding.btnLogin.setOnClickListener {
            val username = binding.etUsername.text.toString().trim()
            val password = binding.etPassword.text.toString().trim()
            
            when {
                username.isEmpty() -> {
                    binding.etUsername.error = "Ingresa tu usuario"
                    binding.etUsername.requestFocus()
                }
                password.isEmpty() -> {
                    binding.etPassword.error = "Ingresa tu contraseña"
                    binding.etPassword.requestFocus()
                }
                else -> {
                    login(username, password)
                }
            }
        }
        
        // Opcional: botón para ir a registro
        binding.tvRegister?.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
    
    private fun login(username: String, password: String) {
        lifecycleScope.launch {
            try {
                // Mostrar loading
                showLoading(true)
                
                // Hacer petición al API
                val response = ApiConfig.apiService.login(
                    LoginRequest(username, password)
                )
                
                // Ocultar loading
                showLoading(false)
                
                if (response.isSuccessful && response.body() != null) {
                    val loginData = response.body()!!
                    
                    // Guardar token en ApiConfig
                    ApiConfig.authToken = loginData.token
                    
                    // Guardar en SharedPreferences
                    prefs.saveToken(loginData.token)
                    prefs.saveUser(loginData.user)
                    
                    // Mostrar mensaje de bienvenida
                    val nombreUsuario = loginData.user.nombreCompleto ?: loginData.user.username
                    Toast.makeText(
                        this@LoginActivity,
                        "¡Bienvenido, $nombreUsuario! 🎉",
                        Toast.LENGTH_SHORT
                    ).show()
                    
                    // Ir al dashboard
                    goToDashboard()
                    
                } else {
                    // Error del servidor
                    val errorMsg = when (response.code()) {
                        401 -> "Usuario o contraseña incorrectos"
                        404 -> "Usuario no encontrado"
                        500 -> "Error del servidor. Intenta más tarde"
                        else -> "Error al iniciar sesión"
                    }
                    Toast.makeText(this@LoginActivity, errorMsg, Toast.LENGTH_LONG).show()
                }
                
            } catch (e: Exception) {
                // Error de conexión
                showLoading(false)
                val errorMsg = when {
                    e.message?.contains("Unable to resolve host") == true -> 
                        "Sin conexión a internet"
                    e.message?.contains("timeout") == true -> 
                        "Tiempo de espera agotado. Intenta de nuevo"
                    else -> 
                        "Error: ${e.message}"
                }
                Toast.makeText(this@LoginActivity, errorMsg, Toast.LENGTH_LONG).show()
            }
        }
    }
    
    private fun showLoading(show: Boolean) {
        binding.progressBar.visibility = if (show) View.VISIBLE else View.GONE
        binding.btnLogin.isEnabled = !show
        binding.btnLogin.text = if (show) "Iniciando sesión..." else "Iniciar Sesión"
    }
    
    private fun goToDashboard() {
        startActivity(Intent(this, DashboardActivity::class.java))
        finish() // Cerrar LoginActivity para que no pueda volver con "atrás"
    }
}

// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://api-agrofarm.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "No se pudo registrar el usuario.");
        return;
      }

      setMsg("Usuario registrado correctamente. Ahora puedes iniciar sesión.");
      setUsername("");
      setPassword("");

      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError("Error de conexión con la API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sección Izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-green-900 relative items-center justify-center overflow-hidden">
        <img 
          src="/cerdos.webp" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          alt="Granja Fondo"
        />
        
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Únete a AGROFARM
          </h2>
          <p className="text-green-100 text-lg max-w-md mx-auto leading-relaxed">
            Registra tu cuenta y comienza a gestionar tu granja de manera profesional.
          </p>
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <img 
              src="/logo2.png" 
              alt="Logo Agrofarm" 
              className="mx-auto h-36 md:h-44 w-auto max-w-full object-contain mb-6 drop-shadow-xl"
            />
            <h1 className="text-3xl font-bold text-gray-900">Crear Cuenta</h1>
            <p className="text-gray-500 mt-2">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition outline-none"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            {msg && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600">{msg}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

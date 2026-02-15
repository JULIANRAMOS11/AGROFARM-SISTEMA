// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../services/api";

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
      await apiRegister({ username, password });
      setMsg("Usuario registrado correctamente. Redirigiendo...");
      setUsername("");
      setPassword("");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      setError(err.message || "Error de conexión con la API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Sección Izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative items-center justify-center overflow-hidden">
        <img
          src="/cerdos.webp"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Granja Fondo"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/90 via-green-800/80 to-green-900/90"></div>

        {/* Decoraciones flotantes */}
        <div className="absolute top-32 right-20 w-36 h-36 bg-emerald-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-16 w-28 h-28 bg-green-400/15 rounded-full blur-3xl animate-float delay-300"></div>

        <div className="relative z-10 text-center px-10 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-sm font-medium mb-8">
            <i className="fas fa-user-plus"></i>
            Crea tu cuenta
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Únete a<br />AGROFARM
          </h2>
          <p className="text-green-100/80 text-lg max-w-md mx-auto leading-relaxed">
            Registra tu cuenta y comienza a gestionar tu granja de manera profesional.
          </p>

          {/* Features list */}
          <div className="mt-10 space-y-3 text-left max-w-xs mx-auto">
            {["Control total de tu granja", "Registros sanitarios y productivos", "Acceso desde cualquier dispositivo"].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-green-100/80 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-500/30 flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-check text-green-300 text-xs"></i>
                </div>
                {feat}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 lg:p-16 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10 animate-slideUp">

          <div className="text-center mb-8">
            <img
              src="/logo2.png"
              alt="Logo Agrofarm"
              className="mx-auto h-32 md:h-36 w-auto max-w-full object-contain mb-5 drop-shadow-xl"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Crear Cuenta</h1>
            <p className="text-gray-400 mt-1.5 text-sm">Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="form-label">
                <i className="fas fa-user text-green-500 mr-1.5 text-xs"></i>Usuario
              </label>
              <input
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-modern"
              />
            </div>

            <div>
              <label className="form-label">
                <i className="fas fa-lock text-green-500 mr-1.5 text-xs"></i>Contraseña
              </label>
              <input
                placeholder="••••••••"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl animate-scaleIn">
                <i className="fas fa-exclamation-circle text-red-500 text-sm"></i>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {msg && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl animate-scaleIn">
                <i className="fas fa-check-circle text-green-500 text-sm"></i>
                <p className="text-sm text-green-600">{msg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Registrando...
                </>
              ) : (
                <>
                  <i className="fas fa-user-plus"></i>
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

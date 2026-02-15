import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("Debe ingresar usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);
      await apiLogin({ username: username.trim(), password: password.trim() });
      nav("/dashboard");
    } catch (e2) {
      setError(e2.message || "No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || username.trim() === "" || password.trim() === "";

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">
      {/* Sección Izquierda - Decorativa con overlay premium */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 relative items-center justify-center overflow-hidden">
        <img
          src="/cerdos.webp"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Granja Fondo"
        />
        {/* Overlay con gradiente premium */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/90 via-green-800/80 to-emerald-900/90"></div>

        {/* Decoraciones flotantes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-emerald-400/15 rounded-full blur-3xl animate-float delay-300"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-green-300/10 rounded-full blur-2xl animate-float delay-500"></div>

        <div className="relative z-10 text-center px-10 animate-fadeIn">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-green-200 text-sm font-medium mb-8">
            <i className="fas fa-leaf"></i>
            Sistema de Gestión Porcina
          </div>
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Gestión Inteligente<br />para tu Granja
          </h2>
          <p className="text-green-100/80 text-lg max-w-md mx-auto leading-relaxed">
            Controla la producción, sanidad y reproducción de tu ganado porcino en un solo lugar.
          </p>

          {/* Stats decorativos */}
          <div className="flex justify-center gap-8 mt-10">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-green-200/70 text-sm">Digital</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">24/7</p>
              <p className="text-green-200/70 text-sm">Acceso</p>
            </div>
            <div className="w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">∞</p>
              <p className="text-green-200/70 text-sm">Registros</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-y-auto">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="w-full max-w-md relative z-10 animate-slideUp">

          {/* Logo + Header */}
          <div className="text-center mb-8">
            <img
              src="/logo2.png"
              alt="Logo Agrofarm"
              className="mx-auto h-32 md:h-36 w-auto max-w-full object-contain mb-5 drop-shadow-xl"
            />
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Bienvenido</h1>
            <p className="text-gray-400 mt-1.5 text-sm">Accede a tu panel de control</p>
          </div>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-400 font-medium">Ingresa con tu usuario</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">
                <i className="fas fa-user text-green-500 mr-1.5 text-xs"></i>Usuario
              </label>
              <input
                type="text"
                name="username"
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

            <button
              type="submit"
              disabled={disabled}
              className="btn-primary w-full py-3 text-base mt-2"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Ingresando...
                </>
              ) : (
                <>
                  <i className="fas fa-arrow-right"></i>
                  Iniciar Sesión
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

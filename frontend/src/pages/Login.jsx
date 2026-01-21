import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (email.trim() === "" || password.trim() === "") {
      setError("Debe ingresar email y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("https://api-agrofarm.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Error al iniciar sesión.");
        return;
      }

      localStorage.setItem("token", "api-login-ok");
      localStorage.setItem("user", JSON.stringify(data.usuario));

      nav("/dashboard");
    } catch (e2) {
      setError("No se pudo conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  const disabled = loading || email.trim() === "" || password.trim() === "";

  return (
    <div className="min-h-screen flex bg-white overflow-x-hidden">
      {/* Sección Izquierda - Decorativa */}
      <div className="hidden md:flex md:w-1/2 lg:w-3/5 bg-green-900 relative items-center justify-center overflow-hidden">
        <img 
          src="/cerdos.webp" 
          className="absolute inset-0 w-full h-full object-cover opacity-40" 
          alt="Granja Fondo"
        />
        
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Gestión Inteligente <br /> para tu Granja.
          </h2>
          <p className="text-green-100 text-lg max-w-md mx-auto leading-relaxed">
            Controla la producción, sanidad y reproducción de tu ganado porcino en un solo lugar.
          </p>
        </div>
        
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-full md:w-1/2 lg:w-2/5 flex flex-col justify-center items-center p-8 lg:p-16 relative overflow-y-auto">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-10">
            <img 
              src="/logo2.png" 
              alt="Logo Agrofarm" 
              className="mx-auto h-36 md:h-44 w-auto max-w-full object-contain mb-6 drop-shadow-xl"
            />
            <h1 className="text-3xl font-bold text-gray-900">Bienvenido</h1>
            <p className="text-gray-500 mt-2">Accede a tu panel de control</p>
          </div>

          {/* Separador */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ingresa con tu correo</span>
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            <button 
              type="submit" 
              disabled={disabled}
              className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-green-600 hover:text-green-700 font-semibold">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

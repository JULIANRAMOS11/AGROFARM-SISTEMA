import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";
import toast from "react-hot-toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await login({ username, password }); toast.success("Bienvenido a AGROFARM"); navigate("/dashboard"); }
    catch (err) { toast.error(err.message || "Error al iniciar sesión"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left panel — Brand ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5"></div>
        <div className="absolute top-1/3 right-12 w-40 h-40 rounded-full bg-white/5"></div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <img src="/logo2.png" alt="AGROFARM" className="w-16 h-16 rounded-2xl shadow-xl" />
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">AGROFARM</h1>
              <p className="text-emerald-200 text-sm font-medium">Sistema de Gestión Porcina</p>
            </div>
          </div>

          <p className="text-xl text-white/90 font-medium leading-relaxed mb-10 max-w-md">
            Controla tu granja de manera inteligente. Gestión de cerdos, sanidad, reproducción, nutrición y producción en un solo lugar.
          </p>

          <div className="space-y-5">
            {[
              { icon: "fa-chart-pie", title: "Dashboard Inteligente", desc: "Estadísticas en tiempo real" },
              { icon: "fa-heart-pulse", title: "Control Sanitario", desc: "Vacunas y tratamientos al día" },
              { icon: "fa-dna", title: "Reproducción", desc: "Seguimiento completo de ciclos" }
            ].map(f => (
              <div key={f.title} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <i className={`fas ${f.icon} text-white text-sm`}></i>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.title}</p>
                  <p className="text-emerald-200/70 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center gap-4 mb-10">
            <div className="relative">
              <img src="/logo2.png" alt="AGROFARM" className="w-20 h-20 rounded-2xl shadow-xl" />
              <div className="absolute -left-8 top-2 text-3xl animate-float">🐷</div>
              <div className="absolute -right-8 top-2 text-3xl animate-float" style={{animationDelay: '1.5s'}}>🐖</div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-extrabold text-slate-800">AGROFARM</h1>
              <p className="text-xs text-gray-400 font-medium">Gestión Porcina</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Iniciar Sesión</h2>
            <p className="text-gray-500 mt-1 mb-8">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tu nombre de usuario"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100">
              {loading ? (
                <span className="inline-flex items-center gap-2"><i className="fas fa-spinner fa-spin"></i>Ingresando...</span>
              ) : (
                <span className="inline-flex items-center gap-2"><i className="fas fa-right-to-bracket"></i>Iniciar Sesión</span>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

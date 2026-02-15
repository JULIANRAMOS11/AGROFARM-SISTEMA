import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";
import toast from "react-hot-toast";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try { await register({ username, password }); toast.success("Cuenta creada con éxito"); navigate("/dashboard"); }
    catch (err) { toast.error(err.message || "Error al registrarse"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* ── Left panel — Brand ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.06%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5"></div>

        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <i className="fas fa-leaf text-white text-2xl"></i>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">AGROFARM</h1>
              <p className="text-emerald-200 text-sm font-medium">Sistema de Gestión Porcina</p>
            </div>
          </div>

          <p className="text-xl text-white/90 font-medium leading-relaxed mb-10 max-w-md">
            Únete a la plataforma líder en gestión porcina. Moderniza tu granja con tecnología de punta.
          </p>

          <div className="space-y-4">
            {[
              { icon: "fa-check-circle", text: "Gratis para empezar" },
              { icon: "fa-shield-halved", text: "Datos seguros y encriptados" },
              { icon: "fa-cloud", text: "Accede desde cualquier dispositivo" },
              { icon: "fa-headset", text: "Soporte técnico incluido" }
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <i className={`fas ${f.icon} text-emerald-300`}></i>
                <p className="text-white/90 text-sm font-medium">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <i className="fas fa-leaf text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">AGROFARM</h1>
              <p className="text-xs text-gray-400 font-medium">Gestión Porcina</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-800">Crear Cuenta</h2>
            <p className="text-gray-500 mt-1 mb-8">Regístrate para comenzar a gestionar tu granja</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Usuario</label>
              <div className="relative">
                <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Elige un nombre de usuario"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Contraseña</label>
              <div className="relative">
                <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all shadow-sm"
                  required minLength="6" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:hover:scale-100">
              {loading ? (
                <span className="inline-flex items-center gap-2"><i className="fas fa-spinner fa-spin"></i>Creando...</span>
              ) : (
                <span className="inline-flex items-center gap-2"><i className="fas fa-user-plus"></i>Crear Cuenta</span>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

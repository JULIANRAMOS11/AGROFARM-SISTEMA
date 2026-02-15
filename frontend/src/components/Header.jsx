// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/api";

/**
 * Encabezado principal de la aplicación AGROFARM.
 */
function Header() {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 shadow-lg border-b-4 border-emerald-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Título */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-xl flex items-center justify-center transform hover:scale-110 transition-all duration-300">
                <svg viewBox="0 0 64 64" className="w-10 h-10">
                  {/* Cerdo estilizado */}
                  <circle cx="32" cy="28" r="18" fill="#10b981" opacity="0.2"/>
                  <path d="M32 18 C24 18 18 24 18 32 C18 40 24 46 32 46 C40 46 46 40 46 32 C46 24 40 18 32 18 Z" fill="#059669" opacity="0.3"/>
                  <ellipse cx="32" cy="30" rx="16" ry="14" fill="#047857"/>
                  <circle cx="26" cy="28" r="2.5" fill="white"/>
                  <circle cx="38" cy="28" r="2.5" fill="white"/>
                  <ellipse cx="32" cy="34" rx="8" ry="6" fill="#065f46" opacity="0.4"/>
                  <circle cx="30" cy="35" r="1.5" fill="#064e3b"/>
                  <circle cx="34" cy="35" r="1.5" fill="#064e3b"/>
                  {/* Hoja (representa agricultura) */}
                  <path d="M14 12 Q10 8 8 10 Q6 12 10 16 Q12 18 14 14 Z" fill="#34d399" opacity="0.8"/>
                  <path d="M50 12 Q54 8 56 10 Q58 12 54 16 Q52 18 50 14 Z" fill="#34d399" opacity="0.8"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                AGROFARM
                <span className="px-2 py-0.5 bg-white/20 rounded-lg text-xs font-bold text-green-100">Pro</span>
              </h1>
              <p className="text-green-100 text-sm font-medium flex items-center gap-2">
                <i className="fas fa-shield-alt text-xs"></i>
                Sistema de Gestión Porcícola Inteligente
              </p>
            </div>
          </div>

          {/* Usuario y Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-white font-bold text-sm">{user?.nombre_completo || user?.username || "Usuario"}</span>
              <span className="text-green-100 text-xs">{user?.cargo || "Administrador"}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="group relative px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg"
            >
              <i className="fas fa-sign-out-alt"></i>
              <span className="hidden sm:inline">Cerrar sesión</span>
              <div className="absolute inset-0 bg-white/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

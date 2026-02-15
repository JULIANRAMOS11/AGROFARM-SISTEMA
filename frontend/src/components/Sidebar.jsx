// src/components/Sidebar.jsx — Sidebar moderno con glow effects
import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth } from "../services/api";

export default function Sidebar({ isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const sections = [
    { to: "/dashboard", label: "Dashboard", icon: "fa-chart-pie", category: "Principal", end: true },
    { to: "/dashboard/sanidad", label: "Sanidad", icon: "fa-heart-pulse", category: "Gestión" },
    { to: "/dashboard/reproduccion", label: "Reproducción", icon: "fa-baby", category: "Gestión" },
    { to: "/dashboard/produccion", label: "Producción", icon: "fa-chart-line", category: "Gestión" },
    { to: "/dashboard/nutricion", label: "Nutrición", icon: "fa-apple-whole", category: "Gestión" },
    { to: "/dashboard/perfil", label: "Perfil", icon: "fa-user-circle", category: "Cuenta" },
  ];

  const linkClass = ({ isActive }) => `
    group relative flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
    ${isActive
      ? "bg-white/15 text-white shadow-lg shadow-green-500/10"
      : "text-green-100/70 hover:bg-white/8 hover:text-white"
    }
  `;

  const activeBar = ({ isActive }) => isActive ? (
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-400 rounded-r-full shadow-lg shadow-green-400/50"></div>
  ) : null;

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64
        bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950
        text-white transform transition-transform duration-300
        shadow-2xl z-30 flex flex-col
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo Header */}
        <div className="px-5 py-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img
              src="/logo2.png"
              alt="Logo Agrofarm"
              className="h-10 w-auto object-contain"
            />
            <div>
              <h1 className="text-lg font-bold tracking-wide text-white">AGROFARM</h1>
              <p className="text-[10px] text-green-400/80 font-medium uppercase tracking-widest">Gestión v1.0</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Principal</p>

          {sections.filter(s => s.category === "Principal").map(section => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              className={linkClass}
              onClick={onCloseMobile}
            >
              {activeBar}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <i className={`fas ${section.icon} text-green-400 text-xs`}></i>
              </div>
              {section.label}
            </NavLink>
          ))}

          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-5 mb-2">Gestión</p>

          {sections.filter(s => s.category === "Gestión").map(section => (
            <NavLink
              key={section.to}
              to={section.to}
              className={linkClass}
              onClick={onCloseMobile}
            >
              {activeBar}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <i className={`fas ${section.icon} text-green-400 text-xs`}></i>
              </div>
              {section.label}
            </NavLink>
          ))}

          <p className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider mt-5 mb-2">Cuenta</p>

          {sections.filter(s => s.category === "Cuenta").map(section => (
            <NavLink
              key={section.to}
              to={section.to}
              className={linkClass}
              onClick={onCloseMobile}
            >
              {activeBar}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                <i className={`fas ${section.icon} text-green-400 text-xs`}></i>
              </div>
              {section.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-300/80 rounded-xl hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <i className="fas fa-sign-out-alt text-red-400 text-xs"></i>
            </div>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

// src/components/Sidebar.jsx
import { useNavigate } from "react-router-dom";

export default function Sidebar({ activeSection, onSectionChange, isMobileOpen, onCloseMobile }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const sections = [
    { id: "dashboard", label: "Dashboard", icon: "fa-chart-pie", category: "Principal" },
    { id: "pigs", label: "Cerdos", icon: "fa-paw", category: "Gestión" },
    { id: "reproduction", label: "Reproducción", icon: "fa-venus-mars", category: "Gestión" },
    { id: "health", label: "Sanidad", icon: "fa-user-md", category: "Gestión" },
    { id: "production", label: "Producción", icon: "fa-industry", category: "Gestión" },
    { id: "nutrition", label: "Nutrición", icon: "fa-utensils", category: "Gestión" },
    { id: "profile", label: "Perfil", icon: "fa-user-circle", category: "Gestión" },
  ];

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Overlay para móvil */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden"
          onClick={onCloseMobile}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-72 
        bg-gradient-to-b from-green-900 via-green-950 to-black 
        text-white transform transition-transform duration-300 
        shadow-2xl z-30 flex flex-col overflow-y-auto
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header con Logo */}
        <div className="h-36 md:h-40 flex items-center justify-center border-b border-white/10 bg-white/5 backdrop-blur-md px-4">
          <div className="flex flex-col items-center gap-3 w-full text-center">
            <img 
              src="/logo2.png" 
              alt="Logo Agrofarm" 
              className="h-28 md:h-32 w-auto max-w-full object-contain drop-shadow-2xl"
            />
            <div className="flex flex-col leading-tight">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider">AGROFARM</h1>
              <p className="text-xs md:text-sm text-green-200 uppercase tracking-widest mt-1">Gestión v1.0</p>
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-green-200/80 uppercase tracking-wider mb-2">Principal</p>
          
          {sections.filter(s => s.category === "Principal").map(section => (
            <button 
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                group w-full text-left flex items-center gap-3 px-4 py-3 
                text-sm font-semibold rounded-xl transition-colors
                ${activeSection === section.id 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10'}
              `}
            >
              <i className={`fas ${section.icon} w-5 text-green-300 group-hover:animate-bounce`}></i>
              {section.label}
            </button>
          ))}

          <p className="px-2 text-xs font-semibold text-green-200/80 uppercase tracking-wider mt-6 mb-2">Gestión</p>
          
          {sections.filter(s => s.category === "Gestión").map(section => (
            <button 
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={`
                group w-full text-left flex items-center gap-3 px-4 py-3 
                text-sm font-semibold rounded-xl transition-colors
                ${activeSection === section.id 
                  ? 'bg-white/20 text-white' 
                  : 'hover:bg-white/10'}
              `}
            >
              <i className={`fas ${section.icon} w-5 text-green-300 group-hover:animate-bounce`}></i>
              {section.label}
            </button>
          ))}
        </nav>

        {/* Botón de Logout */}
        <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-semibold text-red-200 bg-white/10 rounded-xl hover:bg-red-600 hover:text-white transition-colors"
          >
            <i className="fas fa-sign-out-alt w-5"></i>
            Cerrar Sesión
          </button>
        </div>
      </aside>
    </>
  );
}

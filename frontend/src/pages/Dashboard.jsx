// src/pages/Dashboard.jsx — Layout principal con diseño moderno
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PigForm from "../components/PigForm";
import PigList from "../components/PigList";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPatch } from "../services/api";
import { getUser } from "../services/api";

export default function Dashboard() {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPigForm, setShowPigForm] = useState(false);
  const location = useLocation();

  const isNested = location.pathname !== "/dashboard";

  const loadPigs = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiGet("/pigs");
      setPigs(data);
    } catch (err) {
      setError(err.message || "Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPigs();
  }, []);

  const handleAddPig = async (nuevoCerdo) => {
    try {
      await apiPost("/pigs", nuevoCerdo);
      toast.success("Cerdo registrado exitosamente");
      setShowPigForm(false);
      await loadPigs();
    } catch (err) {
      toast.error(err.message || "Error al crear el cerdo");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      await apiPatch(`/pigs/${id}/status`, { estado: newStatus });
      toast.success(`Estado actualizado a ${newStatus}`);
      await loadPigs();
    } catch (err) {
      toast.error(err.message || "Error al actualizar el estado");
    }
  };

  const getSectionTitle = () => {
    const path = location.pathname.split("/").pop();
    const titles = {
      dashboard: "Panel Principal",
      cerdos: "Gestión de Cerdos",
      reproduccion: "Reproducción",
      sanidad: "Sanidad",
      produccion: "Producción",
      nutricion: "Nutrición",
      perfil: "Mi Perfil"
    };
    return titles[path] || "Panel Principal";
  };

  const getSectionIcon = () => {
    const path = location.pathname.split("/").pop();
    const icons = {
      dashboard: "fa-chart-pie",
      sanidad: "fa-heart-pulse",
      reproduccion: "fa-baby",
      produccion: "fa-chart-line",
      nutricion: "fa-apple-whole",
      perfil: "fa-user-circle"
    };
    return icons[path] || "fa-chart-pie";
  };

  const userData = getUser();
  const userName = userData?.username || "Usuario";

  const activePigs = pigs.filter(p => p.estado === "ACTIVO").length;
  const femalePigs = pigs.filter(p => p.sexo === "H" || p.sexo === "Hembra" || p.sexo === "F").length;
  const avgWeight = pigs.length > 0
    ? (pigs.reduce((sum, p) => sum + (parseFloat(p.peso_actual) || 0), 0) / pigs.length).toFixed(1)
    : 0;

  const stats = [
    { label: "Total Cerdos", value: pigs.length, icon: "fa-paw", gradient: "from-green-500 to-emerald-600" },
    { label: "Activos", value: activePigs, icon: "fa-check-circle", gradient: "from-blue-500 to-blue-600" },
    { label: "Hembras", value: femalePigs, icon: "fa-venus", gradient: "from-pink-500 to-rose-600" },
    { label: "Peso Prom.", value: `${avgWeight} kg`, icon: "fa-weight-hanging", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="flex min-h-screen page-bg">
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen">

        {/* Header moderno */}
        <header className="sticky top-0 z-10 h-16 bg-white/70 backdrop-blur-xl border-b border-gray-100 flex justify-between items-center px-6 md:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <i className="fas fa-bars"></i>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <i className={`fas ${getSectionIcon()} text-white text-xs`}></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 leading-tight">{getSectionTitle()}</h2>
                <p className="text-[11px] text-gray-400 leading-tight">AGROFARM — Gestión Porcina</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{userName}</p>
              <p className="text-[11px] text-green-600 font-medium leading-tight">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-green-500/20">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="flex-1 p-5 md:p-8">

          {isNested ? (
            <div className="animate-fadeIn">
              <Outlet />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`stat-card bg-gradient-to-br ${stat.gradient} animate-slideUp`}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="stat-icon">
                      <i className={`fas ${stat.icon}`}></i>
                    </div>
                    <div className="stat-value animate-count-up" style={{ animationDelay: `${i * 0.1 + 0.3}s` }}>
                      {loading ? "—" : stat.value}
                    </div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Registro de cerdos */}
              <div className="glass-card p-6 animate-slideUp delay-400">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <i className="fas fa-paw text-green-500"></i>
                    Gestión de Cerdos
                  </h3>
                  <button
                    onClick={() => setShowPigForm(!showPigForm)}
                    className="btn-primary"
                  >
                    <i className={`fas ${showPigForm ? 'fa-times' : 'fa-plus'}`}></i>
                    {showPigForm ? "Cerrar" : "Nuevo Cerdo"}
                  </button>
                </div>

                {showPigForm && (
                  <div className="mb-6 p-5 bg-gray-50/80 rounded-xl border border-gray-100 animate-scaleIn">
                    <PigForm onAddPig={handleAddPig} />
                  </div>
                )}

                {/* Loading skeleton */}
                {loading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="skeleton w-24 h-5"></div>
                        <div className="skeleton w-16 h-5"></div>
                        <div className="skeleton w-20 h-5"></div>
                        <div className="skeleton flex-1 h-5"></div>
                      </div>
                    ))}
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <i className="fas fa-exclamation-triangle text-red-500"></i>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {!loading && !error && (
                  <PigList pigs={pigs} onToggleStatus={handleToggleStatus} />
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}

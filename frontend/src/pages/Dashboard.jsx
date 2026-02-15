// src/pages/Dashboard.jsx — Panel Principal Premium
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PigForm from "../components/PigForm";
import PigList from "../components/PigList";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPatch, apiPut, apiDelete, getUser } from "../services/api";

export default function Dashboard() {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPigForm, setShowPigForm] = useState(false);
  const [editingPig, setEditingPig] = useState(null);
  const location = useLocation();
  const isNested = location.pathname !== "/dashboard";

  const loadPigs = async () => {
    try { setLoading(true); setError(""); const data = await apiGet("/pigs"); setPigs(data); }
    catch (err) { setError(err.message || "Error al conectar con la API"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPigs(); }, []);

  const handleAddPig = async (nuevoCerdo) => {
    try { 
      if (editingPig) {
        await apiPut(`/pigs/${editingPig.id}`, nuevoCerdo); 
        toast.success("Cerdo actualizado exitosamente"); 
        setEditingPig(null);
      } else {
        await apiPost("/pigs", nuevoCerdo); 
        toast.success("Cerdo registrado exitosamente"); 
      }
      setShowPigForm(false); 
      await loadPigs(); 
    }
    catch (err) { toast.error(err.message || "Error al guardar el cerdo"); }
  };

  const handleEditPig = (pig) => {
    setEditingPig(pig);
    setShowPigForm(true);
  };

  const handleDeletePig = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este cerdo?")) return;
    try {
      await apiDelete(`/pigs/${id}`);
      toast.success("Cerdo eliminado exitosamente");
      await loadPigs();
    } catch (err) { toast.error(err.message || "Error al eliminar"); }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      await apiPatch(`/pigs/${id}/status`, { estado: newStatus });
      toast.success(`Estado actualizado a ${newStatus}`); await loadPigs();
    } catch (err) { toast.error(err.message || "Error al actualizar"); }
  };

  const getSectionTitle = () => {
    const path = location.pathname.split("/").pop();
    const map = { dashboard: "Panel Principal", sanidad: "Sanidad", reproduccion: "Reproducción", produccion: "Producción", nutricion: "Nutrición", perfil: "Mi Perfil" };
    return map[path] || "Panel Principal";
  };
  const getSectionIcon = () => {
    const path = location.pathname.split("/").pop();
    const map = { dashboard: "fa-chart-pie", sanidad: "fa-heart-pulse", reproduccion: "fa-dna", produccion: "fa-chart-line", nutricion: "fa-apple-whole", perfil: "fa-user-circle" };
    return map[path] || "fa-chart-pie";
  };

  const userData = getUser();
  const userName = userData?.username || "Usuario";
  const activePigs = pigs.filter(p => p.estado === "ACTIVO").length;
  const femalePigs = pigs.filter(p => p.sexo === "H" || p.sexo === "Hembra" || p.sexo === "F").length;
  const avgWeight = pigs.length > 0 ? (pigs.reduce((sum, p) => sum + (parseFloat(p.peso_actual) || 0), 0) / pigs.length).toFixed(1) : 0;

  const stats = [
    { label: "Total Cerdos", value: pigs.length, icon: "fa-paw", color: "from-emerald-500 to-green-600", shadow: "shadow-emerald-500/25" },
    { label: "Activos", value: activePigs, icon: "fa-check-circle", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/25" },
    { label: "Hembras", value: femalePigs, icon: "fa-venus", color: "from-pink-500 to-rose-600", shadow: "shadow-pink-500/25" },
    { label: "Peso Promedio", value: `${avgWeight} kg`, icon: "fa-weight-hanging", color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/25" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* ── Header ── */}
        <header className="sticky top-0 z-10 h-16 bg-white border-b border-gray-200/80 flex justify-between items-center px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
              <i className="fas fa-bars"></i>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                <i className={`fas ${getSectionIcon()} text-white text-sm`}></i>
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">{getSectionTitle()}</h2>
                <p className="text-[11px] text-gray-400 font-medium">AGROFARM · Gestión Porcina</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-slate-700">{userName}</p>
              <p className="text-[11px] text-emerald-600 font-semibold">Administrador</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/25">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* ── Main Content ── */}
        <main className="flex-1 p-6 lg:p-8">
          {isNested ? (
            <Outlet />
          ) : (
            <div className="space-y-8">

              {/* Bienvenida */}
              <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Bienvenido, {userName} 👋</h1>
                <p className="text-gray-500 mt-1">Aquí tienes un resumen de tu granja.</p>
              </div>

              {/* ── Stat Cards ── */}
              {loading ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100 animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                  {stats.map(stat => (
                    <div key={stat.label} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 group">
                      {/* Decorative gradient circle */}
                      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg ${stat.shadow}`}>
                        <i className={`fas ${stat.icon} text-white text-lg`}></i>
                      </div>
                      <p className="text-3xl font-extrabold text-slate-800">{stat.value}</p>
                      <p className="text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Gestión de Cerdos ── */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
                <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-emerald-500/20">
                      <i className="fas fa-paw text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">Gestión de Cerdos</h3>
                      <p className="text-xs text-gray-400">{pigs.length} registrados en total</p>
                    </div>
                  </div>
                  <button onClick={() => { setShowPigForm(!showPigForm); setEditingPig(null); }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300">
                    <i className={`fas ${showPigForm ? 'fa-times' : 'fa-plus'}`}></i>
                    {showPigForm ? "Cerrar" : "Nuevo Cerdo"}
                  </button>
                </div>

                <div className="p-6 lg:p-8">
                  {showPigForm && (
                    <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <h3 className="text-lg font-bold text-slate-800 mb-4">
                        {editingPig ? "🐷 Editar Cerdo" : "✨ Nuevo Cerdo"}
                      </h3>
                      <PigForm onAddPig={handleAddPig} initialData={editingPig} />
                    </div>
                  )}

                  {loading && (
                    <div className="space-y-4">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-3 p-5 bg-red-50 border border-red-200 rounded-2xl">
                      <i className="fas fa-triangle-exclamation text-red-500 text-lg"></i>
                      <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  {!loading && !error && (
                    <PigList pigs={pigs} onToggleStatus={handleToggleStatus} onEdit={handleEditPig} onDelete={handleDeletePig} />
                  )}
                </div>
              </div>

            </div>
          )}
        </main>
      </div>
    </div>
  );
}

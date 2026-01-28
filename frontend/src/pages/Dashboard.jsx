// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import PigForm from "../components/PigForm";
import PigList from "../components/PigList";
import Reproduccion from "./Reproduccion";
import Sanidad from "./Sanidad";
import Produccion from "./Produccion";
import Nutricion from "./Nutricion";
import Perfil from "./Perfil";

export default function Dashboard() {
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("pigs");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Cargar cerdos desde la API
  const loadPigs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const res = await fetch("https://api-agrofarm.onrender.com/api/pigs", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
        throw new Error("Error al cargar los cerdos");
      }

      const data = await res.json();
      setPigs(data);
    } catch (err) {
      setError(err.message || "Error al conectar con la API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPigs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Agrega un nuevo cerdo a la lista
  const handleAddPig = async (nuevoCerdo) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://api-agrofarm.onrender.com/api/pigs", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(nuevoCerdo),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear el cerdo");
      }

      // Recargar la lista
      await loadPigs();
    } catch (err) {
      alert(err.message);
    }
  };

  // Cambia el estado del cerdo
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token");
      const newStatus = currentStatus === "ACTIVO" ? "INACTIVO" : "ACTIVO";
      
      const res = await fetch(`https://api-agrofarm.onrender.com/api/pigs/${id}/status`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el estado");
      }

      // Recargar la lista
      await loadPigs();
    } catch (err) {
      alert(err.message);
    }
  };

  const getSectionTitle = () => {
    const titles = {
      dashboard: "Resumen General",
      pigs: "Gestión de Cerdos",
      reproduction: "Reproducción",
      health: "Sanidad",
      production: "Producción",
      nutrition: "Nutrición",
      profile: "Perfil de Usuario"
    };
    return titles[activeSection] || "Dashboard";
  };

  const userString = localStorage.getItem("user");
  let userName = "Usuario";
  try {
    const user = userString ? JSON.parse(userString) : null;
    userName = user?.username || user?.email || "Usuario";
  } catch (e) {
    // ignore
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="sticky top-0 z-10 h-20 bg-white/80 backdrop-blur-md border-b border-white/40 shadow-xl shadow-green-900/10 flex justify-between items-center px-6 md:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-green-800 hover:text-green-600"
            >
              <i className="fas fa-bars text-2xl"></i>
            </button>
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{getSectionTitle()}</h2>
              <p className="text-xs text-gray-500">Bienvenido al sistema de gestión</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-gray-800">{userName}</p>
              <p className="text-xs text-green-600">Administrador</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-green-600 flex items-center justify-center text-white font-bold shadow-lg border border-white/60">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Contenido por Sección */}
        <main className="flex-1 p-6 md:p-10">
          
          {activeSection === "pigs" && (
            <div className="space-y-6">
              {/* Tarjeta de Registro */}
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Registrar Nuevo Cerdo</h3>
                <PigForm onAddPig={handleAddPig} />
              </div>

              {/* Tarjeta de Listado */}
              <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Listado de Cerdos</h3>
                {loading && <p className="text-gray-600">Cargando...</p>}
                {error && <p className="text-red-600">{error}</p>}
                {!loading && !error && (
                  <PigList pigs={pigs} onToggleStatus={handleToggleStatus} />
                )}
              </div>
            </div>
          )}

          {activeSection === "dashboard" && (
            <div className="bg-white/85 backdrop-blur-md rounded-2xl shadow-xl border border-white/40 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Estadísticas Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                  <i className="fas fa-paw text-3xl mb-3"></i>
                  <p className="text-sm opacity-90">Total Cerdos</p>
                  <p className="text-4xl font-bold">{pigs.length}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                  <i className="fas fa-check-circle text-3xl mb-3"></i>
                  <p className="text-sm opacity-90">Activos</p>
                  <p className="text-4xl font-bold">{pigs.filter(p => p.estado === "ACTIVO").length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                  <i className="fas fa-weight text-3xl mb-3"></i>
                  <p className="text-sm opacity-90">Peso Promedio</p>
                  <p className="text-4xl font-bold">
                    {pigs.length > 0 
                      ? (pigs.reduce((sum, p) => sum + p.peso_actual, 0) / pigs.length).toFixed(1)
                      : 0} kg
                  </p>
                </div>
              </div>
            </div>
          )}

          {["reproduction", "health", "production", "nutrition", "profile"].includes(activeSection) && (
            <div>
              {activeSection === "reproduction" && <Reproduccion />}
              {activeSection === "health" && <Sanidad />}
              {activeSection === "production" && <Produccion />}
              {activeSection === "nutrition" && <Nutricion />}
              {activeSection === "profile" && <Perfil />}
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Produccion() {
  const [registros, setRegistros] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "", fecha: "", peso: "", edad_dias: "", ganancia_diaria: "",
    consumo_alimento_kg: "", conversion_alimenticia: "", lote: "", observaciones: ""
  });

  useEffect(() => {
    fetchRegistros();
    fetchPigs();
    fetchEstadisticas();
  }, []);

  const fetchRegistros = async () => {
    try { const data = await apiGet("/produccion"); setRegistros(data); }
    catch (error) { console.error("Error al cargar registros:", error); }
  };

  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); }
    catch (error) { console.error("Error al cargar cerdos:", error); }
  };

  const fetchEstadisticas = async () => {
    try { const data = await apiGet("/produccion/estadisticas"); setEstadisticas(data); }
    catch (error) { console.error("Error al cargar estadísticas:", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/produccion", formData);
      toast.success("Registro de producción creado exitosamente");
      setShowForm(false);
      fetchRegistros();
      fetchEstadisticas();
      setFormData({ pig_id: "", fecha: "", peso: "", edad_dias: "", ganancia_diaria: "", consumo_alimento_kg: "", conversion_alimenticia: "", lote: "", observaciones: "" });
    } catch (error) {
      console.error("Error al crear registro:", error);
      toast.error(error.message || "Error de conexión");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        await apiDelete(`/produccion/${id}`);
        toast.success("Registro eliminado");
        fetchRegistros();
        fetchEstadisticas();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error(error.message || "Error de conexión");
      }
    }
  };

  const miniStats = [
    { label: "En Producción", value: estadisticas?.total_cerdos || 0, icon: "fa-paw", gradient: "from-blue-500 to-blue-600" },
    { label: "Peso Prom. (kg)", value: estadisticas?.peso_promedio ? parseFloat(estadisticas.peso_promedio).toFixed(1) : "0", icon: "fa-weight-hanging", gradient: "from-emerald-500 to-emerald-600" },
    { label: "Ganancia Diaria", value: estadisticas?.ganancia_promedio ? parseFloat(estadisticas.ganancia_promedio).toFixed(3) : "0", icon: "fa-arrow-trend-up", gradient: "from-purple-500 to-purple-600" },
    { label: "Conv. Alimenticia", value: estadisticas?.conversion_promedio ? parseFloat(estadisticas.conversion_promedio).toFixed(2) : "0", icon: "fa-chart-simple", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-chart-line text-green-500"></i>Producción
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{registros.length} registros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* Mini Stats */}
      {estadisticas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {miniStats.map((stat, i) => (
            <div key={stat.label} className={`stat-card bg-gradient-to-br ${stat.gradient} animate-slideUp`} style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="stat-icon"><i className={`fas ${stat.icon}`}></i></div>
              <div className="stat-value text-xl">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 animate-scaleIn">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-plus-circle text-green-500"></i>Nuevo Registro de Producción
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Cerdo <span className="required">*</span></label>
              <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                <option value="">Seleccione...</option>
                {pigs.map((pig) => <option key={pig.id} value={pig.id}>{pig.codigo_arete} - {pig.sexo}</option>)}
              </select>
            </div>
            <div>
              <label className="form-label">Fecha <span className="required">*</span></label>
              <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="input-modern" required />
            </div>
            <div>
              <label className="form-label">Peso (kg) <span className="required">*</span></label>
              <input type="number" step="0.01" value={formData.peso} onChange={(e) => setFormData({ ...formData, peso: e.target.value })} className="input-modern" required placeholder="0.00" min="0" />
            </div>
            <div>
              <label className="form-label">Edad (días)</label>
              <input type="number" value={formData.edad_dias} onChange={(e) => setFormData({ ...formData, edad_dias: e.target.value })} className="input-modern" min="0" />
            </div>
            <div>
              <label className="form-label">Ganancia Diaria (kg)</label>
              <input type="number" step="0.001" value={formData.ganancia_diaria} onChange={(e) => setFormData({ ...formData, ganancia_diaria: e.target.value })} className="input-modern" placeholder="0.000" />
            </div>
            <div>
              <label className="form-label">Consumo Alimento (kg)</label>
              <input type="number" step="0.01" value={formData.consumo_alimento_kg} onChange={(e) => setFormData({ ...formData, consumo_alimento_kg: e.target.value })} className="input-modern" placeholder="0.00" min="0" />
            </div>
            <div>
              <label className="form-label">Conversión Alimenticia</label>
              <input type="number" step="0.01" value={formData.conversion_alimenticia} onChange={(e) => setFormData({ ...formData, conversion_alimenticia: e.target.value })} className="input-modern" placeholder="0.00" min="0" />
            </div>
            <div>
              <label className="form-label">Lote</label>
              <input type="text" value={formData.lote} onChange={(e) => setFormData({ ...formData, lote: e.target.value })} className="input-modern" />
            </div>
            <div className="md:col-span-3">
              <label className="form-label">Observaciones</label>
              <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className="input-modern" rows="2" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
          </div>
        </form>
      )}

      {/* Tabla */}
      <div className="glass-card overflow-hidden">
        {registros.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-chart-line"></i>
            <p>No hay registros de producción todavía.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Cerdo</th>
                  <th>Fecha</th>
                  <th>Peso (kg)</th>
                  <th>Edad</th>
                  <th>Ganancia</th>
                  <th>Consumo</th>
                  <th>Conv.</th>
                  <th>Lote</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => (
                  <tr key={r.id}>
                    <td className="font-semibold text-gray-900">{r.codigo_arete}</td>
                    <td>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td><span className="font-bold text-emerald-600">{parseFloat(r.peso).toFixed(2)}</span></td>
                    <td>{r.edad_dias || "—"}</td>
                    <td>{r.ganancia_diaria ? parseFloat(r.ganancia_diaria).toFixed(3) : "—"}</td>
                    <td>{r.consumo_alimento_kg ? parseFloat(r.consumo_alimento_kg).toFixed(2) : "—"}</td>
                    <td>{r.conversion_alimenticia ? parseFloat(r.conversion_alimenticia).toFixed(2) : "—"}</td>
                    <td>{r.lote || "—"}</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(r.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

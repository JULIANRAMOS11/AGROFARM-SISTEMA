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

  useEffect(() => { fetchRegistros(); fetchPigs(); fetchEstadisticas(); }, []);

  const fetchRegistros = async () => {
    try { const data = await apiGet("/produccion"); setRegistros(data); } catch (err) { console.error(err); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); } catch (err) { console.error(err); }
  };
  const fetchEstadisticas = async () => {
    try { const data = await apiGet("/produccion/estadisticas"); setEstadisticas(data); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/produccion", formData);
      toast.success("Registro creado exitosamente");
      setShowForm(false); fetchRegistros(); fetchEstadisticas();
      setFormData({ pig_id: "", fecha: "", peso: "", edad_dias: "", ganancia_diaria: "", consumo_alimento_kg: "", conversion_alimenticia: "", lote: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/produccion/${id}`); toast.success("Eliminado"); fetchRegistros(); fetchEstadisticas(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const stats = [
    { label: "En Producción", value: estadisticas?.total_cerdos || 0, icon: "fa-pig", gradient: "from-blue-500 to-indigo-600" },
    { label: "Peso Promedio", value: estadisticas?.peso_promedio ? parseFloat(estadisticas.peso_promedio).toFixed(1) + " kg" : "0 kg", icon: "fa-weight-hanging", gradient: "from-emerald-500 to-teal-600" },
    { label: "Ganancia Diaria", value: estadisticas?.ganancia_promedio ? parseFloat(estadisticas.ganancia_promedio).toFixed(3) + " kg" : "0 kg", icon: "fa-arrow-trend-up", gradient: "from-violet-500 to-purple-600" },
    { label: "Conv. Alimenticia", value: estadisticas?.conversion_promedio ? parseFloat(estadisticas.conversion_promedio).toFixed(2) : "0", icon: "fa-chart-simple", gradient: "from-amber-500 to-orange-600" },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2><i className="fas fa-chart-line"></i>Producción</h2>
          <p className="subtitle">Control de producción y rendimiento · {registros.length} registros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
          {showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* ── Stats ── */}
      {estadisticas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {stats.map((s, i) => (
            <div key={s.label} className={`stat-card bg-gradient-to-br ${s.gradient}`}>
              <div className="stat-icon"><i className={`fas ${s.icon}`}></i></div>
              <div className="stat-value text-xl">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Form ── */}
      {showForm && (
        <div className="form-card anim-scaleIn">
          <h3><i className="fas fa-plus-circle"></i>Nuevo Registro de Producción</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Cerdo <span className="required">*</span></label>
                <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                  <option value="">Seleccione...</option>
                  {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.sexo}</option>)}
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
                <input type="number" step="0.01" value={formData.conversion_alimenticia} onChange={(e) => setFormData({ ...formData, conversion_alimenticia: e.target.value })} className="input-modern" placeholder="0.00" />
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
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Table ── */}
      <div className="table-container">
        {registros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-chart-line"></i></div>
            <p>No hay registros de producción</p>
            <p className="empty-sub">Agrega un registro para empezar el seguimiento</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead><tr><th>Cerdo</th><th>Fecha</th><th>Peso</th><th>Edad</th><th>Ganancia</th><th>Consumo</th><th>Conv.</th><th>Lote</th><th className="text-center">Acciones</th></tr></thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.id}>
                    <td><span className="font-semibold text-gray-900">{r.codigo_arete}</span></td>
                    <td>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td><span className="font-bold text-emerald-600">{parseFloat(r.peso).toFixed(2)} kg</span></td>
                    <td>{r.edad_dias || <span className="text-gray-300">—</span>}</td>
                    <td>{r.ganancia_diaria ? parseFloat(r.ganancia_diaria).toFixed(3) : <span className="text-gray-300">—</span>}</td>
                    <td>{r.consumo_alimento_kg ? parseFloat(r.consumo_alimento_kg).toFixed(2) : <span className="text-gray-300">—</span>}</td>
                    <td>{r.conversion_alimenticia ? parseFloat(r.conversion_alimenticia).toFixed(2) : <span className="text-gray-300">—</span>}</td>
                    <td>{r.lote || <span className="text-gray-300">—</span>}</td>
                    <td className="text-center"><button onClick={() => handleDelete(r.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button></td>
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

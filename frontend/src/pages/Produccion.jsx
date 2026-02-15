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
    try { 
      const data = await apiGet("/produccion"); 
      setRegistros(Array.isArray(data) ? data : []); 
    } catch (err) { 
      console.error("Error al cargar registros:", err); 
      toast.error("Error al cargar registros");
      setRegistros([]); 
    } 
  };
  
  const fetchPigs = async () => { 
    try { 
      const data = await apiGet("/pigs"); 
      setPigs(Array.isArray(data) ? data : []); 
    } catch (err) { 
      console.error("Error al cargar cerdos:", err); 
      setPigs([]); 
    } 
  };
  
  const fetchEstadisticas = async () => { 
    try { 
      const data = await apiGet("/produccion/estadisticas"); 
      setEstadisticas(data || null); 
    } catch (err) { 
      console.error("Error al cargar estadísticas:", err); 
      setEstadisticas(null); 
    } 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/produccion", formData);
      toast.success("Registro creado"); setShowForm(false); fetchRegistros(); fetchEstadisticas();
      setFormData({ pig_id: "", fecha: "", peso: "", edad_dias: "", ganancia_diaria: "", consumo_alimento_kg: "", conversion_alimenticia: "", lote: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/produccion/${id}`); toast.success("Eliminado"); fetchRegistros(); fetchEstadisticas(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const stats = [
    { label: "En Producción", value: estadisticas?.total_cerdos || 0, icon: "fa-paw", color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-500/25" },
    { label: "Peso Promedio", value: estadisticas?.peso_promedio ? parseFloat(estadisticas.peso_promedio).toFixed(1) + " kg" : "0 kg", icon: "fa-weight-hanging", color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-500/25" },
    { label: "Ganancia Diaria", value: estadisticas?.ganancia_promedio ? parseFloat(estadisticas.ganancia_promedio).toFixed(3) + " kg" : "0 kg", icon: "fa-arrow-trend-up", color: "from-violet-500 to-purple-600", shadow: "shadow-violet-500/25" },
    { label: "Conv. Alimenticia", value: estadisticas?.conversion_promedio ? parseFloat(estadisticas.conversion_promedio).toFixed(2) : "0", icon: "fa-chart-simple", color: "from-amber-500 to-orange-600", shadow: "shadow-amber-500/25" },
  ];

  // Reusable input class
  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fas fa-chart-line text-white"></i>
            </div>
            Producción
          </h1>
          <p className="text-gray-500 mt-1">{(registros || []).length} registros de producción</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>{showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* Stats */}
      {estadisticas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map(s => (
            <div key={s.label} className="relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl p-6 transition-all duration-300 hover:-translate-y-1 group">
              <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg ${s.shadow}`}>
                <i className={`fas ${s.icon} text-white text-lg`}></i>
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{s.value}</p>
              <p className="text-sm text-gray-500 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100"><i className="fas fa-plus-circle text-emerald-500"></i>Nuevo Registro</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cerdo <span className="text-red-500">*</span></label><select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className={inputClass} required><option value="">Seleccione...</option>{(pigs || []).map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.sexo}</option>)}</select></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha <span className="text-red-500">*</span></label><input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className={inputClass} required /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Peso (kg) <span className="text-red-500">*</span></label><input type="number" step="0.01" value={formData.peso} onChange={(e) => setFormData({ ...formData, peso: e.target.value })} className={inputClass} required placeholder="0.00" min="0" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Edad (días)</label><input type="number" value={formData.edad_dias} onChange={(e) => setFormData({ ...formData, edad_dias: e.target.value })} className={inputClass} min="0" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Ganancia Diaria</label><input type="number" step="0.001" value={formData.ganancia_diaria} onChange={(e) => setFormData({ ...formData, ganancia_diaria: e.target.value })} className={inputClass} placeholder="0.000" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Consumo Alimento</label><input type="number" step="0.01" value={formData.consumo_alimento_kg} onChange={(e) => setFormData({ ...formData, consumo_alimento_kg: e.target.value })} className={inputClass} placeholder="0.00" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Conv. Alimenticia</label><input type="number" step="0.01" value={formData.conversion_alimenticia} onChange={(e) => setFormData({ ...formData, conversion_alimenticia: e.target.value })} className={inputClass} placeholder="0.00" /></div>
              <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Lote</label><input type="text" value={formData.lote} onChange={(e) => setFormData({ ...formData, lote: e.target.value })} className={inputClass} /></div>
              <div className="md:col-span-3"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label><textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className={inputClass} rows="2" /></div>
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        {!registros || registros.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"><i className="fas fa-chart-line text-blue-500 text-2xl"></i></div>
            <p className="text-gray-500 font-medium">No hay registros de producción</p><p className="text-sm text-gray-400 mt-1">Comienza agregando un registro</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cerdo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Peso</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Edad</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Ganancia</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Consumo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conv.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lote</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acc.</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {(registros || []).map(r => (
                  <tr key={r.id} className="hover:bg-green-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{r.codigo_arete}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(r.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm font-bold text-emerald-600">{parseFloat(r.peso).toFixed(2)} kg</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.edad_dias || "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.ganancia_diaria ? parseFloat(r.ganancia_diaria).toFixed(3) : "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.consumo_alimento_kg ? parseFloat(r.consumo_alimento_kg).toFixed(2) : "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.conversion_alimenticia ? parseFloat(r.conversion_alimenticia).toFixed(2) : "—"}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.lote || "—"}</td>
                    <td className="px-6 py-4 text-center"><button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all inline-flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button></td>
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

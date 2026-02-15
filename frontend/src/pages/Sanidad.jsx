import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiPut, apiDelete } from "../services/api";

export default function Sanidad() {
  const [registros, setRegistros] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "",
    dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "",
    diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "", observaciones: ""
  });

  useEffect(() => { fetchRegistros(); fetchPigs(); }, []);

  const fetchRegistros = async () => {
    try { const data = await apiGet("/sanidad"); setRegistros(data); } catch (err) { console.error(err); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiPut(`/sanidad/${editingId}`, formData);
        toast.success("Registro actualizado");
        setEditingId(null);
      } else {
        await apiPost("/sanidad", formData);
        toast.success("Registro sanitario creado");
      }
      setShowForm(false); fetchRegistros();
      setFormData({ pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "", dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "", diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleEdit = (registro) => {
    setEditingId(registro.id);
    setFormData({
      pig_id: registro.pig_id,
      tipo: registro.tipo,
      fecha: registro.fecha?.split('T')[0] || "",
      medicamento_vacuna: registro.medicamento_vacuna || "",
      dosis: registro.dosis || "",
      via_administracion: registro.via_administracion || "INTRAMUSCULAR",
      veterinario: registro.veterinario || "",
      diagnostico: registro.diagnostico || "",
      tratamiento: registro.tratamiento || "",
      costo: registro.costo || "",
      proxima_aplicacion: registro.proxima_aplicacion?.split('T')[0] || "",
      observaciones: registro.observaciones || ""
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try { await apiDelete(`/sanidad/${id}`); toast.success("Eliminado"); fetchRegistros(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const getTipoBadge = (tipo) => {
    const map = {
      VACUNA: { bg: "bg-blue-100", text: "text-blue-700", icon: "fa-syringe" },
      TRATAMIENTO: { bg: "bg-purple-100", text: "text-purple-700", icon: "fa-pills" },
      DESPARASITACION: { bg: "bg-teal-100", text: "text-teal-700", icon: "fa-shield-virus" },
      DIAGNOSTICO: { bg: "bg-amber-100", text: "text-amber-700", icon: "fa-stethoscope" }
    };
    const s = map[tipo] || { bg: "bg-gray-100", text: "text-gray-700", icon: "fa-tag" };
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
        <i className={`fas ${s.icon} text-[10px]`}></i>{tipo}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <i className="fas fa-heart-pulse text-white"></i>
            </div>
            Sanidad
          </h1>
          <p className="text-gray-500 mt-1">{registros.length} registros sanitarios</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setFormData({ pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "", dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "", diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "", observaciones: "" }); }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-300">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
          {showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* ── Formulario ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100">
            <i className="fas fa-file-medical text-emerald-500"></i>
            {editingId ? "Editar Registro Sanitario" : "Nuevo Registro Sanitario"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cerdo <span className="text-red-500">*</span></label>
                <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" required>
                  <option value="">Seleccione un cerdo...</option>
                  {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.raza} ({p.sexo})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo <span className="text-red-500">*</span></label>
                <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" required>
                  <option value="VACUNA">🩺 Vacuna</option>
                  <option value="TRATAMIENTO">💊 Tratamiento</option>
                  <option value="DESPARASITACION">🛡️ Desparasitación</option>
                  <option value="DIAGNOSTICO">🔬 Diagnóstico</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha <span className="text-red-500">*</span></label>
                <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Medicamento / Vacuna</label>
                <input type="text" value={formData.medicamento_vacuna} onChange={(e) => setFormData({ ...formData, medicamento_vacuna: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Nombre del medicamento" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Dosis</label>
                <input type="text" value={formData.dosis} onChange={(e) => setFormData({ ...formData, dosis: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Ej: 5ml" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vía</label>
                <select value={formData.via_administracion} onChange={(e) => setFormData({ ...formData, via_administracion: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all">
                  <option value="INTRAMUSCULAR">Intramuscular</option>
                  <option value="SUBCUTANEA">Subcutánea</option>
                  <option value="ORAL">Oral</option>
                  <option value="TOPICA">Tópica</option>
                  <option value="INTRAVENOSA">Intravenosa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Veterinario</label>
                <input type="text" value={formData.veterinario} onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="Dr. ..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Costo ($)</label>
                <input type="number" step="0.01" min="0" value={formData.costo} onChange={(e) => setFormData({ ...formData, costo: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="0.00" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Próxima Aplicación</label>
                <input type="date" value={formData.proxima_aplicacion} onChange={(e) => setFormData({ ...formData, proxima_aplicacion: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" />
              </div>
              <div className="lg:col-span-3">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label>
                <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" rows="2" placeholder="Notas adicionales..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
              <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300">
                <i className="fas fa-save"></i>{editingId ? "Actualizar" : "Guardar"} Registro
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tabla ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
        {registros.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
              <i className="fas fa-heart-pulse text-emerald-500 text-2xl"></i>
            </div>
            <p className="text-gray-500 font-medium">No hay registros sanitarios</p>
            <p className="text-sm text-gray-400 mt-1">Haz clic en "Nuevo Registro" para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cerdo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Medicamento</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dosis</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Veterinario</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Costo</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {registros.map(r => (
                  <tr key={r.id} className="hover:bg-green-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{r.codigo_arete}</td>
                    <td className="px-6 py-4">{getTipoBadge(r.tipo)}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(r.fecha).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.medicamento_vacuna || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.dosis || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{r.veterinario || <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{r.costo ? `$${parseFloat(r.costo).toFixed(2)}` : <span className="text-gray-300">—</span>}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => handleEdit(r)} className="w-8 h-8 rounded-lg text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 inline-flex items-center justify-center">
                          <i className="fas fa-edit text-xs"></i>
                        </button>
                        <button onClick={() => handleDelete(r.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 inline-flex items-center justify-center">
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                      </div>
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

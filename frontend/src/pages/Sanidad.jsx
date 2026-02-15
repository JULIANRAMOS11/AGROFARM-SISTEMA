import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Sanidad() {
  const [registros, setRegistros] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "",
    dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "",
    diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "", observaciones: ""
  });

  useEffect(() => { fetchRegistros(); fetchPigs(); }, []);

  const fetchRegistros = async () => {
    try { const data = await apiGet("/sanidad"); setRegistros(data); }
    catch (err) { console.error(err); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); }
    catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/sanidad", formData);
      toast.success("Registro sanitario creado");
      setShowForm(false); fetchRegistros();
      setFormData({ pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "", dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "", diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este registro?")) return;
    try { await apiDelete(`/sanidad/${id}`); toast.success("Eliminado"); fetchRegistros(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const getTipoBadge = (tipo) => {
    const map = {
      VACUNA: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "fa-syringe" },
      TRATAMIENTO: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "fa-pills" },
      DESPARASITACION: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "fa-shield-virus" },
      DIAGNOSTICO: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "fa-stethoscope" }
    };
    const s = map[tipo] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "fa-tag" };
    return (
      <span className={`badge ${s.bg} ${s.text} border ${s.border}`}>
        <i className={`fas ${s.icon} mr-1 text-[10px]`}></i>{tipo}
      </span>
    );
  };

  return (
    <div>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div>
          <h2><i className="fas fa-heart-pulse"></i>Sanidad</h2>
          <p className="subtitle">Gestión de registros sanitarios · {registros.length} registros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
          {showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* ── Formulario ── */}
      {showForm && (
        <div className="form-card anim-scaleIn">
          <h3><i className="fas fa-file-medical"></i>Nuevo Registro Sanitario</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Cerdo <span className="required">*</span></label>
                <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                  <option value="">Seleccione un cerdo...</option>
                  {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.raza} ({p.sexo})</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Tipo <span className="required">*</span></label>
                <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="input-modern" required>
                  <option value="VACUNA">🩺 Vacuna</option>
                  <option value="TRATAMIENTO">💊 Tratamiento</option>
                  <option value="DESPARASITACION">🛡 Desparasitación</option>
                  <option value="DIAGNOSTICO">🔬 Diagnóstico</option>
                </select>
              </div>
              <div>
                <label className="form-label">Fecha <span className="required">*</span></label>
                <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="input-modern" required />
              </div>
              <div>
                <label className="form-label">Medicamento / Vacuna</label>
                <input type="text" value={formData.medicamento_vacuna} onChange={(e) => setFormData({ ...formData, medicamento_vacuna: e.target.value })} className="input-modern" placeholder="Nombre del medicamento" />
              </div>
              <div>
                <label className="form-label">Dosis</label>
                <input type="text" value={formData.dosis} onChange={(e) => setFormData({ ...formData, dosis: e.target.value })} className="input-modern" placeholder="Ej: 5ml" />
              </div>
              <div>
                <label className="form-label">Vía de Administración</label>
                <select value={formData.via_administracion} onChange={(e) => setFormData({ ...formData, via_administracion: e.target.value })} className="input-modern">
                  <option value="INTRAMUSCULAR">Intramuscular</option>
                  <option value="SUBCUTANEA">Subcutánea</option>
                  <option value="ORAL">Oral</option>
                  <option value="TOPICA">Tópica</option>
                  <option value="INTRAVENOSA">Intravenosa</option>
                </select>
              </div>
              <div>
                <label className="form-label">Veterinario</label>
                <input type="text" value={formData.veterinario} onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })} className="input-modern" placeholder="Nombre del veterinario" />
              </div>
              <div>
                <label className="form-label">Costo ($)</label>
                <input type="number" step="0.01" min="0" value={formData.costo} onChange={(e) => setFormData({ ...formData, costo: e.target.value })} className="input-modern" placeholder="0.00" />
              </div>
              <div>
                <label className="form-label">Próxima Aplicación</label>
                <input type="date" value={formData.proxima_aplicacion} onChange={(e) => setFormData({ ...formData, proxima_aplicacion: e.target.value })} className="input-modern" />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="form-label">Diagnóstico</label>
                <input type="text" value={formData.diagnostico} onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })} className="input-modern" placeholder="Describe el diagnóstico" />
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <label className="form-label">Observaciones</label>
                <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className="input-modern" rows="2" placeholder="Notas adicionales..." />
              </div>
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
              <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar Registro</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* ── Tabla ── */}
      <div className="table-container">
        {registros.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><i className="fas fa-heart-pulse"></i></div>
            <p>No hay registros sanitarios</p>
            <p className="empty-sub">Agrega un nuevo registro para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>Cerdo</th>
                  <th>Tipo</th>
                  <th>Fecha</th>
                  <th>Medicamento</th>
                  <th>Dosis</th>
                  <th>Veterinario</th>
                  <th>Costo</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map(r => (
                  <tr key={r.id}>
                    <td>
                      <span className="font-semibold text-gray-900">{r.codigo_arete}</span>
                    </td>
                    <td>{getTipoBadge(r.tipo)}</td>
                    <td>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td>{r.medicamento_vacuna || <span className="text-gray-300">—</span>}</td>
                    <td>{r.dosis || <span className="text-gray-300">—</span>}</td>
                    <td>{r.veterinario || <span className="text-gray-300">—</span>}</td>
                    <td>{r.costo ? <span className="font-semibold text-emerald-600">${parseFloat(r.costo).toFixed(2)}</span> : <span className="text-gray-300">—</span>}</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(r.id)} className="btn-danger" title="Eliminar">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
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

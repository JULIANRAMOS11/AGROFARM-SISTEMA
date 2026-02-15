import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Reproduccion() {
  const [activeTab, setActiveTab] = useState("servicios");
  const [servicios, setServicios] = useState([]);
  const [partos, setPartos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showPartoForm, setShowPartoForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "", tipo_servicio: "MONTA_NATURAL", fecha_servicio: "",
    verraco: "", fecha_probable_parto: "", estado: "GESTANTE", observaciones: ""
  });
  const [partoData, setPartoData] = useState({
    reproduccion_id: "", pig_id: "", fecha_parto: "",
    lechones_nacidos_vivos: 0, lechones_nacidos_muertos: 0,
    lechones_momificados: 0, peso_promedio_lechon: "", observaciones: ""
  });

  useEffect(() => { fetchServicios(); fetchPartos(); fetchPigs(); }, []);

  const fetchServicios = async () => {
    try { const data = await apiGet("/reproduccion"); setServicios(data); } catch (err) { console.error(err); }
  };
  const fetchPartos = async () => {
    try { const data = await apiGet("/reproduccion/partos/all"); setPartos(data); } catch (err) { console.error(err); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data.filter(p => p.sexo === "H" || p.sexo === "Hembra")); } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/reproduccion", formData);
      toast.success("Servicio registrado");
      setShowForm(false); fetchServicios();
      setFormData({ pig_id: "", tipo_servicio: "MONTA_NATURAL", fecha_servicio: "", verraco: "", fecha_probable_parto: "", estado: "GESTANTE", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handlePartoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/reproduccion/partos", partoData);
      toast.success("Parto registrado");
      setShowPartoForm(false); fetchPartos(); fetchServicios();
      setPartoData({ reproduccion_id: "", pig_id: "", fecha_parto: "", lechones_nacidos_vivos: 0, lechones_nacidos_muertos: 0, lechones_momificados: 0, peso_promedio_lechon: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/reproduccion/${id}`); toast.success("Eliminado"); fetchServicios(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const getEstadoBadge = (estado) => {
    const map = {
      GESTANTE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "fa-clock" },
      CONFIRMADA: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "fa-check" },
      FALLIDA: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: "fa-xmark" },
      PARTO_REALIZADO: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "fa-baby" }
    };
    const s = map[estado] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "fa-tag" };
    return <span className={`badge ${s.bg} ${s.text} border ${s.border}`}><i className={`fas ${s.icon} mr-1 text-[10px]`}></i>{estado}</span>;
  };

  const tabs = [
    { id: "servicios", label: "Servicios", icon: "fa-syringe" },
    { id: "partos", label: "Partos", icon: "fa-baby" },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2><i className="fas fa-dna"></i>Reproducción</h2>
          <p className="subtitle">Servicios y partos · {servicios.length} servicios · {partos.length} partos</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="tab-container mb-5">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}>
            <i className={`fas ${tab.icon} text-xs`}></i>{tab.label}
          </button>
        ))}
      </div>

      {/* ═══ TAB: SERVICIOS ═══ */}
      {activeTab === "servicios" && (
        <div>
          <div className="mb-4">
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>
              {showForm ? "Cerrar" : "Nuevo Servicio"}
            </button>
          </div>

          {showForm && (
            <div className="form-card anim-scaleIn">
              <h3><i className="fas fa-syringe"></i>Registrar Servicio</h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Cerda <span className="required">*</span></label>
                    <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                      <option value="">Seleccione...</option>
                      {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Tipo de Servicio</label>
                    <select value={formData.tipo_servicio} onChange={(e) => setFormData({ ...formData, tipo_servicio: e.target.value })} className="input-modern">
                      <option value="MONTA_NATURAL">🐗 Monta Natural</option>
                      <option value="INSEMINACION">💉 Inseminación</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Fecha <span className="required">*</span></label>
                    <input type="date" value={formData.fecha_servicio} onChange={(e) => setFormData({ ...formData, fecha_servicio: e.target.value })} className="input-modern" required />
                  </div>
                  <div>
                    <label className="form-label">Verraco</label>
                    <input type="text" value={formData.verraco} onChange={(e) => setFormData({ ...formData, verraco: e.target.value })} className="input-modern" placeholder="Identificación del verraco" />
                  </div>
                  <div>
                    <label className="form-label">Fecha Probable Parto</label>
                    <input type="date" value={formData.fecha_probable_parto} onChange={(e) => setFormData({ ...formData, fecha_probable_parto: e.target.value })} className="input-modern" />
                  </div>
                  <div>
                    <label className="form-label">Estado</label>
                    <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} className="input-modern">
                      <option value="GESTANTE">Gestante</option>
                      <option value="CONFIRMADA">Confirmada</option>
                      <option value="FALLIDA">Fallida</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
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

          <div className="table-container">
            {servicios.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><i className="fas fa-syringe"></i></div><p>No hay servicios registrados</p><p className="empty-sub">Registra un servicio para iniciar el seguimiento reproductivo</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead><tr><th>Cerda</th><th>Tipo</th><th>Fecha</th><th>Verraco</th><th>Parto Prob.</th><th>Estado</th><th className="text-center">Acciones</th></tr></thead>
                  <tbody>
                    {servicios.map(s => (
                      <tr key={s.id}>
                        <td className="font-semibold text-gray-900">{s.codigo_arete}</td>
                        <td><span className="badge bg-indigo-50 text-indigo-700 border border-indigo-200"><i className="fas fa-tag mr-1 text-[10px]"></i>{s.tipo_servicio}</span></td>
                        <td>{new Date(s.fecha_servicio).toLocaleDateString()}</td>
                        <td>{s.verraco || <span className="text-gray-300">—</span>}</td>
                        <td>{s.fecha_probable_parto ? new Date(s.fecha_probable_parto).toLocaleDateString() : <span className="text-gray-300">—</span>}</td>
                        <td>{getEstadoBadge(s.estado)}</td>
                        <td className="text-center"><button onClick={() => handleDelete(s.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ TAB: PARTOS ═══ */}
      {activeTab === "partos" && (
        <div>
          <div className="mb-4">
            <button onClick={() => setShowPartoForm(!showPartoForm)} className="btn-primary">
              <i className={`fas ${showPartoForm ? "fa-times" : "fa-plus"}`}></i>
              {showPartoForm ? "Cerrar" : "Registrar Parto"}
            </button>
          </div>

          {showPartoForm && (
            <div className="form-card anim-scaleIn">
              <h3><i className="fas fa-baby"></i>Registrar Parto</h3>
              <form onSubmit={handlePartoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Cerda <span className="required">*</span></label>
                    <select value={partoData.pig_id} onChange={(e) => setPartoData({ ...partoData, pig_id: e.target.value })} className="input-modern" required>
                      <option value="">Seleccione...</option>
                      {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Fecha <span className="required">*</span></label>
                    <input type="date" value={partoData.fecha_parto} onChange={(e) => setPartoData({ ...partoData, fecha_parto: e.target.value })} className="input-modern" required />
                  </div>
                  <div>
                    <label className="form-label">Lechones Vivos</label>
                    <input type="number" value={partoData.lechones_nacidos_vivos} onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_vivos: parseInt(e.target.value) || 0 })} className="input-modern" min="0" />
                  </div>
                  <div>
                    <label className="form-label">Lechones Muertos</label>
                    <input type="number" value={partoData.lechones_nacidos_muertos} onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_muertos: parseInt(e.target.value) || 0 })} className="input-modern" min="0" />
                  </div>
                  <div>
                    <label className="form-label">Momificados</label>
                    <input type="number" value={partoData.lechones_momificados} onChange={(e) => setPartoData({ ...partoData, lechones_momificados: parseInt(e.target.value) || 0 })} className="input-modern" min="0" />
                  </div>
                  <div>
                    <label className="form-label">Peso Promedio (kg)</label>
                    <input type="number" step="0.01" value={partoData.peso_promedio_lechon} onChange={(e) => setPartoData({ ...partoData, peso_promedio_lechon: e.target.value })} className="input-modern" min="0" />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="form-label">Observaciones</label>
                    <textarea value={partoData.observaciones} onChange={(e) => setPartoData({ ...partoData, observaciones: e.target.value })} className="input-modern" rows="2" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowPartoForm(false)} className="btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            {partos.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><i className="fas fa-baby"></i></div><p>No hay partos registrados</p><p className="empty-sub">Registra los partos del plantel reproductivo</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead><tr><th>Cerda</th><th>Fecha</th><th>Vivos</th><th>Muertos</th><th>Momific.</th><th>Peso Prom.</th></tr></thead>
                  <tbody>
                    {partos.map(p => (
                      <tr key={p.id}>
                        <td className="font-semibold text-gray-900">{p.codigo_arete}</td>
                        <td>{new Date(p.fecha_parto).toLocaleDateString()}</td>
                        <td><span className="font-bold text-emerald-600">{p.lechones_nacidos_vivos}</span></td>
                        <td>{p.lechones_nacidos_muertos > 0 ? <span className="text-red-500 font-semibold">{p.lechones_nacidos_muertos}</span> : <span className="text-gray-300">0</span>}</td>
                        <td>{p.lechones_momificados || <span className="text-gray-300">0</span>}</td>
                        <td>{p.peso_promedio_lechon ? parseFloat(p.peso_promedio_lechon).toFixed(2) + " kg" : <span className="text-gray-300">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

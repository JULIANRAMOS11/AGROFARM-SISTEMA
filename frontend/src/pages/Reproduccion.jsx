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
    try { const data = await apiGet("/reproduccion"); setServicios(data); }
    catch (error) { console.error("Error al cargar servicios:", error); }
  };
  const fetchPartos = async () => {
    try { const data = await apiGet("/reproduccion/partos/all"); setPartos(data); }
    catch (error) { console.error("Error al cargar partos:", error); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data.filter(p => p.sexo === "H" || p.sexo === "Hembra")); }
    catch (error) { console.error("Error al cargar cerdos:", error); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/reproduccion", formData);
      toast.success("Servicio registrado exitosamente");
      setShowForm(false); fetchServicios();
      setFormData({ pig_id: "", tipo_servicio: "MONTA_NATURAL", fecha_servicio: "", verraco: "", fecha_probable_parto: "", estado: "GESTANTE", observaciones: "" });
    } catch (error) { toast.error(error.message || "Error de conexión"); }
  };

  const handlePartoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/reproduccion/partos", partoData);
      toast.success("Parto registrado exitosamente");
      setShowPartoForm(false); fetchPartos(); fetchServicios();
      setPartoData({ reproduccion_id: "", pig_id: "", fecha_parto: "", lechones_nacidos_vivos: 0, lechones_nacidos_muertos: 0, lechones_momificados: 0, peso_promedio_lechon: "", observaciones: "" });
    } catch (error) { toast.error(error.message || "Error de conexión"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try { await apiDelete(`/reproduccion/${id}`); toast.success("Registro eliminado"); fetchServicios(); }
      catch (error) { toast.error(error.message || "Error de conexión"); }
    }
  };

  const getEstadoBadge = (estado) => {
    const styles = {
      GESTANTE: "bg-amber-50 text-amber-700 border-amber-100",
      CONFIRMADA: "bg-blue-50 text-blue-700 border-blue-100",
      FALLIDA: "bg-red-50 text-red-700 border-red-100",
      PARTO_REALIZADO: "bg-emerald-50 text-emerald-700 border-emerald-100"
    };
    return styles[estado] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  const tabs = [
    { id: "servicios", label: "Servicios", icon: "fa-syringe" },
    { id: "partos", label: "Partos", icon: "fa-baby" },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-baby text-green-500"></i>Reproducción
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{servicios.length} servicios · {partos.length} partos</p>
        </div>
      </div>

      {/* Tabs modernos */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            <i className={`fas ${tab.icon} text-xs`}></i>{tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Servicios */}
      {activeTab === "servicios" && (
        <div className="space-y-4 animate-fadeIn">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showForm ? "Cerrar" : "Nuevo Servicio"}
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="glass-card p-6 animate-scaleIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-syringe text-green-500"></i>Nuevo Servicio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Cerda <span className="required">*</span></label>
                  <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                    <option value="">Seleccione...</option>
                    {pigs.map((pig) => <option key={pig.id} value={pig.id}>{pig.codigo_arete}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Tipo de Servicio</label>
                  <select value={formData.tipo_servicio} onChange={(e) => setFormData({ ...formData, tipo_servicio: e.target.value })} className="input-modern">
                    <option value="MONTA_NATURAL">Monta Natural</option>
                    <option value="INSEMINACION">Inseminación</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Fecha Servicio <span className="required">*</span></label>
                  <input type="date" value={formData.fecha_servicio} onChange={(e) => setFormData({ ...formData, fecha_servicio: e.target.value })} className="input-modern" required />
                </div>
                <div>
                  <label className="form-label">Verraco</label>
                  <input type="text" value={formData.verraco} onChange={(e) => setFormData({ ...formData, verraco: e.target.value })} className="input-modern" />
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
              <div className="flex gap-2 mt-5">
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          )}

          <div className="glass-card overflow-hidden">
            {servicios.length === 0 ? (
              <div className="empty-state"><i className="fas fa-syringe"></i><p>No hay servicios registrados.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Cerda</th><th>Tipo</th><th>Fecha</th><th>Verraco</th><th>Parto Prob.</th><th>Estado</th><th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {servicios.map((s) => (
                      <tr key={s.id}>
                        <td className="font-semibold text-gray-900">{s.codigo_arete}</td>
                        <td><span className="badge bg-blue-50 text-blue-700 border border-blue-100">{s.tipo_servicio}</span></td>
                        <td>{new Date(s.fecha_servicio).toLocaleDateString()}</td>
                        <td>{s.verraco || "—"}</td>
                        <td>{s.fecha_probable_parto ? new Date(s.fecha_probable_parto).toLocaleDateString() : "—"}</td>
                        <td><span className={`badge border ${getEstadoBadge(s.estado)}`}>{s.estado}</span></td>
                        <td className="text-center">
                          <button onClick={() => handleDelete(s.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Partos */}
      {activeTab === "partos" && (
        <div className="space-y-4 animate-fadeIn">
          <button onClick={() => setShowPartoForm(!showPartoForm)} className="btn-primary">
            <i className={`fas ${showPartoForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showPartoForm ? "Cerrar" : "Registrar Parto"}
          </button>

          {showPartoForm && (
            <form onSubmit={handlePartoSubmit} className="glass-card p-6 animate-scaleIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-baby text-green-500"></i>Registrar Parto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Cerda <span className="required">*</span></label>
                  <select value={partoData.pig_id} onChange={(e) => setPartoData({ ...partoData, pig_id: e.target.value })} className="input-modern" required>
                    <option value="">Seleccione...</option>
                    {pigs.map((pig) => <option key={pig.id} value={pig.id}>{pig.codigo_arete}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Fecha Parto <span className="required">*</span></label>
                  <input type="date" value={partoData.fecha_parto} onChange={(e) => setPartoData({ ...partoData, fecha_parto: e.target.value })} className="input-modern" required />
                </div>
                <div>
                  <label className="form-label">Lechones Vivos</label>
                  <input type="number" value={partoData.lechones_nacidos_vivos} onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_vivos: parseInt(e.target.value) })} className="input-modern" min="0" />
                </div>
                <div>
                  <label className="form-label">Lechones Muertos</label>
                  <input type="number" value={partoData.lechones_nacidos_muertos} onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_muertos: parseInt(e.target.value) })} className="input-modern" min="0" />
                </div>
                <div>
                  <label className="form-label">Momificados</label>
                  <input type="number" value={partoData.lechones_momificados} onChange={(e) => setPartoData({ ...partoData, lechones_momificados: parseInt(e.target.value) })} className="input-modern" min="0" />
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
              <div className="flex gap-2 mt-5">
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                <button type="button" onClick={() => setShowPartoForm(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          )}

          <div className="glass-card overflow-hidden">
            {partos.length === 0 ? (
              <div className="empty-state"><i className="fas fa-baby"></i><p>No hay partos registrados.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Cerda</th><th>Fecha</th><th>Vivos</th><th>Muertos</th><th>Momific.</th><th>Peso Prom.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partos.map((p) => (
                      <tr key={p.id}>
                        <td className="font-semibold text-gray-900">{p.codigo_arete}</td>
                        <td>{new Date(p.fecha_parto).toLocaleDateString()}</td>
                        <td><span className="font-bold text-emerald-600">{p.lechones_nacidos_vivos}</span></td>
                        <td><span className="text-red-500">{p.lechones_nacidos_muertos}</span></td>
                        <td>{p.lechones_momificados}</td>
                        <td>{p.peso_promedio_lechon || "—"}</td>
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

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Nutricion() {
  const [activeTab, setActiveTab] = useState("alimentos");
  const [alimentos, setAlimentos] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showAlimentoForm, setShowAlimentoForm] = useState(false);
  const [showConsumoForm, setShowConsumoForm] = useState(false);

  const [alimentoData, setAlimentoData] = useState({
    nombre_alimento: "", tipo: "CRECIMIENTO", proteina_porcentaje: "",
    costo_por_kg: "", proveedor: "", stock_kg: "", observaciones: ""
  });
  const [consumoData, setConsumoData] = useState({
    pig_id: "", alimento_id: "", fecha: "", cantidad_kg: "", lote: "", observaciones: ""
  });

  useEffect(() => { fetchAlimentos(); fetchConsumos(); fetchPigs(); }, []);

  const fetchAlimentos = async () => {
    try { const data = await apiGet("/nutricion/alimentos"); setAlimentos(data); } catch (err) { console.error(err); }
  };
  const fetchConsumos = async () => {
    try { const data = await apiGet("/nutricion/consumos"); setConsumos(data); } catch (err) { console.error(err); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); } catch (err) { console.error(err); }
  };

  const handleAlimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/nutricion/alimentos", alimentoData);
      toast.success("Alimento creado");
      setShowAlimentoForm(false); fetchAlimentos();
      setAlimentoData({ nombre_alimento: "", tipo: "CRECIMIENTO", proteina_porcentaje: "", costo_por_kg: "", proveedor: "", stock_kg: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleConsumoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/nutricion/consumos", consumoData);
      toast.success("Consumo registrado");
      setShowConsumoForm(false); fetchConsumos(); fetchAlimentos();
      setConsumoData({ pig_id: "", alimento_id: "", fecha: "", cantidad_kg: "", lote: "", observaciones: "" });
    } catch (err) { toast.error(err.message || "Error"); }
  };

  const handleDeleteAlimento = async (id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/nutricion/alimentos/${id}`); toast.success("Eliminado"); fetchAlimentos(); }
    catch (err) { toast.error(err.message || "Error"); }
  };

  const getTipoBadge = (tipo) => {
    const map = {
      INICIADOR: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", icon: "fa-seedling" },
      CRECIMIENTO: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", icon: "fa-arrow-up" },
      ENGORDE: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: "fa-drumstick-bite" },
      GESTACION: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", icon: "fa-baby" },
      LACTANCIA: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: "fa-droplet" }
    };
    const s = map[tipo] || { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", icon: "fa-tag" };
    return <span className={`badge ${s.bg} ${s.text} border ${s.border}`}><i className={`fas ${s.icon} mr-1 text-[10px]`}></i>{tipo}</span>;
  };

  const tabs = [
    { id: "alimentos", label: "Catálogo de Alimentos", icon: "fa-wheat-awn" },
    { id: "consumos", label: "Registro de Consumo", icon: "fa-utensils" },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div className="page-header">
        <div>
          <h2><i className="fas fa-apple-whole"></i>Nutrición</h2>
          <p className="subtitle">Alimentación y consumo · {alimentos.length} alimentos · {consumos.length} consumos</p>
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

      {/* ═══ ALIMENTOS ═══ */}
      {activeTab === "alimentos" && (
        <div>
          <div className="mb-4">
            <button onClick={() => setShowAlimentoForm(!showAlimentoForm)} className="btn-primary">
              <i className={`fas ${showAlimentoForm ? "fa-times" : "fa-plus"}`}></i>
              {showAlimentoForm ? "Cerrar" : "Nuevo Alimento"}
            </button>
          </div>

          {showAlimentoForm && (
            <div className="form-card anim-scaleIn">
              <h3><i className="fas fa-wheat-awn"></i>Nuevo Alimento</h3>
              <form onSubmit={handleAlimentoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Nombre <span className="required">*</span></label>
                    <input type="text" value={alimentoData.nombre_alimento} onChange={(e) => setAlimentoData({ ...alimentoData, nombre_alimento: e.target.value })} className="input-modern" required placeholder="Nombre del alimento" />
                  </div>
                  <div>
                    <label className="form-label">Tipo <span className="required">*</span></label>
                    <select value={alimentoData.tipo} onChange={(e) => setAlimentoData({ ...alimentoData, tipo: e.target.value })} className="input-modern" required>
                      <option value="INICIADOR">🌱 Iniciador</option>
                      <option value="CRECIMIENTO">📈 Crecimiento</option>
                      <option value="ENGORDE">🍖 Engorde</option>
                      <option value="GESTACION">🤰 Gestación</option>
                      <option value="LACTANCIA">💧 Lactancia</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Proteína (%)</label>
                    <input type="number" step="0.01" value={alimentoData.proteina_porcentaje} onChange={(e) => setAlimentoData({ ...alimentoData, proteina_porcentaje: e.target.value })} className="input-modern" min="0" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="form-label">Costo por kg ($)</label>
                    <input type="number" step="0.01" value={alimentoData.costo_por_kg} onChange={(e) => setAlimentoData({ ...alimentoData, costo_por_kg: e.target.value })} className="input-modern" min="0" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="form-label">Proveedor</label>
                    <input type="text" value={alimentoData.proveedor} onChange={(e) => setAlimentoData({ ...alimentoData, proveedor: e.target.value })} className="input-modern" placeholder="Nombre del proveedor" />
                  </div>
                  <div>
                    <label className="form-label">Stock (kg)</label>
                    <input type="number" step="0.01" value={alimentoData.stock_kg} onChange={(e) => setAlimentoData({ ...alimentoData, stock_kg: e.target.value })} className="input-modern" min="0" placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2 lg:col-span-3">
                    <label className="form-label">Observaciones</label>
                    <textarea value={alimentoData.observaciones} onChange={(e) => setAlimentoData({ ...alimentoData, observaciones: e.target.value })} className="input-modern" rows="2" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowAlimentoForm(false)} className="btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            {alimentos.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><i className="fas fa-wheat-awn"></i></div><p>No hay alimentos registrados</p><p className="empty-sub">Agrega alimentos al catálogo para empezar</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead><tr><th>Nombre</th><th>Tipo</th><th>Proteína</th><th>Costo/kg</th><th>Proveedor</th><th>Stock</th><th className="text-center">Acciones</th></tr></thead>
                  <tbody>
                    {alimentos.map(a => (
                      <tr key={a.id}>
                        <td className="font-semibold text-gray-900">{a.nombre_alimento}</td>
                        <td>{getTipoBadge(a.tipo)}</td>
                        <td>{a.proteina_porcentaje ? `${a.proteina_porcentaje}%` : <span className="text-gray-300">—</span>}</td>
                        <td>{a.costo_por_kg ? <span className="font-semibold">${parseFloat(a.costo_por_kg).toFixed(2)}</span> : <span className="text-gray-300">—</span>}</td>
                        <td>{a.proveedor || <span className="text-gray-300">—</span>}</td>
                        <td>
                          <span className={`font-bold ${parseFloat(a.stock_kg) < 50 ? "text-red-500" : "text-emerald-600"}`}>
                            {parseFloat(a.stock_kg).toFixed(1)} kg
                          </span>
                        </td>
                        <td className="text-center"><button onClick={() => handleDeleteAlimento(a.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ CONSUMOS ═══ */}
      {activeTab === "consumos" && (
        <div>
          <div className="mb-4">
            <button onClick={() => setShowConsumoForm(!showConsumoForm)} className="btn-primary">
              <i className={`fas ${showConsumoForm ? "fa-times" : "fa-plus"}`}></i>
              {showConsumoForm ? "Cerrar" : "Registrar Consumo"}
            </button>
          </div>

          {showConsumoForm && (
            <div className="form-card anim-scaleIn">
              <h3><i className="fas fa-utensils"></i>Registrar Consumo</h3>
              <form onSubmit={handleConsumoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Cerdo <span className="required">*</span></label>
                    <select value={consumoData.pig_id} onChange={(e) => setConsumoData({ ...consumoData, pig_id: e.target.value })} className="input-modern" required>
                      <option value="">Seleccione...</option>
                      {pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.sexo}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Alimento <span className="required">*</span></label>
                    <select value={consumoData.alimento_id} onChange={(e) => setConsumoData({ ...consumoData, alimento_id: e.target.value })} className="input-modern" required>
                      <option value="">Seleccione...</option>
                      {alimentos.map(a => <option key={a.id} value={a.id}>{a.nombre_alimento} ({a.tipo})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Fecha <span className="required">*</span></label>
                    <input type="date" value={consumoData.fecha} onChange={(e) => setConsumoData({ ...consumoData, fecha: e.target.value })} className="input-modern" required />
                  </div>
                  <div>
                    <label className="form-label">Cantidad (kg) <span className="required">*</span></label>
                    <input type="number" step="0.01" value={consumoData.cantidad_kg} onChange={(e) => setConsumoData({ ...consumoData, cantidad_kg: e.target.value })} className="input-modern" required min="0.1" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="form-label">Lote</label>
                    <input type="text" value={consumoData.lote} onChange={(e) => setConsumoData({ ...consumoData, lote: e.target.value })} className="input-modern" />
                  </div>
                  <div>
                    <label className="form-label">Observaciones</label>
                    <input type="text" value={consumoData.observaciones} onChange={(e) => setConsumoData({ ...consumoData, observaciones: e.target.value })} className="input-modern" />
                  </div>
                </div>
                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowConsumoForm(false)} className="btn-secondary">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="table-container">
            {consumos.length === 0 ? (
              <div className="empty-state"><div className="empty-icon"><i className="fas fa-utensils"></i></div><p>No hay consumos registrados</p><p className="empty-sub">Registra un consumo para comenzar</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead><tr><th>Cerdo</th><th>Alimento</th><th>Fecha</th><th>Cantidad</th><th>Lote</th></tr></thead>
                  <tbody>
                    {consumos.map(c => (
                      <tr key={c.id}>
                        <td className="font-semibold text-gray-900">{c.codigo_arete}</td>
                        <td>{c.nombre_alimento}</td>
                        <td>{new Date(c.fecha).toLocaleDateString()}</td>
                        <td><span className="font-bold text-emerald-600">{parseFloat(c.cantidad_kg).toFixed(2)} kg</span></td>
                        <td>{c.lote || <span className="text-gray-300">—</span>}</td>
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

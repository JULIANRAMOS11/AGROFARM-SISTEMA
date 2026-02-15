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
    try { const data = await apiGet("/nutricion/alimentos"); setAlimentos(data); }
    catch (error) { console.error("Error al cargar alimentos:", error); }
  };
  const fetchConsumos = async () => {
    try { const data = await apiGet("/nutricion/consumos"); setConsumos(data); }
    catch (error) { console.error("Error al cargar consumos:", error); }
  };
  const fetchPigs = async () => {
    try { const data = await apiGet("/pigs"); setPigs(data); }
    catch (error) { console.error("Error al cargar cerdos:", error); }
  };

  const handleAlimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/nutricion/alimentos", alimentoData);
      toast.success("Alimento creado exitosamente");
      setShowAlimentoForm(false); fetchAlimentos();
      setAlimentoData({ nombre_alimento: "", tipo: "CRECIMIENTO", proteina_porcentaje: "", costo_por_kg: "", proveedor: "", stock_kg: "", observaciones: "" });
    } catch (error) { toast.error(error.message || "Error de conexión"); }
  };

  const handleConsumoSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/nutricion/consumos", consumoData);
      toast.success("Consumo registrado exitosamente");
      setShowConsumoForm(false); fetchConsumos(); fetchAlimentos();
      setConsumoData({ pig_id: "", alimento_id: "", fecha: "", cantidad_kg: "", lote: "", observaciones: "" });
    } catch (error) { toast.error(error.message || "Error de conexión"); }
  };

  const handleDeleteAlimento = async (id) => {
    if (window.confirm("¿Eliminar este alimento?")) {
      try { await apiDelete(`/nutricion/alimentos/${id}`); toast.success("Alimento eliminado"); fetchAlimentos(); }
      catch (error) { toast.error(error.message || "Error de conexión"); }
    }
  };

  const getTipoBadge = (tipo) => {
    const styles = {
      INICIADOR: "bg-purple-50 text-purple-700 border-purple-100",
      CRECIMIENTO: "bg-blue-50 text-blue-700 border-blue-100",
      ENGORDE: "bg-emerald-50 text-emerald-700 border-emerald-100",
      GESTACION: "bg-pink-50 text-pink-700 border-pink-100",
      LACTANCIA: "bg-amber-50 text-amber-700 border-amber-100"
    };
    return styles[tipo] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  const tabs = [
    { id: "alimentos", label: "Catálogo de Alimentos", icon: "fa-wheat-awn" },
    { id: "consumos", label: "Registro de Consumo", icon: "fa-utensils" },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-apple-whole text-green-500"></i>Nutrición
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{alimentos.length} alimentos · {consumos.length} consumos</p>
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

      {/* Tab: Alimentos */}
      {activeTab === "alimentos" && (
        <div className="space-y-4 animate-fadeIn">
          <button onClick={() => setShowAlimentoForm(!showAlimentoForm)} className="btn-primary">
            <i className={`fas ${showAlimentoForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showAlimentoForm ? "Cerrar" : "Nuevo Alimento"}
          </button>

          {showAlimentoForm && (
            <form onSubmit={handleAlimentoSubmit} className="glass-card p-6 animate-scaleIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-wheat-awn text-green-500"></i>Nuevo Alimento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Nombre <span className="required">*</span></label>
                  <input type="text" value={alimentoData.nombre_alimento} onChange={(e) => setAlimentoData({ ...alimentoData, nombre_alimento: e.target.value })} className="input-modern" required />
                </div>
                <div>
                  <label className="form-label">Tipo <span className="required">*</span></label>
                  <select value={alimentoData.tipo} onChange={(e) => setAlimentoData({ ...alimentoData, tipo: e.target.value })} className="input-modern" required>
                    <option value="INICIADOR">Iniciador</option>
                    <option value="CRECIMIENTO">Crecimiento</option>
                    <option value="ENGORDE">Engorde</option>
                    <option value="GESTACION">Gestación</option>
                    <option value="LACTANCIA">Lactancia</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Proteína (%)</label>
                  <input type="number" step="0.01" value={alimentoData.proteina_porcentaje} onChange={(e) => setAlimentoData({ ...alimentoData, proteina_porcentaje: e.target.value })} className="input-modern" min="0" />
                </div>
                <div>
                  <label className="form-label">Costo por kg</label>
                  <input type="number" step="0.01" value={alimentoData.costo_por_kg} onChange={(e) => setAlimentoData({ ...alimentoData, costo_por_kg: e.target.value })} className="input-modern" min="0" />
                </div>
                <div>
                  <label className="form-label">Proveedor</label>
                  <input type="text" value={alimentoData.proveedor} onChange={(e) => setAlimentoData({ ...alimentoData, proveedor: e.target.value })} className="input-modern" />
                </div>
                <div>
                  <label className="form-label">Stock (kg)</label>
                  <input type="number" step="0.01" value={alimentoData.stock_kg} onChange={(e) => setAlimentoData({ ...alimentoData, stock_kg: e.target.value })} className="input-modern" min="0" />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <label className="form-label">Observaciones</label>
                  <textarea value={alimentoData.observaciones} onChange={(e) => setAlimentoData({ ...alimentoData, observaciones: e.target.value })} className="input-modern" rows="2" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                <button type="button" onClick={() => setShowAlimentoForm(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          )}

          <div className="glass-card overflow-hidden">
            {alimentos.length === 0 ? (
              <div className="empty-state"><i className="fas fa-wheat-awn"></i><p>No hay alimentos registrados.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Nombre</th><th>Tipo</th><th>Proteína</th><th>Costo/kg</th><th>Proveedor</th><th>Stock</th><th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alimentos.map((a) => (
                      <tr key={a.id}>
                        <td className="font-semibold text-gray-900">{a.nombre_alimento}</td>
                        <td><span className={`badge border ${getTipoBadge(a.tipo)}`}>{a.tipo}</span></td>
                        <td>{a.proteina_porcentaje || "—"}</td>
                        <td>{a.costo_por_kg ? `$${parseFloat(a.costo_por_kg).toFixed(2)}` : "—"}</td>
                        <td>{a.proveedor || "—"}</td>
                        <td><span className="font-bold text-blue-600">{parseFloat(a.stock_kg).toFixed(1)} kg</span></td>
                        <td className="text-center">
                          <button onClick={() => handleDeleteAlimento(a.id)} className="btn-danger"><i className="fas fa-trash text-xs"></i></button>
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

      {/* Tab: Consumos */}
      {activeTab === "consumos" && (
        <div className="space-y-4 animate-fadeIn">
          <button onClick={() => setShowConsumoForm(!showConsumoForm)} className="btn-primary">
            <i className={`fas ${showConsumoForm ? 'fa-times' : 'fa-plus'}`}></i>
            {showConsumoForm ? "Cerrar" : "Registrar Consumo"}
          </button>

          {showConsumoForm && (
            <form onSubmit={handleConsumoSubmit} className="glass-card p-6 animate-scaleIn">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fas fa-utensils text-green-500"></i>Registrar Consumo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Cerdo <span className="required">*</span></label>
                  <select value={consumoData.pig_id} onChange={(e) => setConsumoData({ ...consumoData, pig_id: e.target.value })} className="input-modern" required>
                    <option value="">Seleccione...</option>
                    {pigs.map((pig) => <option key={pig.id} value={pig.id}>{pig.codigo_arete} - {pig.sexo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Alimento <span className="required">*</span></label>
                  <select value={consumoData.alimento_id} onChange={(e) => setConsumoData({ ...consumoData, alimento_id: e.target.value })} className="input-modern" required>
                    <option value="">Seleccione...</option>
                    {alimentos.map((a) => <option key={a.id} value={a.id}>{a.nombre_alimento} ({a.tipo})</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Fecha <span className="required">*</span></label>
                  <input type="date" value={consumoData.fecha} onChange={(e) => setConsumoData({ ...consumoData, fecha: e.target.value })} className="input-modern" required />
                </div>
                <div>
                  <label className="form-label">Cantidad (kg) <span className="required">*</span></label>
                  <input type="number" step="0.01" value={consumoData.cantidad_kg} onChange={(e) => setConsumoData({ ...consumoData, cantidad_kg: e.target.value })} className="input-modern" required min="0.1" />
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
              <div className="flex gap-2 mt-5">
                <button type="submit" className="btn-primary"><i className="fas fa-save"></i>Guardar</button>
                <button type="button" onClick={() => setShowConsumoForm(false)} className="btn-secondary">Cancelar</button>
              </div>
            </form>
          )}

          <div className="glass-card overflow-hidden">
            {consumos.length === 0 ? (
              <div className="empty-state"><i className="fas fa-utensils"></i><p>No hay consumos registrados.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Cerdo</th><th>Alimento</th><th>Fecha</th><th>Cantidad</th><th>Lote</th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumos.map((c) => (
                      <tr key={c.id}>
                        <td className="font-semibold text-gray-900">{c.codigo_arete}</td>
                        <td>{c.nombre_alimento}</td>
                        <td>{new Date(c.fecha).toLocaleDateString()}</td>
                        <td><span className="font-bold text-emerald-600">{parseFloat(c.cantidad_kg).toFixed(2)} kg</span></td>
                        <td>{c.lote || "—"}</td>
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

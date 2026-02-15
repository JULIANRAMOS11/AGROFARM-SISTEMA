import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Nutricion() {
  const [tab, setTab] = useState("alimentos");
  const [alimentos, setAlimentos] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [alimentoForm, setAlimentoForm] = useState({ nombre: "", tipo: "CONCENTRADO", marca: "", contenido_proteina: "", contenido_energia_kcal: "", precio_por_kg: "", stock_kg: "", proveedor: "", observaciones: "" });
  const [consumoForm, setConsumoForm] = useState({ pig_id: "", alimento_id: "", fecha: "", cantidad_kg: "", etapa_productiva: "CRECIMIENTO", observaciones: "" });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { const [a, c, p] = await Promise.all([apiGet("/nutricion/alimentos"), apiGet("/nutricion/consumos"), apiGet("/pigs")]); setAlimentos(a); setConsumos(c); setPigs(p); } catch (err) { console.error(err); }
  };

  const handleAlimentoSubmit = async (e) => {
    e.preventDefault();
    try { await apiPost("/nutricion/alimentos", alimentoForm); toast.success("Alimento creado"); setShowForm(false); fetchData(); setAlimentoForm({ nombre: "", tipo: "CONCENTRADO", marca: "", contenido_proteina: "", contenido_energia_kcal: "", precio_por_kg: "", stock_kg: "", proveedor: "", observaciones: "" }); } catch (err) { toast.error(err.message); }
  };
  const handleConsumoSubmit = async (e) => {
    e.preventDefault();
    try { await apiPost("/nutricion/consumos", consumoForm); toast.success("Consumo registrado"); setShowForm(false); fetchData(); setConsumoForm({ pig_id: "", alimento_id: "", fecha: "", cantidad_kg: "", etapa_productiva: "CRECIMIENTO", observaciones: "" }); } catch (err) { toast.error(err.message); }
  };
  const handleDelete = async (type, id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/nutricion/${type}/${id}`); toast.success("Eliminado"); fetchData(); } catch (err) { toast.error(err.message); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  const getTipoBadge = (tipo) => {
    const map = {
      CONCENTRADO: { bg: "bg-amber-100", text: "text-amber-700", icon: "fa-seedling" },
      FORRAJE: { bg: "bg-green-100", text: "text-green-700", icon: "fa-leaf" },
      SUPLEMENTO: { bg: "bg-purple-100", text: "text-purple-700", icon: "fa-capsules" },
      PREMEZCLA: { bg: "bg-blue-100", text: "text-blue-700", icon: "fa-flask" },
      OTRO: { bg: "bg-gray-100", text: "text-gray-700", icon: "fa-tag" },
    };
    const s = map[tipo] || map.OTRO;
    return (<span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}><i className={`fas ${s.icon} text-[10px]`}></i>{tipo}</span>);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <i className="fas fa-apple-whole text-white"></i>
            </div>Nutrición
          </h1>
          <p className="text-gray-500 mt-1">{alimentos.length} alimentos · {consumos.length} consumos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>{showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {["alimentos", "consumos"].map(t => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-gray-500 hover:text-slate-700"}`}>
            <i className={`fas ${t === "alimentos" ? "fa-box-open" : "fa-utensils"} mr-2`}></i>
            {t === "alimentos" ? "Catálogo" : "Consumos"}
          </button>
        ))}
      </div>

      {/* ─── ALIMENTOS TAB ─── */}
      {tab === "alimentos" && (
        <>
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100"><i className="fas fa-box-open text-amber-500"></i>Nuevo Alimento</h3>
              <form onSubmit={handleAlimentoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre <span className="text-red-500">*</span></label><input type="text" value={alimentoForm.nombre} onChange={(e) => setAlimentoForm({ ...alimentoForm, nombre: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo <span className="text-red-500">*</span></label><select value={alimentoForm.tipo} onChange={(e) => setAlimentoForm({ ...alimentoForm, tipo: e.target.value })} className={inputClass} required><option value="CONCENTRADO">Concentrado</option><option value="FORRAJE">Forraje</option><option value="SUPLEMENTO">Suplemento</option><option value="PREMEZCLA">Premezcla</option><option value="OTRO">Otro</option></select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Marca</label><input type="text" value={alimentoForm.marca} onChange={(e) => setAlimentoForm({ ...alimentoForm, marca: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Proteína (%)</label><input type="number" step="0.01" value={alimentoForm.contenido_proteina} onChange={(e) => setAlimentoForm({ ...alimentoForm, contenido_proteina: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Energía (kcal)</label><input type="number" step="0.01" value={alimentoForm.contenido_energia_kcal} onChange={(e) => setAlimentoForm({ ...alimentoForm, contenido_energia_kcal: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Precio/kg ($)</label><input type="number" step="0.01" value={alimentoForm.precio_por_kg} onChange={(e) => setAlimentoForm({ ...alimentoForm, precio_por_kg: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock (kg)</label><input type="number" step="0.01" value={alimentoForm.stock_kg} onChange={(e) => setAlimentoForm({ ...alimentoForm, stock_kg: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Proveedor</label><input type="text" value={alimentoForm.proveedor} onChange={(e) => setAlimentoForm({ ...alimentoForm, proveedor: e.target.value })} className={inputClass} /></div>
                  <div className="lg:col-span-3"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label><textarea value={alimentoForm.observaciones} onChange={(e) => setAlimentoForm({ ...alimentoForm, observaciones: e.target.value })} className={inputClass} rows="2" /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            {alimentos.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"><i className="fas fa-box-open text-amber-500 text-2xl"></i></div><p className="text-gray-500 font-medium">No hay alimentos registrados</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Proteína</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio/kg</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acc.</th>
              </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {alimentos.map(a => (
                    <tr key={a.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{a.nombre}</td>
                      <td className="px-6 py-4">{getTipoBadge(a.tipo)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.marca || "—"}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{a.contenido_proteina ? `${a.contenido_proteina}%` : "—"}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{a.precio_por_kg ? `$${parseFloat(a.precio_por_kg).toFixed(2)}` : "—"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${parseFloat(a.stock_kg) < 50 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                          {a.stock_kg ? `${parseFloat(a.stock_kg).toFixed(0)} kg` : "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center"><button onClick={() => handleDelete("alimentos", a.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all inline-flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button></td>
                    </tr>
                  ))}
                </tbody></table></div>
            )}
          </div>
        </>
      )}

      {/* ─── CONSUMOS TAB ─── */}
      {tab === "consumos" && (
        <>
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100"><i className="fas fa-utensils text-orange-500"></i>Nuevo Consumo</h3>
              <form onSubmit={handleConsumoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cerdo <span className="text-red-500">*</span></label><select value={consumoForm.pig_id} onChange={(e) => setConsumoForm({ ...consumoForm, pig_id: e.target.value })} className={inputClass} required><option value="">Seleccione...</option>{pigs.map(p => <option key={p.id} value={p.id}>{p.codigo_arete}</option>)}</select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Alimento <span className="text-red-500">*</span></label><select value={consumoForm.alimento_id} onChange={(e) => setConsumoForm({ ...consumoForm, alimento_id: e.target.value })} className={inputClass} required><option value="">Seleccione...</option>{alimentos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}</select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha <span className="text-red-500">*</span></label><input type="date" value={consumoForm.fecha} onChange={(e) => setConsumoForm({ ...consumoForm, fecha: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cantidad (kg) <span className="text-red-500">*</span></label><input type="number" step="0.01" value={consumoForm.cantidad_kg} onChange={(e) => setConsumoForm({ ...consumoForm, cantidad_kg: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Etapa</label><select value={consumoForm.etapa_productiva} onChange={(e) => setConsumoForm({ ...consumoForm, etapa_productiva: e.target.value })} className={inputClass}><option value="CRECIMIENTO">Crecimiento</option><option value="ENGORDE">Engorde</option><option value="GESTACION">Gestación</option><option value="LACTANCIA">Lactancia</option><option value="MANTENIMIENTO">Mantenimiento</option></select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label><input type="text" value={consumoForm.observaciones} onChange={(e) => setConsumoForm({ ...consumoForm, observaciones: e.target.value })} className={inputClass} /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            {consumos.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center"><i className="fas fa-utensils text-orange-500 text-2xl"></i></div><p className="text-gray-500 font-medium">No hay consumos registrados</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cerdo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Alimento</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Etapa</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acc.</th>
              </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {consumos.map(c => (
                    <tr key={c.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{c.codigo_arete}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.nombre_alimento}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(c.fecha).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{parseFloat(c.cantidad_kg).toFixed(2)} kg</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">{c.etapa_productiva}</span></td>
                      <td className="px-6 py-4 text-center"><button onClick={() => handleDelete("consumos", c.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all inline-flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button></td>
                    </tr>
                  ))}
                </tbody></table></div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

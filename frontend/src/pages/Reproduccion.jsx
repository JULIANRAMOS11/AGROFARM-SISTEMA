import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Reproduccion() {
  const [tab, setTab] = useState("servicios");
  const [servicios, setServicios] = useState([]);
  const [partos, setPartos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [servicioForm, setServicioForm] = useState({ cerda_id: "", verraco_id: "", fecha_servicio: "", tipo_servicio: "MONTA_NATURAL", tecnico: "", observaciones: "" });
  const [partoForm, setPartoForm] = useState({ servicio_id: "", fecha_parto: "", lechones_nacidos_vivos: "", lechones_nacidos_muertos: "", lechones_momificados: "", peso_camada_kg: "", observaciones: "" });

  useEffect(() => { fetchData(); }, []);
  const fetchData = async () => {
    try { 
      const [s, p, c] = await Promise.all([
        apiGet("/reproduccion/servicios"), 
        apiGet("/reproduccion/partos"), 
        apiGet("/pigs")
      ]); 
      setServicios(Array.isArray(s) ? s : []); 
      setPartos(Array.isArray(p) ? p : []); 
      setPigs(Array.isArray(c) ? c : []); 
    } catch (err) { 
      console.error("Error al cargar datos:", err);
      toast.error("Error al cargar datos");
      setServicios([]);
      setPartos([]);
      setPigs([]);
    }
  };

  const handleServicioSubmit = async (e) => {
    e.preventDefault();
    try { await apiPost("/reproduccion/servicios", servicioForm); toast.success("Servicio registrado"); setShowForm(false); fetchData(); setServicioForm({ cerda_id: "", verraco_id: "", fecha_servicio: "", tipo_servicio: "MONTA_NATURAL", tecnico: "", observaciones: "" }); }
    catch (err) { toast.error(err.message); }
  };
  const handlePartoSubmit = async (e) => {
    e.preventDefault();
    try { await apiPost("/reproduccion/partos", partoForm); toast.success("Parto registrado"); setShowForm(false); fetchData(); setPartoForm({ servicio_id: "", fecha_parto: "", lechones_nacidos_vivos: "", lechones_nacidos_muertos: "", lechones_momificados: "", peso_camada_kg: "", observaciones: "" }); }
    catch (err) { toast.error(err.message); }
  };
  const handleDelete = async (type, id) => {
    if (!window.confirm("¿Eliminar?")) return;
    try { await apiDelete(`/reproduccion/${type}/${id}`); toast.success("Eliminado"); fetchData(); } catch (err) { toast.error(err.message); }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";
  const hembras = (pigs || []).filter(p => p.sexo === "H" || p.sexo === "Hembra" || p.sexo === "F");
  const machos = (pigs || []).filter(p => p.sexo === "M" || p.sexo === "Macho");

  const getEstadoBadge = (est) => {
    const map = { PENDIENTE: { bg: "bg-amber-100", text: "text-amber-700" }, CONFIRMADA: { bg: "bg-green-100", text: "text-green-700" }, FALLIDA: { bg: "bg-red-100", text: "text-red-700" }, PARTO_REGISTRADO: { bg: "bg-blue-100", text: "text-blue-700" } };
    const s = map[est] || { bg: "bg-gray-100", text: "text-gray-700" };
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>{est}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <i className="fas fa-dna text-white"></i>
            </div>Reproducción
          </h1>
          <p className="text-gray-500 mt-1">{(servicios || []).length} servicios · {(partos || []).length} partos</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <i className={`fas ${showForm ? "fa-times" : "fa-plus"}`}></i>{showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {["servicios", "partos"].map(t => (
          <button key={t} onClick={() => { setTab(t); setShowForm(false); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${tab === t ? "bg-white text-slate-800 shadow-sm" : "text-gray-500 hover:text-slate-700"}`}>
            <i className={`fas ${t === "servicios" ? "fa-heart" : "fa-baby"} mr-2`}></i>
            {t === "servicios" ? "Servicios" : "Partos"}
          </button>
        ))}
      </div>

      {/* ─── SERVICIOS TAB ─── */}
      {tab === "servicios" && (
        <>
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100"><i className="fas fa-heart text-pink-500"></i>Nuevo Servicio</h3>
              <form onSubmit={handleServicioSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Cerda <span className="text-red-500">*</span></label><select value={servicioForm.cerda_id} onChange={(e) => setServicioForm({ ...servicioForm, cerda_id: e.target.value })} className={inputClass} required><option value="">Seleccione cerda...</option>{hembras?.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.raza}</option>)}</select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Verraco <span className="text-red-500">*</span></label><select value={servicioForm.verraco_id} onChange={(e) => setServicioForm({ ...servicioForm, verraco_id: e.target.value })} className={inputClass} required><option value="">Seleccione verraco...</option>{machos?.map(p => <option key={p.id} value={p.id}>{p.codigo_arete} — {p.raza}</option>)}</select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha <span className="text-red-500">*</span></label><input type="date" value={servicioForm.fecha_servicio} onChange={(e) => setServicioForm({ ...servicioForm, fecha_servicio: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipo</label><select value={servicioForm.tipo_servicio} onChange={(e) => setServicioForm({ ...servicioForm, tipo_servicio: e.target.value })} className={inputClass}><option value="MONTA_NATURAL">Monta Natural</option><option value="INSEMINACION">Inseminación</option></select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Técnico</label><input type="text" value={servicioForm.tecnico} onChange={(e) => setServicioForm({ ...servicioForm, tecnico: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label><input type="text" value={servicioForm.observaciones} onChange={(e) => setServicioForm({ ...servicioForm, observaciones: e.target.value })} className={inputClass} /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            {!servicios || servicios.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center"><i className="fas fa-heart text-pink-500 text-2xl"></i></div><p className="text-gray-500 font-medium">No hay servicios registrados</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cerda</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Verraco</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Parto Est.</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acc.</th>
              </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {(servicios || []).map(s => (
                    <tr key={s.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{s.cerda_arete}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.verraco_arete}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(s.fecha_servicio).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.tipo_servicio?.replace("_", " ")}</td>
                      <td className="px-6 py-4">{getEstadoBadge(s.estado)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{s.fecha_parto_estimada ? new Date(s.fecha_parto_estimada).toLocaleDateString() : "—"}</td>
                      <td className="px-6 py-4 text-center"><button onClick={() => handleDelete("servicios", s.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all inline-flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button></td>
                    </tr>
                  ))}
                </tbody></table></div>
            )}
          </div>
        </>
      )}

      {/* ─── PARTOS TAB ─── */}
      {tab === "partos" && (
        <>
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-gray-100"><i className="fas fa-baby text-blue-500"></i>Nuevo Parto</h3>
              <form onSubmit={handlePartoSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Servicio <span className="text-red-500">*</span></label><select value={partoForm.servicio_id} onChange={(e) => setPartoForm({ ...partoForm, servicio_id: e.target.value })} className={inputClass} required><option value="">Seleccione servicio...</option>{(servicios || []).filter(s => s.estado !== "PARTO_REGISTRADO").map(s => <option key={s.id} value={s.id}>{s.cerda_arete} — {new Date(s.fecha_servicio).toLocaleDateString()}</option>)}</select></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha Parto <span className="text-red-500">*</span></label><input type="date" value={partoForm.fecha_parto} onChange={(e) => setPartoForm({ ...partoForm, fecha_parto: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Vivos <span className="text-red-500">*</span></label><input type="number" min="0" value={partoForm.lechones_nacidos_vivos} onChange={(e) => setPartoForm({ ...partoForm, lechones_nacidos_vivos: e.target.value })} className={inputClass} required /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Muertos</label><input type="number" min="0" value={partoForm.lechones_nacidos_muertos} onChange={(e) => setPartoForm({ ...partoForm, lechones_nacidos_muertos: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Momificados</label><input type="number" min="0" value={partoForm.lechones_momificados} onChange={(e) => setPartoForm({ ...partoForm, lechones_momificados: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Peso Camada (kg)</label><input type="number" step="0.01" value={partoForm.peso_camada_kg} onChange={(e) => setPartoForm({ ...partoForm, peso_camada_kg: e.target.value })} className={inputClass} /></div>
                  <div className="lg:col-span-3"><label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label><textarea value={partoForm.observaciones} onChange={(e) => setPartoForm({ ...partoForm, observaciones: e.target.value })} className={inputClass} rows="2" /></div>
                </div>
                <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
                  <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300"><i className="fas fa-save"></i>Guardar</button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition-all">Cancelar</button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            {!partos || partos.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center"><i className="fas fa-baby text-blue-500 text-2xl"></i></div><p className="text-gray-500 font-medium">No hay partos registrados</p></div>
            ) : (
              <div className="overflow-x-auto"><table className="w-full"><thead><tr className="bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cerda</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Vivos</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Muertos</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Momif.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Peso</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acc.</th>
              </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {(partos || []).map(p => (
                    <tr key={p.id} className="hover:bg-green-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-800">{p.cerda_arete}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(p.fecha_parto).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">{p.lechones_nacidos_vivos}</span></td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">{p.lechones_nacidos_muertos || 0}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.lechones_momificados || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{p.peso_camada_kg ? `${parseFloat(p.peso_camada_kg).toFixed(2)} kg` : "—"}</td>
                      <td className="px-6 py-4 text-center"><button onClick={() => handleDelete("partos", p.id)} className="w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-all inline-flex items-center justify-center"><i className="fas fa-trash text-xs"></i></button></td>
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

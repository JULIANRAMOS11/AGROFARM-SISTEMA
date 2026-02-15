import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Sanidad() {
  const [registros, setRegistros] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "",
    tipo: "VACUNA",
    fecha: "",
    medicamento_vacuna: "",
    dosis: "",
    via_administracion: "INTRAMUSCULAR",
    veterinario: "",
    diagnostico: "",
    tratamiento: "",
    costo: "",
    proxima_aplicacion: "",
    observaciones: ""
  });

  useEffect(() => {
    fetchRegistros();
    fetchPigs();
  }, []);

  const fetchRegistros = async () => {
    try {
      const data = await apiGet("/sanidad");
      setRegistros(data);
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  };

  const fetchPigs = async () => {
    try {
      const data = await apiGet("/pigs");
      setPigs(data);
    } catch (error) {
      console.error("Error al cargar cerdos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/sanidad", formData);
      toast.success("Registro sanitario creado exitosamente");
      setShowForm(false);
      fetchRegistros();
      setFormData({
        pig_id: "", tipo: "VACUNA", fecha: "", medicamento_vacuna: "",
        dosis: "", via_administracion: "INTRAMUSCULAR", veterinario: "",
        diagnostico: "", tratamiento: "", costo: "", proxima_aplicacion: "",
        observaciones: ""
      });
    } catch (error) {
      console.error("Error al crear registro:", error);
      toast.error(error.message || "Error de conexión");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        await apiDelete(`/sanidad/${id}`);
        toast.success("Registro eliminado");
        fetchRegistros();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error(error.message || "Error de conexión");
      }
    }
  };

  const getTipoBadge = (tipo) => {
    const styles = {
      VACUNA: "bg-blue-50 text-blue-700 border-blue-100",
      TRATAMIENTO: "bg-purple-50 text-purple-700 border-purple-100",
      DESPARASITACION: "bg-emerald-50 text-emerald-700 border-emerald-100",
      DIAGNOSTICO: "bg-amber-50 text-amber-700 border-amber-100"
    };
    return styles[tipo] || "bg-gray-50 text-gray-700 border-gray-100";
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <i className="fas fa-heart-pulse text-green-500"></i>Sanidad
          </h2>
          <p className="text-sm text-gray-400 mt-0.5">{registros.length} registros</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          {showForm ? "Cerrar" : "Nuevo Registro"}
        </button>
      </div>

      {/* Formulario */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-6 animate-scaleIn">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i className="fas fa-file-medical text-green-500"></i>Nuevo Registro Sanitario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Cerdo <span className="required">*</span></label>
              <select value={formData.pig_id} onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })} className="input-modern" required>
                <option value="">Seleccione...</option>
                {pigs.map((pig) => (
                  <option key={pig.id} value={pig.id}>{pig.codigo_arete} - {pig.sexo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Tipo <span className="required">*</span></label>
              <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })} className="input-modern" required>
                <option value="VACUNA">Vacuna</option>
                <option value="TRATAMIENTO">Tratamiento</option>
                <option value="DESPARASITACION">Desparasitación</option>
                <option value="DIAGNOSTICO">Diagnóstico</option>
              </select>
            </div>
            <div>
              <label className="form-label">Fecha <span className="required">*</span></label>
              <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })} className="input-modern" required />
            </div>
            <div>
              <label className="form-label">Medicamento/Vacuna <span className="required">*</span></label>
              <input type="text" value={formData.medicamento_vacuna} onChange={(e) => setFormData({ ...formData, medicamento_vacuna: e.target.value })} className="input-modern" required placeholder="Nombre del medicamento" />
            </div>
            <div>
              <label className="form-label">Dosis</label>
              <input type="text" value={formData.dosis} onChange={(e) => setFormData({ ...formData, dosis: e.target.value })} className="input-modern" placeholder="ej: 2ml, 500mg" />
            </div>
            <div>
              <label className="form-label">Vía de Administración</label>
              <select value={formData.via_administracion} onChange={(e) => setFormData({ ...formData, via_administracion: e.target.value })} className="input-modern">
                <option value="ORAL">Oral</option>
                <option value="INTRAMUSCULAR">Intramuscular</option>
                <option value="SUBCUTANEA">Subcutánea</option>
                <option value="TOPICA">Tópica</option>
              </select>
            </div>
            <div>
              <label className="form-label">Veterinario</label>
              <input type="text" value={formData.veterinario} onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })} className="input-modern" placeholder="Nombre del veterinario" />
            </div>
            <div>
              <label className="form-label">Costo</label>
              <input type="number" step="0.01" value={formData.costo} onChange={(e) => setFormData({ ...formData, costo: e.target.value })} className="input-modern" placeholder="0.00" min="0" />
            </div>
            <div>
              <label className="form-label">Próxima Aplicación</label>
              <input type="date" value={formData.proxima_aplicacion} onChange={(e) => setFormData({ ...formData, proxima_aplicacion: e.target.value })} className="input-modern" />
            </div>
            <div>
              <label className="form-label">Diagnóstico</label>
              <input type="text" value={formData.diagnostico} onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })} className="input-modern" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="form-label">Tratamiento</label>
              <textarea value={formData.tratamiento} onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })} className="input-modern" rows="2" />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="form-label">Observaciones</label>
              <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className="input-modern" rows="2" />
            </div>
          </div>
          <div className="flex gap-2 mt-5">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i>Guardar
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Tabla */}
      <div className="glass-card overflow-hidden">
        {registros.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-heart-pulse"></i>
            <p>No hay registros sanitarios todavía.</p>
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
                  <th>Próxima</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {registros.map((registro) => (
                  <tr key={registro.id}>
                    <td className="font-semibold text-gray-900">{registro.codigo_arete}</td>
                    <td>
                      <span className={`badge border ${getTipoBadge(registro.tipo)}`}>
                        {registro.tipo}
                      </span>
                    </td>
                    <td>{new Date(registro.fecha).toLocaleDateString()}</td>
                    <td>{registro.medicamento_vacuna}</td>
                    <td>{registro.dosis || "—"}</td>
                    <td>{registro.veterinario || "—"}</td>
                    <td>{registro.proxima_aplicacion ? new Date(registro.proxima_aplicacion).toLocaleDateString() : "—"}</td>
                    <td className="text-center">
                      <button onClick={() => handleDelete(registro.id)} className="btn-danger">
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

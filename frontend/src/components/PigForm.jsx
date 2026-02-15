// src/components/PigForm.jsx — Formulario de cerdo Premium
import { useState } from "react";

export default function PigForm({ onAddPig, initialData }) {
  const [formData, setFormData] = useState(initialData || {
    codigo_arete: "", nombre: "", raza: "", sexo: "M",
    fecha_nacimiento: "", peso_actual: "", estado: "ACTIVO",
    ubicacion: "", observaciones: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddPig(formData);
    if (!initialData) {
      setFormData({ codigo_arete: "", nombre: "", raza: "", sexo: "M", fecha_nacimiento: "", peso_actual: "", estado: "ACTIVO", ubicacion: "", observaciones: "" });
    }
  };

  const inputClass = "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-slate-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all";

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Código Arete <span className="text-red-500">*</span>
          </label>
          <input type="text" value={formData.codigo_arete} onChange={(e) => setFormData({ ...formData, codigo_arete: e.target.value })} className={inputClass} placeholder="Ej: A001" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre</label>
          <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className={inputClass} placeholder="Nombre del cerdo" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Raza <span className="text-red-500">*</span></label>
          <select value={formData.raza} onChange={(e) => setFormData({ ...formData, raza: e.target.value })} className={inputClass} required>
            <option value="">Seleccione raza...</option>
            <option value="Landrace">Landrace</option>
            <option value="Yorkshire">Yorkshire</option>
            <option value="Duroc">Duroc</option>
            <option value="Pietrain">Pietrain</option>
            <option value="Hampshire">Hampshire</option>
            <option value="Berkshire">Berkshire</option>
            <option value="Criollo">Criollo</option>
            <option value="Mestizo">Mestizo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Sexo <span className="text-red-500">*</span></label>
          <select value={formData.sexo} onChange={(e) => setFormData({ ...formData, sexo: e.target.value })} className={inputClass} required>
            <option value="M">Macho</option>
            <option value="H">Hembra</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Fecha Nacimiento</label>
          <input type="date" value={formData.fecha_nacimiento} onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Peso Actual (kg)</label>
          <input type="number" step="0.01" min="0" value={formData.peso_actual} onChange={(e) => setFormData({ ...formData, peso_actual: e.target.value })} className={inputClass} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ubicación</label>
          <input type="text" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} className={inputClass} placeholder="Corral, galpón..." />
        </div>
        <div className="lg:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Observaciones</label>
          <textarea value={formData.observaciones} onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })} className={inputClass} rows="2" placeholder="Notas adicionales..." />
        </div>
      </div>
      <div className="mt-6 pt-5 border-t border-gray-100">
        <button type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:scale-105 transition-all duration-300">
          <i className="fas fa-save"></i>
          {initialData ? "Actualizar Cerdo" : "Registrar Cerdo"}
        </button>
      </div>
    </form>
  );
}

// src/components/PigForm.jsx
import { useState } from "react";

/**
 * Formulario controlado para registrar cerdos.
 * Contiene validaciones básicas de los campos.
 */
function PigForm({ onAddPig }) {
  const [form, setForm] = useState({
    codigo_arete: "",
    sexo: "M",
    peso_actual: "",
    fecha_nacimiento: "",
    estado: "ACTIVO",
  });

  const [errors, setErrors] = useState({});

  // Actualiza el estado del formulario cuando el usuario escribe
  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validaciones simples de los campos
  const validate = () => {
    const newErrors = {};

    if (!form.codigo_arete.trim()) newErrors.codigo_arete = "El código de arete es obligatorio";
    if (!form.sexo) newErrors.sexo = "El sexo es obligatorio";
    if (!form.peso_actual || Number(form.peso_actual) <= 0)
      newErrors.peso_actual = "El peso debe ser mayor a 0";
    if (!form.fecha_nacimiento)
      newErrors.fecha_nacimiento = "La fecha de nacimiento es obligatoria";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Envía el formulario
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    // Enviar al backend con UUIDs fijos (temporal)
    onAddPig({
      codigo_arete: form.codigo_arete.trim(),
      sexo: form.sexo,
      peso_actual: Number(form.peso_actual),
      fecha_nacimiento: form.fecha_nacimiento,
      estado: form.estado,
      lote_id: "8d6c2f0a-3b17-4b2a-9c8e-1f2a3d4e5b6c",
      etapa_id: "b2c3d4e5-2222-3333-4444-555566667777",
      raza_id: "d0fb3d79-c997-46fc-8749-e64a63755f13",
    });

    // Reinicia el formulario
    setForm({
      codigo_arete: "",
      sexo: "M",
      peso_actual: "",
      fecha_nacimiento: "",
      estado: "ACTIVO",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Código de Arete</label>
        <input
          id="codigo_arete"
          name="codigo_arete"
          type="text"
          value={form.codigo_arete}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          placeholder="Ej: A001"
        />
        {errors.codigo_arete && <span className="text-xs text-red-600 mt-1">{errors.codigo_arete}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
        <select
          id="sexo"
          name="sexo"
          value={form.sexo}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
        >
          <option value="M">Macho</option>
          <option value="F">Hembra</option>
        </select>
        {errors.sexo && <span className="text-xs text-red-600 mt-1">{errors.sexo}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Peso actual (kg)</label>
        <input
          id="peso_actual"
          name="peso_actual"
          type="number"
          step="0.1"
          value={form.peso_actual}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
          placeholder="Ej: 45.5"
        />
        {errors.peso_actual && <span className="text-xs text-red-600 mt-1">{errors.peso_actual}</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
        <input
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
        />
        {errors.fecha_nacimiento && (
          <span className="text-xs text-red-600 mt-1">{errors.fecha_nacimiento}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select
          id="estado"
          name="estado"
          value={form.estado}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
        >
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      <div className="flex items-end">
        <button 
          type="submit" 
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          Registrar Cerdo
        </button>
      </div>
    </form>
  );
}

export default PigForm;

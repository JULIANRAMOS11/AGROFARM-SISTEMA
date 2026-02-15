// src/components/PigForm.jsx — Formulario moderno para registrar cerdos
import { useState } from "react";

function PigForm({ onAddPig }) {
  const [form, setForm] = useState({
    codigo_arete: "",
    sexo: "M",
    peso_actual: "",
    fecha_nacimiento: "",
    estado: "ACTIVO",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

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
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">

      <div>
        <label className="form-label">
          Código de Arete <span className="required">*</span>
        </label>
        <input
          name="codigo_arete"
          type="text"
          value={form.codigo_arete}
          onChange={handleChange}
          className="input-modern"
          placeholder="Ej: A001"
        />
        {errors.codigo_arete && <span className="text-xs text-red-500 mt-1 block">{errors.codigo_arete}</span>}
      </div>

      <div>
        <label className="form-label">
          Sexo <span className="required">*</span>
        </label>
        <select name="sexo" value={form.sexo} onChange={handleChange} className="input-modern">
          <option value="M">Macho</option>
          <option value="F">Hembra</option>
        </select>
        {errors.sexo && <span className="text-xs text-red-500 mt-1 block">{errors.sexo}</span>}
      </div>

      <div>
        <label className="form-label">
          Peso actual (kg) <span className="required">*</span>
        </label>
        <input
          name="peso_actual"
          type="number"
          step="0.1"
          value={form.peso_actual}
          onChange={handleChange}
          className="input-modern"
          placeholder="Ej: 45.5"
        />
        {errors.peso_actual && <span className="text-xs text-red-500 mt-1 block">{errors.peso_actual}</span>}
      </div>

      <div>
        <label className="form-label">
          Fecha de nacimiento <span className="required">*</span>
        </label>
        <input
          name="fecha_nacimiento"
          type="date"
          value={form.fecha_nacimiento}
          onChange={handleChange}
          className="input-modern"
        />
        {errors.fecha_nacimiento && <span className="text-xs text-red-500 mt-1 block">{errors.fecha_nacimiento}</span>}
      </div>

      <div>
        <label className="form-label">Estado</label>
        <select name="estado" value={form.estado} onChange={handleChange} className="input-modern">
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
      </div>

      <div className="flex items-end">
        <button type="submit" className="btn-primary w-full">
          <i className="fas fa-plus"></i>
          Registrar
        </button>
      </div>
    </form>
  );
}

export default PigForm;

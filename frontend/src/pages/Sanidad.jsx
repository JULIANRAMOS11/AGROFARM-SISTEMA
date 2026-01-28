import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api-agrofarm.onrender.com/api";

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
      const res = await fetch(`${API_BASE_URL}/sanidad`);
      const data = await res.json();
      setRegistros(data);
    } catch (error) {
      console.error("Error al cargar registros:", error);
    }
  };

  const fetchPigs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/pigs`);
      const data = await res.json();
      setPigs(data);
    } catch (error) {
      console.error("Error al cargar cerdos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/sanidad`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Registro sanitario creado exitosamente");
        setShowForm(false);
        fetchRegistros();
        setFormData({
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
      }
    } catch (error) {
      console.error("Error al crear registro:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/sanidad/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Registro eliminado");
          fetchRegistros();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const getTipoBadge = (tipo) => {
    const colors = {
      VACUNA: "bg-blue-100 text-blue-800",
      TRATAMIENTO: "bg-purple-100 text-purple-800",
      DESPARASITACION: "bg-green-100 text-green-800",
      DIAGNOSTICO: "bg-yellow-100 text-yellow-800"
    };
    return colors[tipo] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-heart-pulse mr-2"></i>Sanidad
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Nuevo Registro
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Nuevo Registro Sanitario</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Cerdo</label>
              <select
                value={formData.pig_id}
                onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="">Seleccione...</option>
                {pigs.map((pig) => (
                  <option key={pig.id} value={pig.id}>
                    {pig.codigo_arete} - {pig.sexo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              >
                <option value="VACUNA">Vacuna</option>
                <option value="TRATAMIENTO">Tratamiento</option>
                <option value="DESPARASITACION">Desparasitación</option>
                <option value="DIAGNOSTICO">Diagnóstico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Fecha</label>
              <input
                type="date"
                value={formData.fecha}
                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Medicamento/Vacuna</label>
              <input
                type="text"
                value={formData.medicamento_vacuna}
                onChange={(e) => setFormData({ ...formData, medicamento_vacuna: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
                placeholder="Nombre del medicamento"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Dosis</label>
              <input
                type="text"
                value={formData.dosis}
                onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="ej: 2ml, 500mg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Vía de Administración</label>
              <select
                value={formData.via_administracion}
                onChange={(e) => setFormData({ ...formData, via_administracion: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="ORAL">Oral</option>
                <option value="INTRAMUSCULAR">Intramuscular</option>
                <option value="SUBCUTANEA">Subcutánea</option>
                <option value="TOPICA">Tópica</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Veterinario</label>
              <input
                type="text"
                value={formData.veterinario}
                onChange={(e) => setFormData({ ...formData, veterinario: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="Nombre del veterinario"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Costo</label>
              <input
                type="number"
                step="0.01"
                value={formData.costo}
                onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Próxima Aplicación</label>
              <input
                type="date"
                value={formData.proxima_aplicacion}
                onChange={(e) => setFormData({ ...formData, proxima_aplicacion: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Diagnóstico</label>
              <input
                type="text"
                value={formData.diagnostico}
                onChange={(e) => setFormData({ ...formData, diagnostico: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Tratamiento</label>
              <textarea
                value={formData.tratamiento}
                onChange={(e) => setFormData({ ...formData, tratamiento: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="2"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-semibold mb-1">Observaciones</label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                rows="2"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-gray-300 px-6 py-2 rounded-lg"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Cerdo</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Medicamento/Vacuna</th>
              <th className="px-4 py-3 text-left">Dosis</th>
              <th className="px-4 py-3 text-left">Veterinario</th>
              <th className="px-4 py-3 text-left">Próxima</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{registro.codigo_arete}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTipoBadge(registro.tipo)}`}>
                    {registro.tipo}
                  </span>
                </td>
                <td className="px-4 py-3">{new Date(registro.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-3">{registro.medicamento_vacuna}</td>
                <td className="px-4 py-3">{registro.dosis || "-"}</td>
                <td className="px-4 py-3">{registro.veterinario || "-"}</td>
                <td className="px-4 py-3">
                  {registro.proxima_aplicacion ? new Date(registro.proxima_aplicacion).toLocaleDateString() : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(registro.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

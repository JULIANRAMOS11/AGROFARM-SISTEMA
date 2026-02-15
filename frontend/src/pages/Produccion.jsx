import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { apiGet, apiPost, apiDelete } from "../services/api";

export default function Produccion() {
  const [registros, setRegistros] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "",
    fecha: "",
    peso: "",
    edad_dias: "",
    ganancia_diaria: "",
    consumo_alimento_kg: "",
    conversion_alimenticia: "",
    lote: "",
    observaciones: ""
  });

  useEffect(() => {
    fetchRegistros();
    fetchPigs();
    fetchEstadisticas();
  }, []);

  const fetchRegistros = async () => {
    try {
      const data = await apiGet("/produccion");
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

  const fetchEstadisticas = async () => {
    try {
      const data = await apiGet("/produccion/estadisticas");
      setEstadisticas(data);
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/produccion", formData);
      toast.success("Registro de producción creado exitosamente");
      setShowForm(false);
      fetchRegistros();
      fetchEstadisticas();
      setFormData({
        pig_id: "",
        fecha: "",
        peso: "",
        edad_dias: "",
        ganancia_diaria: "",
        consumo_alimento_kg: "",
        conversion_alimenticia: "",
        lote: "",
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
        await apiDelete(`/produccion/${id}`);
        toast.success("Registro eliminado");
        fetchRegistros();
        fetchEstadisticas();
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast.error(error.message || "Error de conexión");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-chart-line mr-2"></i>Producción
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          <i className="fas fa-plus mr-2"></i>Nuevo Registro
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-md">
            <div className="text-sm opacity-90">Cerdos en Producción</div>
            <div className="text-3xl font-bold mt-2">{estadisticas.total_cerdos || 0}</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg shadow-md">
            <div className="text-sm opacity-90">Peso Promedio (kg)</div>
            <div className="text-3xl font-bold mt-2">
              {estadisticas.peso_promedio ? parseFloat(estadisticas.peso_promedio).toFixed(2) : "0"}
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg shadow-md">
            <div className="text-sm opacity-90">Ganancia Diaria (kg)</div>
            <div className="text-3xl font-bold mt-2">
              {estadisticas.ganancia_promedio ? parseFloat(estadisticas.ganancia_promedio).toFixed(3) : "0"}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-md">
            <div className="text-sm opacity-90">Conversión Alimenticia</div>
            <div className="text-3xl font-bold mt-2">
              {estadisticas.conversion_promedio ? parseFloat(estadisticas.conversion_promedio).toFixed(2) : "0"}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Nuevo Registro de Producción</h3>
          <div className="grid grid-cols-3 gap-4">
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
              <label className="block text-sm font-semibold mb-1">Peso (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Edad (días)</label>
              <input
                type="number"
                value={formData.edad_dias}
                onChange={(e) => setFormData({ ...formData, edad_dias: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Ganancia Diaria (kg)</label>
              <input
                type="number"
                step="0.001"
                value={formData.ganancia_diaria}
                onChange={(e) => setFormData({ ...formData, ganancia_diaria: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Consumo Alimento (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.consumo_alimento_kg}
                onChange={(e) => setFormData({ ...formData, consumo_alimento_kg: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Conversión Alimenticia</label>
              <input
                type="number"
                step="0.01"
                value={formData.conversion_alimenticia}
                onChange={(e) => setFormData({ ...formData, conversion_alimenticia: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                placeholder="0.00"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Lote</label>
              <input
                type="text"
                value={formData.lote}
                onChange={(e) => setFormData({ ...formData, lote: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div className="col-span-3">
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
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-center">Peso (kg)</th>
              <th className="px-4 py-3 text-center">Edad (días)</th>
              <th className="px-4 py-3 text-center">Ganancia Diaria</th>
              <th className="px-4 py-3 text-center">Consumo (kg)</th>
              <th className="px-4 py-3 text-center">Conv. Alim.</th>
              <th className="px-4 py-3 text-left">Lote</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((registro) => (
              <tr key={registro.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">{registro.codigo_arete}</td>
                <td className="px-4 py-3">{new Date(registro.fecha).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-center font-bold text-green-600">{parseFloat(registro.peso).toFixed(2)}</td>
                <td className="px-4 py-3 text-center">{registro.edad_dias || "-"}</td>
                <td className="px-4 py-3 text-center">
                  {registro.ganancia_diaria ? parseFloat(registro.ganancia_diaria).toFixed(3) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {registro.consumo_alimento_kg ? parseFloat(registro.consumo_alimento_kg).toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  {registro.conversion_alimenticia ? parseFloat(registro.conversion_alimenticia).toFixed(2) : "-"}
                </td>
                <td className="px-4 py-3">{registro.lote || "-"}</td>
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

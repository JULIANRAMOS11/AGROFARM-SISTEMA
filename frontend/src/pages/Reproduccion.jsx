import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";

export default function Reproduccion() {
  const [activeTab, setActiveTab] = useState("servicios");
  const [servicios, setServicios] = useState([]);
  const [partos, setPartos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPartoForm, setShowPartoForm] = useState(false);
  const [formData, setFormData] = useState({
    pig_id: "",
    tipo_servicio: "MONTA_NATURAL",
    fecha_servicio: "",
    verraco: "",
    fecha_probable_parto: "",
    estado: "GESTANTE",
    observaciones: ""
  });
  const [partoData, setPartoData] = useState({
    reproduccion_id: "",
    pig_id: "",
    fecha_parto: "",
    lechones_nacidos_vivos: 0,
    lechones_nacidos_muertos: 0,
    lechones_momificados: 0,
    peso_promedio_lechon: "",
    observaciones: ""
  });

  useEffect(() => {
    fetchServicios();
    fetchPartos();
    fetchPigs();
  }, []);

  const fetchServicios = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/reproduccion`);
      const data = await res.json();
      setServicios(data);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reproduccion/partos/all`);
      const data = await res.json();
      setPartos(data);
    } catch (error) {
      console.error("Error al cargar partos:", error);
    }
  };

  const fetchPigs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/pigs`);
      const data = await res.json();
      setPigs(data.filter(p => p.sexo === "H" || p.sexo === "Hembra"));
    } catch (error) {
      console.error("Error al cargar cerdos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/reproduccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Servicio registrado exitosamente");
        setShowForm(false);
        fetchServicios();
        setFormData({
          pig_id: "",
          tipo_servicio: "MONTA_NATURAL",
          fecha_servicio: "",
          verraco: "",
          fecha_probable_parto: "",
          estado: "GESTANTE",
          observaciones: ""
        });
      }
    } catch (error) {
      console.error("Error al crear servicio:", error);
    }
  };

  const handlePartoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/reproduccion/partos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partoData)
      });
      if (res.ok) {
        alert("Parto registrado exitosamente");
        setShowPartoForm(false);
        fetchPartos();
        fetchServicios();
        setPartoData({
          reproduccion_id: "",
          pig_id: "",
          fecha_parto: "",
          lechones_nacidos_vivos: 0,
          lechones_nacidos_muertos: 0,
          lechones_momificados: 0,
          peso_promedio_lechon: "",
          observaciones: ""
        });
      }
    } catch (error) {
      console.error("Error al registrar parto:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Eliminar este registro?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/reproduccion/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Registro eliminado");
          fetchServicios();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const getEstadoBadge = (estado) => {
    const colors = {
      GESTANTE: "bg-yellow-100 text-yellow-800",
      CONFIRMADA: "bg-blue-100 text-blue-800",
      FALLIDA: "bg-red-100 text-red-800",
      PARTO_REALIZADO: "bg-green-100 text-green-800"
    };
    return colors[estado] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-baby mr-2"></i>Reproducción
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("servicios")}
          className={`pb-2 px-4 font-semibold ${
            activeTab === "servicios"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          Servicios
        </button>
        <button
          onClick={() => setActiveTab("partos")}
          className={`pb-2 px-4 font-semibold ${
            activeTab === "partos"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          Partos
        </button>
      </div>

      {/* Tab: Servicios */}
      {activeTab === "servicios" && (
        <div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i>Nuevo Servicio
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Cerda</label>
                  <select
                    value={formData.pig_id}
                    onChange={(e) => setFormData({ ...formData, pig_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {pigs.map((pig) => (
                      <option key={pig.id} value={pig.id}>
                        {pig.codigo_arete}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo de Servicio</label>
                  <select
                    value={formData.tipo_servicio}
                    onChange={(e) => setFormData({ ...formData, tipo_servicio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="MONTA_NATURAL">Monta Natural</option>
                    <option value="INSEMINACION">Inseminación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha Servicio</label>
                  <input
                    type="date"
                    value={formData.fecha_servicio}
                    onChange={(e) => setFormData({ ...formData, fecha_servicio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Verraco</label>
                  <input
                    type="text"
                    value={formData.verraco}
                    onChange={(e) => setFormData({ ...formData, verraco: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha Probable Parto</label>
                  <input
                    type="date"
                    value={formData.fecha_probable_parto}
                    onChange={(e) => setFormData({ ...formData, fecha_probable_parto: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="GESTANTE">Gestante</option>
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="FALLIDA">Fallida</option>
                  </select>
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
                  <th className="px-4 py-3 text-left">Cerda</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-left">Fecha Servicio</th>
                  <th className="px-4 py-3 text-left">Verraco</th>
                  <th className="px-4 py-3 text-left">Fecha Probable Parto</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {servicios.map((servicio) => (
                  <tr key={servicio.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{servicio.codigo_arete}</td>
                    <td className="px-4 py-3">{servicio.tipo_servicio}</td>
                    <td className="px-4 py-3">{new Date(servicio.fecha_servicio).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{servicio.verraco || "-"}</td>
                    <td className="px-4 py-3">
                      {servicio.fecha_probable_parto ? new Date(servicio.fecha_probable_parto).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getEstadoBadge(servicio.estado)}`}>
                        {servicio.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(servicio.id)}
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
      )}

      {/* Tab: Partos */}
      {activeTab === "partos" && (
        <div>
          <button
            onClick={() => setShowPartoForm(!showPartoForm)}
            className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i>Registrar Parto
          </button>

          {showPartoForm && (
            <form onSubmit={handlePartoSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Cerda</label>
                  <select
                    value={partoData.pig_id}
                    onChange={(e) => setPartoData({ ...partoData, pig_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {pigs.map((pig) => (
                      <option key={pig.id} value={pig.id}>
                        {pig.codigo_arete}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha Parto</label>
                  <input
                    type="date"
                    value={partoData.fecha_parto}
                    onChange={(e) => setPartoData({ ...partoData, fecha_parto: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Lechones Vivos</label>
                  <input
                    type="number"
                    value={partoData.lechones_nacidos_vivos}
                    onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_vivos: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Lechones Muertos</label>
                  <input
                    type="number"
                    value={partoData.lechones_nacidos_muertos}
                    onChange={(e) => setPartoData({ ...partoData, lechones_nacidos_muertos: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Momificados</label>
                  <input
                    type="number"
                    value={partoData.lechones_momificados}
                    onChange={(e) => setPartoData({ ...partoData, lechones_momificados: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Peso Promedio (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={partoData.peso_promedio_lechon}
                    onChange={(e) => setPartoData({ ...partoData, peso_promedio_lechon: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Observaciones</label>
                  <textarea
                    value={partoData.observaciones}
                    onChange={(e) => setPartoData({ ...partoData, observaciones: e.target.value })}
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
                  onClick={() => setShowPartoForm(false)}
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
                  <th className="px-4 py-3 text-left">Cerda</th>
                  <th className="px-4 py-3 text-left">Fecha Parto</th>
                  <th className="px-4 py-3 text-center">Vivos</th>
                  <th className="px-4 py-3 text-center">Muertos</th>
                  <th className="px-4 py-3 text-center">Momificados</th>
                  <th className="px-4 py-3 text-center">Peso Prom (kg)</th>
                </tr>
              </thead>
              <tbody>
                {partos.map((parto) => (
                  <tr key={parto.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{parto.codigo_arete}</td>
                    <td className="px-4 py-3">{new Date(parto.fecha_parto).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">{parto.lechones_nacidos_vivos}</td>
                    <td className="px-4 py-3 text-center text-red-600">{parto.lechones_nacidos_muertos}</td>
                    <td className="px-4 py-3 text-center text-gray-600">{parto.lechones_momificados}</td>
                    <td className="px-4 py-3 text-center">{parto.peso_promedio_lechon || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

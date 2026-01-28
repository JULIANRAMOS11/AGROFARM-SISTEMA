import { useState, useEffect } from "react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api";

export default function Nutricion() {
  const [activeTab, setActiveTab] = useState("alimentos");
  const [alimentos, setAlimentos] = useState([]);
  const [consumos, setConsumos] = useState([]);
  const [pigs, setPigs] = useState([]);
  const [showAlimentoForm, setShowAlimentoForm] = useState(false);
  const [showConsumoForm, setShowConsumoForm] = useState(false);
  
  const [alimentoData, setAlimentoData] = useState({
    nombre_alimento: "",
    tipo: "CRECIMIENTO",
    proteina_porcentaje: "",
    costo_por_kg: "",
    proveedor: "",
    stock_kg: "",
    observaciones: ""
  });

  const [consumoData, setConsumoData] = useState({
    pig_id: "",
    alimento_id: "",
    fecha: "",
    cantidad_kg: "",
    lote: "",
    observaciones: ""
  });

  useEffect(() => {
    fetchAlimentos();
    fetchConsumos();
    fetchPigs();
  }, []);

  const fetchAlimentos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/nutricion/alimentos`);
      const data = await res.json();
      setAlimentos(data);
    } catch (error) {
      console.error("Error al cargar alimentos:", error);
    }
  };

  const fetchConsumos = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/nutricion/consumos`);
      const data = await res.json();
      setConsumos(data);
    } catch (error) {
      console.error("Error al cargar consumos:", error);
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

  const handleAlimentoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/nutricion/alimentos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(alimentoData)
      });
      if (res.ok) {
        alert("Alimento creado exitosamente");
        setShowAlimentoForm(false);
        fetchAlimentos();
        setAlimentoData({
          nombre_alimento: "",
          tipo: "CRECIMIENTO",
          proteina_porcentaje: "",
          costo_por_kg: "",
          proveedor: "",
          stock_kg: "",
          observaciones: ""
        });
      }
    } catch (error) {
      console.error("Error al crear alimento:", error);
    }
  };

  const handleConsumoSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/nutricion/consumos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consumoData)
      });
      if (res.ok) {
        alert("Consumo registrado exitosamente");
        setShowConsumoForm(false);
        fetchConsumos();
        fetchAlimentos(); // Actualizar stock
        setConsumoData({
          pig_id: "",
          alimento_id: "",
          fecha: "",
          cantidad_kg: "",
          lote: "",
          observaciones: ""
        });
      }
    } catch (error) {
      console.error("Error al registrar consumo:", error);
    }
  };

  const handleDeleteAlimento = async (id) => {
    if (window.confirm("¿Eliminar este alimento?")) {
      try {
        const res = await fetch(`${API_BASE_URL}/nutricion/alimentos/${id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          alert("Alimento eliminado");
          fetchAlimentos();
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const getTipoBadge = (tipo) => {
    const colors = {
      INICIADOR: "bg-purple-100 text-purple-800",
      CRECIMIENTO: "bg-blue-100 text-blue-800",
      ENGORDE: "bg-green-100 text-green-800",
      GESTACION: "bg-pink-100 text-pink-800",
      LACTANCIA: "bg-yellow-100 text-yellow-800"
    };
    return colors[tipo] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          <i className="fas fa-apple-whole mr-2"></i>Nutrición
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("alimentos")}
          className={`pb-2 px-4 font-semibold ${
            activeTab === "alimentos"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          Catálogo de Alimentos
        </button>
        <button
          onClick={() => setActiveTab("consumos")}
          className={`pb-2 px-4 font-semibold ${
            activeTab === "consumos"
              ? "border-b-2 border-green-600 text-green-600"
              : "text-gray-600"
          }`}
        >
          Registro de Consumo
        </button>
      </div>

      {/* Tab: Alimentos */}
      {activeTab === "alimentos" && (
        <div>
          <button
            onClick={() => setShowAlimentoForm(!showAlimentoForm)}
            className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i>Nuevo Alimento
          </button>

          {showAlimentoForm && (
            <form onSubmit={handleAlimentoSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4">Nuevo Alimento</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre Alimento</label>
                  <input
                    type="text"
                    value={alimentoData.nombre_alimento}
                    onChange={(e) => setAlimentoData({ ...alimentoData, nombre_alimento: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo</label>
                  <select
                    value={alimentoData.tipo}
                    onChange={(e) => setAlimentoData({ ...alimentoData, tipo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="INICIADOR">Iniciador</option>
                    <option value="CRECIMIENTO">Crecimiento</option>
                    <option value="ENGORDE">Engorde</option>
                    <option value="GESTACION">Gestación</option>
                    <option value="LACTANCIA">Lactancia</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Proteína (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={alimentoData.proteina_porcentaje}
                    onChange={(e) => setAlimentoData({ ...alimentoData, proteina_porcentaje: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Costo por kg</label>
                  <input
                    type="number"
                    step="0.01"
                    value={alimentoData.costo_por_kg}
                    onChange={(e) => setAlimentoData({ ...alimentoData, costo_por_kg: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Proveedor</label>
                  <input
                    type="text"
                    value={alimentoData.proveedor}
                    onChange={(e) => setAlimentoData({ ...alimentoData, proveedor: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Stock (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={alimentoData.stock_kg}
                    onChange={(e) => setAlimentoData({ ...alimentoData, stock_kg: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Observaciones</label>
                  <textarea
                    value={alimentoData.observaciones}
                    onChange={(e) => setAlimentoData({ ...alimentoData, observaciones: e.target.value })}
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
                  onClick={() => setShowAlimentoForm(false)}
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
                  <th className="px-4 py-3 text-left">Nombre</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-center">Proteína (%)</th>
                  <th className="px-4 py-3 text-center">Costo/kg</th>
                  <th className="px-4 py-3 text-left">Proveedor</th>
                  <th className="px-4 py-3 text-center">Stock (kg)</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alimentos.map((alimento) => (
                  <tr key={alimento.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{alimento.nombre_alimento}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${getTipoBadge(alimento.tipo)}`}>
                        {alimento.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{alimento.proteina_porcentaje || "-"}</td>
                    <td className="px-4 py-3 text-center">
                      {alimento.costo_por_kg ? `$${parseFloat(alimento.costo_por_kg).toFixed(2)}` : "-"}
                    </td>
                    <td className="px-4 py-3">{alimento.proveedor || "-"}</td>
                    <td className="px-4 py-3 text-center font-bold text-blue-600">
                      {parseFloat(alimento.stock_kg).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteAlimento(alimento.id)}
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

      {/* Tab: Consumos */}
      {activeTab === "consumos" && (
        <div>
          <button
            onClick={() => setShowConsumoForm(!showConsumoForm)}
            className="mb-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            <i className="fas fa-plus mr-2"></i>Registrar Consumo
          </button>

          {showConsumoForm && (
            <form onSubmit={handleConsumoSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-bold mb-4">Registrar Consumo</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Cerdo</label>
                  <select
                    value={consumoData.pig_id}
                    onChange={(e) => setConsumoData({ ...consumoData, pig_id: e.target.value })}
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
                  <label className="block text-sm font-semibold mb-1">Alimento</label>
                  <select
                    value={consumoData.alimento_id}
                    onChange={(e) => setConsumoData({ ...consumoData, alimento_id: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  >
                    <option value="">Seleccione...</option>
                    {alimentos.map((alimento) => (
                      <option key={alimento.id} value={alimento.id}>
                        {alimento.nombre_alimento} ({alimento.tipo})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    value={consumoData.fecha}
                    onChange={(e) => setConsumoData({ ...consumoData, fecha: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cantidad (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={consumoData.cantidad_kg}
                    onChange={(e) => setConsumoData({ ...consumoData, cantidad_kg: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Lote</label>
                  <input
                    type="text"
                    value={consumoData.lote}
                    onChange={(e) => setConsumoData({ ...consumoData, lote: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Observaciones</label>
                  <input
                    type="text"
                    value={consumoData.observaciones}
                    onChange={(e) => setConsumoData({ ...consumoData, observaciones: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg">
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setShowConsumoForm(false)}
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
                  <th className="px-4 py-3 text-left">Alimento</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-center">Cantidad (kg)</th>
                  <th className="px-4 py-3 text-left">Lote</th>
                </tr>
              </thead>
              <tbody>
                {consumos.map((consumo) => (
                  <tr key={consumo.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{consumo.codigo_arete}</td>
                    <td className="px-4 py-3">{consumo.nombre_alimento}</td>
                    <td className="px-4 py-3">{new Date(consumo.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center font-bold text-green-600">
                      {parseFloat(consumo.cantidad_kg).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">{consumo.lote || "-"}</td>
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

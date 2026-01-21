// src/components/PigList.jsx
/**
 * Tabla que muestra el listado de cerdos registrados.
 */
function PigList({ pigs, onToggleStatus }) {
  if (pigs.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
        <p className="text-gray-500">No hay cerdos registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Código Arete</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sexo</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Peso (kg)</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Nacimiento</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pigs.map((cerdo) => (
            <tr key={cerdo.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{cerdo.codigo_arete}</td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {cerdo.sexo === "M" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <i className="fas fa-mars mr-1"></i> Macho
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    <i className="fas fa-venus mr-1"></i> Hembra
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">{cerdo.peso_actual}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{cerdo.fecha_nacimiento}</td>
              <td className="px-4 py-3 text-sm">
                {cerdo.estado === "ACTIVO" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="fas fa-check-circle mr-1"></i> Activo
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    <i className="fas fa-times-circle mr-1"></i> Inactivo
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-sm">
                <button
                  type="button"
                  onClick={() => onToggleStatus(cerdo.id, cerdo.estado)}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  <i className="fas fa-sync-alt mr-1"></i>
                  Cambiar estado
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PigList;

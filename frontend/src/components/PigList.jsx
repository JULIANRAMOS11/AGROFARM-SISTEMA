// src/components/PigList.jsx — Tabla moderna de cerdos
function PigList({ pigs, onToggleStatus }) {
  if (pigs.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-paw"></i>
        <p>No hay cerdos registrados todavía.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl">
      <table className="table-modern">
        <thead>
          <tr>
            <th>Código Arete</th>
            <th>Sexo</th>
            <th>Peso (kg)</th>
            <th>Fecha Nacimiento</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pigs.map((cerdo) => (
            <tr key={cerdo.id}>
              <td className="font-semibold text-gray-900">{cerdo.codigo_arete}</td>
              <td>
                {cerdo.sexo === "M" ? (
                  <span className="badge bg-blue-50 text-blue-700 border border-blue-100">
                    <i className="fas fa-mars text-xs"></i> Macho
                  </span>
                ) : (
                  <span className="badge bg-pink-50 text-pink-700 border border-pink-100">
                    <i className="fas fa-venus text-xs"></i> Hembra
                  </span>
                )}
              </td>
              <td>{cerdo.peso_actual}</td>
              <td>{cerdo.fecha_nacimiento}</td>
              <td>
                {cerdo.estado === "ACTIVO" ? (
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <i className="fas fa-check-circle text-xs"></i> Activo
                  </span>
                ) : (
                  <span className="badge bg-gray-50 text-gray-600 border border-gray-200">
                    <i className="fas fa-times-circle text-xs"></i> Inactivo
                  </span>
                )}
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => onToggleStatus(cerdo.id, cerdo.estado)}
                  className="btn-primary !py-1.5 !px-3 !text-xs !shadow-none"
                >
                  <i className="fas fa-sync-alt text-[10px]"></i>
                  Cambiar
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

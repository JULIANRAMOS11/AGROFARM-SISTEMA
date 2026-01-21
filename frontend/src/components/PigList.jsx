// src/components/PigList.jsx
/**
 * Tabla que muestra el listado de cerdos registrados.
 */
function PigList({ pigs, onToggleStatus }) {
  if (pigs.length === 0) {
    return <p>No hay cerdos registrados todavía.</p>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Código Arete</th>
          <th>Sexo</th>
          <th>Peso Actual (kg)</th>
          <th>Fecha Nacimiento</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {pigs.map((cerdo) => (
          <tr key={cerdo.id}>
            <td>{cerdo.codigo_arete}</td>
            <td>{cerdo.sexo}</td>
            <td>{cerdo.peso_actual}</td>
            <td>{cerdo.fecha_nacimiento}</td>
            <td>{cerdo.estado}</td>
            <td>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => onToggleStatus(cerdo.id, cerdo.estado)}
              >
                Cambiar estado
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PigList;

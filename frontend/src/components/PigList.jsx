// src/components/PigList.jsx — Lista de cerdos Premium
export default function PigList({ pigs, onToggleStatus }) {
  if (!pigs || pigs.length === 0) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 flex items-center justify-center">
          <i className="fas fa-paw text-emerald-500 text-2xl"></i>
        </div>
        <p className="text-gray-500 font-medium">No hay cerdos registrados</p>
        <p className="text-sm text-gray-400 mt-1">Agrega un cerdo para empezar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Arete</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Raza</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Sexo</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Peso</th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {pigs.map(pig => (
            <tr key={pig.id} className="hover:bg-green-50/50 transition-colors duration-150">
              <td className="px-6 py-4 text-sm font-bold text-slate-800">{pig.codigo_arete}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{pig.nombre || <span className="text-gray-300">—</span>}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">{pig.raza}</span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${pig.sexo === "H" || pig.sexo === "Hembra" || pig.sexo === "F" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"}`}>
                  <i className={`fas ${pig.sexo === "H" || pig.sexo === "Hembra" || pig.sexo === "F" ? "fa-venus" : "fa-mars"} text-[10px]`}></i>
                  {pig.sexo === "H" || pig.sexo === "Hembra" || pig.sexo === "F" ? "Hembra" : "Macho"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{pig.peso_actual ? `${parseFloat(pig.peso_actual).toFixed(1)} kg` : "—"}</td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${pig.estado === "ACTIVO" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {pig.estado}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => onToggleStatus(pig.id, pig.estado)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${pig.estado === "ACTIVO"
                      ? "text-amber-600 hover:bg-amber-50 border border-amber-200"
                      : "text-green-600 hover:bg-green-50 border border-green-200"
                    }`}
                >
                  <i className={`fas ${pig.estado === "ACTIVO" ? "fa-pause" : "fa-play"} text-[10px]`}></i>
                  {pig.estado === "ACTIVO" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

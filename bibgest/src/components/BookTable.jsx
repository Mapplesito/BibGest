export function BookTable({ librosFiltrados, editarLibro, eliminarLibro }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>TÍTULO</th>
            <th>AUTOR</th>
            <th>ESTADO</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {librosFiltrados.map((libro) => (
            <tr key={libro.id}>
              <td className="book-title">{libro.titulo}</td>
              <td>{libro.autor}</td>
              <td>
                <span
                  className={`badge ${
                    libro.estado === "Disponible" ? "available" : "loaned"
                  }`}
                >
                  {libro.estado}
                </span>
              </td>
              <td className="actions-cell">
                <button
                  type="button"
                  className="edit-button"
                  onClick={() => editarLibro(libro)}
                >
                  Editar
                </button>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => eliminarLibro(libro)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {librosFiltrados.length === 0 && (
            <tr>
              <td colSpan="4" className="empty">
                No se encontraron libros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
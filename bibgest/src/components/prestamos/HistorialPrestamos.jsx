export function HistorialPrestamos({ prestamos, libros, lectores }) {
  const prestamosDevueltos = prestamos.filter(
    (prestamo) => prestamo.estado === "Devuelto"
  );

  function nombreLibro(id) {
    return libros.find((libro) => libro.id === id)?.titulo || "Libro no disponible";
  }

  function nombreDelLector(id) {
    return lectores.find((lector) => lector.id === id)?.nombre || "Lector no disponible";
  }

  return (
    <div className="table-wrapper" style={{ marginTop: "20px" }}>
      <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "#302e45" }}>
        📚 Historial de Préstamos Finalizados ({prestamosDevueltos.length})
      </h3>
      <table>
        <thead>
          <tr>
            <th>LIBRO</th>
            <th>LECTOR</th>
            <th>FECHA PRÉSTAMO</th>
            <th>FECHA LÍMITE</th>
            <th>DEVUELTO EL</th>
            <th>ESTADO</th>
          </tr>
        </thead>
        <tbody>
          {prestamosDevueltos.map((prestamo) => (
            <tr key={prestamo.id}>
              <td className="book-title">{nombreLibro(prestamo.libroId)}</td>
              <td>{nombreDelLector(prestamo.lectorId)}</td>
              <td>{prestamo.fechaPrestamo}</td>
              <td>{prestamo.fechaLimite}</td>
              <td>{prestamo.fechaDevolucionReal || "—"}</td>
              <td>
                <span className="badge available">{prestamo.estado}</span>
              </td>
            </tr>
          ))}
          {prestamosDevueltos.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">
                No hay registros en el historial de devoluciones.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
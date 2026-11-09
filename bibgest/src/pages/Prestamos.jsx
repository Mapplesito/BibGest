import { RegistrarPrestamo } from "../components/prestamos/RegistrarPrestamo";
import { RegistrarDevolucion } from "../components/prestamos/RegistrarDevolucion";
import { HistorialPrestamos } from "../components/prestamos/HistorialPrestamos";
import { fechaHoy } from "../utils/fechas";

export function Prestamos({
  mensaje,
  lectores,
  libros,
  prestamos,
  librosDisponibles,
  acciones,
}) {
  const {
    busquedaPrestamos,
    setBusquedaPrestamos,
    mostrarFormularioPrestamo,
    libroSeleccionado,
    setLibroSeleccionado,
    lectorSeleccionado,
    setLectorSeleccionado,
    fechaPrestamo,
    setFechaPrestamo,
    fechaLimite,
    setFechaLimite,
    prestamosFiltrados,
    abrirFormularioPrestamo,
    registrarPrestamo,
    registrarDevolucion,
    nombreLibro,
    nombreDelLector,
  } = acciones;

  return (
    <section className="catalog" id="prestamos">
      <div className="section-heading">
        <div>
          <h2>Préstamos y devoluciones</h2>
          <p>Registra préstamos y controla el retorno de los libros.</p>
        </div>

        <button className="primary-button" onClick={abrirFormularioPrestamo}>
          {mostrarFormularioPrestamo ? "Cancelar" : "+ Registrar préstamo"}
        </button>
      </div>

      {mostrarFormularioPrestamo && (
        <RegistrarPrestamo
          lectorSeleccionado={lectorSeleccionado}
          setLectorSeleccionado={setLectorSeleccionado}
          lectores={lectores}
          libroSeleccionado={libroSeleccionado}
          setLibroSeleccionado={setLibroSeleccionado}
          librosDisponibles={librosDisponibles}
          fechaPrestamo={fechaPrestamo}
          setFechaPrestamo={setFechaPrestamo}
          fechaLimite={fechaLimite}
          setFechaLimite={setFechaLimite}
          fechaHoy={fechaHoy}
          registrarPrestamo={registrarPrestamo}
        />
      )}

      {mensaje && (
        <p className="feedback" role="status">
          {mensaje}
        </p>
      )}

      <input
        className="search"
        type="search"
        placeholder="Buscar por libro, lector o estado..."
        value={busquedaPrestamos}
        onChange={(event) => setBusquedaPrestamos(event.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>LIBRO</th>
              <th>LECTOR</th>
              <th>FECHA PRÉSTAMO</th>
              <th>FECHA LÍMITE</th>
              <th>ESTADO</th>
              <th>ACCIÓN</th>
            </tr>
          </thead>

          <tbody>
            {prestamosFiltrados.map((prestamo) => (
              <tr key={prestamo.id}>
                <td className="book-title">{nombreLibro(prestamo.libroId)}</td>
                <td>{nombreDelLector(prestamo.lectorId)}</td>
                <td>{prestamo.fechaPrestamo}</td>
                <td>{prestamo.fechaLimite}</td>
                <td>
                  <span
                    className={`badge ${
                      prestamo.estado === "Activo" ? "loaned" : "available"
                    }`}
                  >
                    {prestamo.estado}
                  </span>
                </td>
                <td>
                  <RegistrarDevolucion
                    prestamo={prestamo}
                    registrarDevolucion={registrarDevolucion}
                  />
                </td>
              </tr>
            ))}

            {prestamosFiltrados.length === 0 && (
              <tr>
                <td colSpan="6" className="empty">
                  Todavía no hay préstamos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <HistorialPrestamos
        prestamos={prestamos}
        libros={libros}
        lectores={lectores}
      />
    </section>
  );
}

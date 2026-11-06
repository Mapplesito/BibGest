export function RegistrarPrestamo({
  lectorSeleccionado,
  setLectorSeleccionado,
  lectores,
  libroSeleccionado,
  setLibroSeleccionado,
  librosDisponibles,
  fechaPrestamo,
  setFechaPrestamo,
  fechaLimite,
  setFechaLimite,
  fechaHoy,
  registrarPrestamo
}) {
  return (
    <form className="book-form" onSubmit={registrarPrestamo}>
      <h3>Nuevo préstamo</h3>
      <label htmlFor="lectorSeleccionado">Lector</label>
      <select id="lectorSeleccionado" value={lectorSeleccionado} onChange={(e) => setLectorSeleccionado(e.target.value)} required>
        <option value="">Selecciona un lector</option>
        {lectores.map((lector) => <option key={lector.id} value={lector.id}>{lector.nombre} — {lector.documento}</option>)}
      </select>

      <label htmlFor="libroSeleccionado">Libro disponible</label>
      <select id="libroSeleccionado" value={libroSeleccionado} onChange={(e) => setLibroSeleccionado(e.target.value)} required>
        <option value="">Selecciona un libro</option>
        {librosDisponibles.map((libro) => <option key={libro.id} value={libro.id}>{libro.titulo} — {libro.autor}</option>)}
      </select>

      <label htmlFor="fechaPrestamo">Fecha del préstamo</label>
      <input id="fechaPrestamo" type="date" value={fechaPrestamo} max={fechaHoy()} onChange={(e) => setFechaPrestamo(e.target.value)} required />

      <label htmlFor="fechaLimite">Fecha prevista de devolución</label>
      <input id="fechaLimite" type="date" value={fechaLimite} min={fechaPrestamo || fechaHoy()} onChange={(e) => setFechaLimite(e.target.value)} required />

      {lectores.length === 0 && <p className="form-hint">Primero debes registrar al menos un lector en el menú Lectores.</p>}
      {librosDisponibles.length === 0 && <p className="form-hint">No hay libros disponibles para prestar.</p>}
      <button className="primary-button" type="submit" disabled={lectores.length === 0 || librosDisponibles.length === 0}>Guardar préstamo</button>
    </form>
  );
}

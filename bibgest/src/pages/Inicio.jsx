export function Inicio({
  libros,
  lectores,
  librosDisponibles,
  prestamosActivos,
  prestamosVencidos,
  irAPrestamos,
}) {
  return (
    <>
      <section className="welcome">
        <div>
          <p>BIENVENIDO A BIBGEST</p>
          <h2>Tu biblioteca, más organizada.</h2>
          <span>
            Administra libros, lectores y préstamos desde un solo lugar.
          </span>
        </div>

        <div className="book-illustration" aria-hidden="true">
          ▤
        </div>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span className="stat-icon purple">▤</span>
          <p>Total de libros</p>
          <strong>{libros.length}</strong>
          <small>Catálogo general</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon green">✓</span>
          <p>Disponibles</p>
          <strong>{librosDisponibles.length}</strong>
          <small>Listos para préstamo</small>
        </article>

        <article className="stat-card">
          <span className="stat-icon orange">⇄</span>
          <p>Préstamos activos</p>
          <strong>{prestamosActivos.length}</strong>
          <small>En poder de lectores</small>
        </article>

        <article
          className="stat-card"
          style={{
            borderColor: prestamosVencidos.length > 0 ? "#f2d4d4" : undefined,
          }}
        >
          <span
            className="stat-icon"
            style={{ background: "#fff0f0", color: "#c03939" }}
          >
            ⚠️
          </span>
          <p>Préstamos vencidos</p>
          <strong
            style={{
              color: prestamosVencidos.length > 0 ? "#c03939" : "inherit",
            }}
          >
            {prestamosVencidos.length}
          </strong>
          <small>Requieren atención</small>
        </article>
      </section>

      <section className="catalog">
        <div className="section-heading">
          <div>
            <h2>Resumen general de la biblioteca</h2>
            <p>Estado actual de operaciones y usuarios.</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          <p>
            📚 Libros totales registrados: <strong>{libros.length}</strong>
            {" "}(Disponibles: {librosDisponibles.length} | Prestados: {" "}
            {libros.length - librosDisponibles.length})
          </p>

          <p>
            👤 Lectores inscritos en el sistema: <strong>{lectores.length}</strong>
          </p>

          <p>
            🔄 Préstamos activos en curso: <strong>{prestamosActivos.length}</strong>
          </p>

          <p
            style={{
              color: prestamosVencidos.length > 0 ? "#c03939" : "inherit",
            }}
          >
            🚨 Alertas de devolución vencida: <strong>{prestamosVencidos.length}</strong>
          </p>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button className="primary-button" onClick={irAPrestamos}>
            Gestionar préstamos
          </button>
        </div>
      </section>
    </>
  );
}

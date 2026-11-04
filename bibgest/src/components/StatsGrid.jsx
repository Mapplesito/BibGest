export function StatsGrid({ totalLibros, disponibles }) {
  return (
    <section className="stats">
      <article className="stat-card">
        <span className="stat-icon purple">▤</span>
        <p>Total de libros</p>
        <strong>{totalLibros}</strong>
        <small>Libros registrados</small>
      </article>

      <article className="stat-card">
        <span className="stat-icon green">✓</span>
        <p>Disponibles</p>
        <strong>{disponibles}</strong>
        <small>Listos para préstamo</small>
      </article>

      <article className="stat-card">
        <span className="stat-icon orange">⇄</span>
        <p>Préstamos activos</p>
        <strong>{totalLibros - disponibles}</strong>
        <small>Libros prestados</small>
      </article>

      <article className="stat-card">
        <span className="stat-icon blue">♙</span>
        <p>Lectores</p>
        <strong>0</strong>
        <small>Usuarios registrados</small>
      </article>
    </section>
  );
}
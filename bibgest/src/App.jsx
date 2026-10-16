
import { useState } from "react";
import "./index.css";

const librosIniciales = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", estado: "Disponible" },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", estado: "Prestado" },
  { id: 3, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", estado: "Disponible" },
];

function App() {
  const [libros] = useState(librosIniciales);
  const [busqueda, setBusqueda] = useState("");

  const librosFiltrados = libros.filter((libro) =>
    `${libro.titulo} ${libro.autor}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const disponibles = libros.filter(
    (libro) => libro.estado === "Disponible"
  ).length;

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">Bib<span>Gest</span></h1>
        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav>
          <a className="nav-item active" href="#inicio">▦ <span>Inicio</span></a>
          <a className="nav-item" href="#libros">▤ <span>Libros</span></a>
          <a className="nav-item" href="#prestamos">⇄ <span>Préstamos</span></a>
          <a className="nav-item" href="#lectores">♙ <span>Lectores</span></a>
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">BG</span>
          <div>
            <strong>Administrador</strong>
            <small>Biblioteca</small>
          </div>
        </div>
      </aside>

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div>
            <p className="eyebrow">SISTEMA DE GESTIÓN</p>
            <h2>Panel principal</h2>
          </div>
          <span className="status"><span /> Sistema activo</span>
        </header>

        <section className="welcome">
          <div>
            <p>BIENVENIDO A BIBGEST</p>
            <h2>Tu biblioteca, más organizada.</h2>
            <span>Administra libros y controla los préstamos desde un solo lugar.</span>
          </div>
          <div className="book-illustration" aria-hidden="true">▤</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon purple">▤</span>
            <p>Total de libros</p>
            <strong>{libros.length}</strong>
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
            <strong>{libros.length - disponibles}</strong>
            <small>Libros prestados</small>
          </article>

          <article className="stat-card">
            <span className="stat-icon blue">♙</span>
            <p>Lectores</p>
            <strong>0</strong>
            <small>Usuarios registrados</small>
          </article>
        </section>

        <section className="catalog" id="libros">
          <div className="section-heading">
            <div>
              <h2>Catálogo de libros</h2>
              <p>Consulta los libros de la biblioteca.</p>
            </div>
            <span className="book-count">{librosFiltrados.length} libros</span>
          </div>

          <input
            className="search"
            type="search"
            placeholder="Buscar por título o autor..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>TÍTULO</th>
                  <th>AUTOR</th>
                  <th>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {librosFiltrados.map((libro) => (
                  <tr key={libro.id}>
                    <td className="book-title">{libro.titulo}</td>
                    <td>{libro.autor}</td>
                    <td>
                      <span className={`badge ${libro.estado === "Disponible" ? "available" : "loaned"}`}>
                        {libro.estado}
                      </span>
                    </td>
                  </tr>
                ))}
                {librosFiltrados.length === 0 && (
                  <tr>
                    <td colSpan="3" className="empty">
                      No se encontraron libros.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;

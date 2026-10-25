import { useEffect, useState } from "react";
import "./index.css";

const librosIniciales = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", estado: "Disponible" },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", estado: "Prestado" },
  { id: 3, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", estado: "Disponible" },
];

function App() {
  const [libros, setLibros] = useState(() => {
    const librosGuardados = localStorage.getItem("bibgest-libros");

    if (librosGuardados) {
      return JSON.parse(librosGuardados);
    }

    return librosIniciales;
  });

  useEffect(() => {
    localStorage.setItem("bibgest-libros", JSON.stringify(libros));
  }, [libros]);

  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [libroEditando, setLibroEditando] = useState(null);

  const librosFiltrados = libros.filter((libro) =>
    `${libro.titulo} ${libro.autor}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const disponibles = libros.filter(
    (libro) => libro.estado === "Disponible"
  ).length;

  function editarLibro(libro) {
    setLibroEditando(libro);
    setTitulo(libro.titulo);
    setAutor(libro.autor);
    setMensaje("");
    setMostrarFormulario(true);
  }

  function registrarLibro(event) {
    event.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      setMensaje("Completa el título y el autor.");
      return;
    }

    const nuevoLibro = {
      id: Date.now(),
      titulo: titulo.trim(),
      autor: autor.trim(),
      estado: "Disponible",
    };

    setLibros((librosActuales) => [...librosActuales, nuevoLibro]);
    setTitulo("");
    setAutor("");
    setMensaje("¡Libro registrado correctamente!");
    setMostrarFormulario(false);
  }

  // CORREGIDO: JavaScript encapsula eliminarLibro dentro de actualizarLibro, por lo que el botón del JSX no puede verla (causando el error de que no se lee).
  function eliminarLibro(libro) {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar "${libro.titulo}"?`
    );

    if (!confirmar) {
      return;
    }

    setLibros((librosActuales) =>
      librosActuales.filter((item) => item.id !== libro.id)
    );

    setMensaje(`Se eliminó "${libro.titulo}" correctamente.`);
  }

  function actualizarLibro(event) {
    event.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      setMensaje("Completa el título y el autor.");
      return;
    }

    setLibros((librosActuales) =>
      librosActuales.map((libro) =>
        libro.id === libroEditando.id
          ? {
              ...libro,
              titulo: titulo.trim(),
              autor: autor.trim(),
            }
          : libro
      )
    );

    setTitulo("");
    setAutor("");
    setLibroEditando(null);
    setMostrarFormulario(false);
    setMensaje("¡Libro actualizado correctamente!");
  }

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
              <p>Consulta y registra los libros de la biblioteca.</p>
            </div>

            <button
              className="primary-button"
              onClick={() => {
                setMensaje("");
                setLibroEditando(null);
                setTitulo("");
                setAutor("");
                setMostrarFormulario(!mostrarFormulario);
              }}
            >
              {mostrarFormulario ? "Cancelar" : "+ Agregar libro"}
            </button>
          </div>

          {mostrarFormulario && (
            <form className="book-form" 
            onSubmit={libroEditando ? actualizarLibro : registrarLibro}>
            <h3>{libroEditando ? "Editar libro" : "Registrar un libro"}</h3>

              <label htmlFor="titulo">Título del libro</label>
              <input
                id="titulo"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
                placeholder="Ej. El nombre del viento"
                maxLength={120}
                required
              />

              <label htmlFor="autor">Autor</label>
              <input
                id="autor"
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
                placeholder="Nombre del autor"
                maxLength={100}
                required
              />

              <button className="primary-button" type="submit">
                Guardar libro
              </button>
            </form>
          )}

          {mensaje && (
            <p className="feedback" role="status">{mensaje}</p>
          )}

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
        </section>

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;
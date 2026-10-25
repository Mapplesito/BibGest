
import { useEffect, useState } from "react";
import "./index.css";

const librosIniciales = [
  { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", estado: "Disponible" },
  { id: 2, titulo: "El principito", autor: "Antoine de Saint-Exupéry", estado: "Prestado" },
  { id: 3, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", estado: "Disponible" },
];

function cargarDatos(clave, datosIniciales) {
  try {
    const guardados = localStorage.getItem(clave);
    return guardados ? JSON.parse(guardados) : datosIniciales;
  } catch {
    return datosIniciales;
  }
}

function App() {
  const [libros, setLibros] = useState(() =>
    cargarDatos("bibgest-libros", librosIniciales)
  );
  const [lectores, setLectores] = useState(() =>
    cargarDatos("bibgest-lectores", [])
  );

  const [busqueda, setBusqueda] = useState("");
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);

  const [busquedaLector, setBusquedaLector] = useState("");
  const [nombreLector, setNombreLector] = useState("");
  const [documentoLector, setDocumentoLector] = useState("");
  const [correoLector, setCorreoLector] = useState("");
  const [mostrarFormularioLector, setMostrarFormularioLector] = useState(false);
  const [lectorEditando, setLectorEditando] = useState(null);

  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    localStorage.setItem("bibgest-libros", JSON.stringify(libros));
  }, [libros]);

  useEffect(() => {
    localStorage.setItem("bibgest-lectores", JSON.stringify(lectores));
  }, [lectores]);

  const librosFiltrados = libros.filter((libro) =>
    `${libro.titulo} ${libro.autor}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  const lectoresFiltrados = lectores.filter((lector) =>
    `${lector.nombre} ${lector.documento} ${lector.correo}`
      .toLowerCase()
      .includes(busquedaLector.toLowerCase())
  );

  const disponibles = libros.filter(
    (libro) => libro.estado === "Disponible"
  ).length;

  function cambiarSeccion(seccion) {
    setSeccionActiva(seccion);
    setMensaje("");
  }

  function limpiarFormularioLibro() {
    setTitulo("");
    setAutor("");
    setLibroEditando(null);
  }

  function registrarLibro(event) {
    event.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      setMensaje("Completa el título y el autor.");
      return;
    }

    setLibros((actuales) => [
      ...actuales,
      {
        id: Date.now(),
        titulo: titulo.trim(),
        autor: autor.trim(),
        estado: "Disponible",
      },
    ]);

    limpiarFormularioLibro();
    setMostrarFormulario(false);
    setMensaje("¡Libro registrado correctamente!");
  }

  function editarLibro(libro) {
    setLibroEditando(libro);
    setTitulo(libro.titulo);
    setAutor(libro.autor);
    setMensaje("");
    setMostrarFormulario(true);
  }

  function actualizarLibro(event) {
    event.preventDefault();

    if (!titulo.trim() || !autor.trim()) {
      setMensaje("Completa el título y el autor.");
      return;
    }

    setLibros((actuales) =>
      actuales.map((libro) =>
        libro.id === libroEditando.id
          ? { ...libro, titulo: titulo.trim(), autor: autor.trim() }
          : libro
      )
    );

    limpiarFormularioLibro();
    setMostrarFormulario(false);
    setMensaje("¡Libro actualizado correctamente!");
  }

  function eliminarLibro(libro) {
    if (!window.confirm(`¿Seguro que deseas eliminar "${libro.titulo}"?`)) {
      return;
    }

    setLibros((actuales) =>
      actuales.filter((item) => item.id !== libro.id)
    );

    if (libroEditando?.id === libro.id) {
      limpiarFormularioLibro();
      setMostrarFormulario(false);
    }

    setMensaje(`Se eliminó "${libro.titulo}" correctamente.`);
  }

  function limpiarFormularioLector() {
    setNombreLector("");
    setDocumentoLector("");
    setCorreoLector("");
    setLectorEditando(null);
  }

  function registrarLector(event) {
    event.preventDefault();

    const nombre = nombreLector.trim();
    const documento = documentoLector.trim();
    const correo = correoLector.trim();

    if (!nombre || !documento || !correo) {
      setMensaje("Completa todos los campos del lector.");
      return;
    }

    if (lectores.some((lector) => lector.documento === documento)) {
      setMensaje("Ya existe un lector con ese documento.");
      return;
    }

    setLectores((actuales) => [
      ...actuales,
      { id: Date.now(), nombre, documento, correo },
    ]);

    limpiarFormularioLector();
    setMostrarFormularioLector(false);
    setMensaje("¡Lector registrado correctamente!");
  }

  function editarLector(lector) {
    setLectorEditando(lector);
    setNombreLector(lector.nombre);
    setDocumentoLector(lector.documento);
    setCorreoLector(lector.correo);
    setMostrarFormularioLector(true);
    setMensaje("");
  }

  function actualizarLector(event) {
    event.preventDefault();

    const nombre = nombreLector.trim();
    const documento = documentoLector.trim();
    const correo = correoLector.trim();

    if (!nombre || !documento || !correo) {
      setMensaje("Completa todos los campos del lector.");
      return;
    }

    if (
      lectores.some(
        (lector) =>
          lector.documento === documento &&
          lector.id !== lectorEditando.id
      )
    ) {
      setMensaje("Otro lector ya tiene ese documento.");
      return;
    }

    setLectores((actuales) =>
      actuales.map((lector) =>
        lector.id === lectorEditando.id
          ? { ...lector, nombre, documento, correo }
          : lector
      )
    );

    limpiarFormularioLector();
    setMostrarFormularioLector(false);
    setMensaje("¡Lector actualizado correctamente!");
  }

  function eliminarLector(lector) {
    if (!window.confirm(`¿Seguro que deseas eliminar a "${lector.nombre}"?`)) {
      return;
    }

    setLectores((actuales) =>
      actuales.filter((item) => item.id !== lector.id)
    );

    if (lectorEditando?.id === lector.id) {
      limpiarFormularioLector();
      setMostrarFormularioLector(false);
    }

    setMensaje(`Se eliminó a "${lector.nombre}" correctamente.`);
  }

  const titulosSeccion = {
    inicio: "Panel principal",
    libros: "Catálogo de libros",
    lectores: "Gestión de lectores",
    prestamos: "Préstamos",
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">Bib<span>Gest</span></h1>
        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav>
          <a className={`nav-item ${seccionActiva === "inicio" ? "active" : ""}`}
            href="#inicio" onClick={() => cambiarSeccion("inicio")}>
            ▦ <span>Inicio</span>
          </a>
          <a className={`nav-item ${seccionActiva === "libros" ? "active" : ""}`}
            href="#libros" onClick={() => cambiarSeccion("libros")}>
            ▤ <span>Libros</span>
          </a>
          <a className={`nav-item ${seccionActiva === "prestamos" ? "active" : ""}`}
            href="#prestamos" onClick={() => cambiarSeccion("prestamos")}>
            ⇄ <span>Préstamos</span>
          </a>
          <a className={`nav-item ${seccionActiva === "lectores" ? "active" : ""}`}
            href="#lectores" onClick={() => cambiarSeccion("lectores")}>
            ♙ <span>Lectores</span>
          </a>
        </nav>

        <div className="sidebar-footer">
          <span className="avatar">BG</span>
          <div>
            <strong>Administrador</strong>
            <small>Biblioteca</small>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">SISTEMA DE GESTIÓN</p>
            <h2>{titulosSeccion[seccionActiva]}</h2>
          </div>
          <span className="status"><span /> Sistema activo</span>
        </header>

        {seccionActiva === "inicio" && (
          <>
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
                <strong>{lectores.length}</strong>
                <small>Usuarios registrados</small>
              </article>
            </section>
          </>
        )}

        {seccionActiva === "libros" && (
          <section className="catalog" id="libros">
            <div className="section-heading">
              <div>
                <h2>Catálogo de libros</h2>
                <p>Consulta y registra los libros de la biblioteca.</p>
              </div>
              <button className="primary-button" onClick={() => {
                if (mostrarFormulario) limpiarFormularioLibro();
                setMensaje("");
                setMostrarFormulario(!mostrarFormulario);
              }}>
                {mostrarFormulario ? "Cancelar" : "+ Agregar libro"}
              </button>
            </div>

            {mostrarFormulario && (
              <form className="book-form"
                onSubmit={libroEditando ? actualizarLibro : registrarLibro}>
                <h3>{libroEditando ? "Editar libro" : "Registrar un libro"}</h3>
                <label htmlFor="titulo">Título del libro</label>
                <input id="titulo" value={titulo}
                  onChange={(event) => setTitulo(event.target.value)}
                  placeholder="Ej. El nombre del viento" maxLength={120} required />
                <label htmlFor="autor">Autor</label>
                <input id="autor" value={autor}
                  onChange={(event) => setAutor(event.target.value)}
                  placeholder="Nombre del autor" maxLength={100} required />
                <button className="primary-button" type="submit">
                  {libroEditando ? "Guardar cambios" : "Guardar libro"}
                </button>
              </form>
            )}

            {mensaje && <p className="feedback" role="status">{mensaje}</p>}

            <input className="search" type="search"
              placeholder="Buscar por título o autor..." value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)} />

            <div className="table-wrapper">
              <table>
                <thead><tr><th>TÍTULO</th><th>AUTOR</th><th>ESTADO</th><th>ACCIONES</th></tr></thead>
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
                      <td className="actions-cell">
                        <button type="button" className="edit-button"
                          onClick={() => editarLibro(libro)}>Editar</button>
                        <button type="button" className="delete-button"
                          onClick={() => eliminarLibro(libro)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  {librosFiltrados.length === 0 && (
                    <tr><td colSpan="4" className="empty">No se encontraron libros.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seccionActiva === "lectores" && (
          <section className="catalog" id="lectores">
            <div className="section-heading">
              <div>
                <h2>Gestión de lectores</h2>
                <p>Registra y administra los usuarios de la biblioteca.</p>
              </div>
              <button className="primary-button" onClick={() => {
                if (mostrarFormularioLector) limpiarFormularioLector();
                setMensaje("");
                setMostrarFormularioLector(!mostrarFormularioLector);
              }}>
                {mostrarFormularioLector ? "Cancelar" : "+ Agregar lector"}
              </button>
            </div>

            {mostrarFormularioLector && (
              <form className="book-form"
                onSubmit={lectorEditando ? actualizarLector : registrarLector}>
                <h3>{lectorEditando ? "Editar lector" : "Registrar lector"}</h3>

                <label htmlFor="nombreLector">Nombre completo</label>
                <input id="nombreLector" value={nombreLector}
                  onChange={(event) => setNombreLector(event.target.value)}
                  placeholder="Nombre y apellidos" maxLength={120} required />

                <label htmlFor="documentoLector">Documento de identificación</label>
                <input id="documentoLector" value={documentoLector}
                  onChange={(event) => setDocumentoLector(event.target.value)}
                  placeholder="Número de documento" maxLength={30} required />

                <label htmlFor="correoLector">Correo electrónico</label>
                <input id="correoLector" type="email" value={correoLector}
                  onChange={(event) => setCorreoLector(event.target.value)}
                  placeholder="lector@ejemplo.com" maxLength={150} required />

                <button className="primary-button" type="submit">
                  {lectorEditando ? "Guardar cambios" : "Guardar lector"}
                </button>
              </form>
            )}

            {mensaje && <p className="feedback" role="status">{mensaje}</p>}

            <input className="search" type="search"
              placeholder="Buscar por nombre, documento o correo..."
              value={busquedaLector}
              onChange={(event) => setBusquedaLector(event.target.value)} />

            <div className="table-wrapper">
              <table>
                <thead><tr><th>NOMBRE</th><th>DOCUMENTO</th><th>CORREO</th><th>ACCIONES</th></tr></thead>
                <tbody>
                  {lectoresFiltrados.map((lector) => (
                    <tr key={lector.id}>
                      <td className="book-title">{lector.nombre}</td>
                      <td>{lector.documento}</td>
                      <td>{lector.correo}</td>
                      <td className="actions-cell">
                        <button type="button" className="edit-button"
                          onClick={() => editarLector(lector)}>Editar</button>
                        <button type="button" className="delete-button"
                          onClick={() => eliminarLector(lector)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                  {lectoresFiltrados.length === 0 && (
                    <tr><td colSpan="4" className="empty">
                      {busquedaLector ? "No se encontraron lectores." : "Todavía no hay lectores registrados."}
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {seccionActiva === "prestamos" && (
          <section className="catalog">
            <div className="section-heading">
              <div>
                <h2>Préstamos y devoluciones</h2>
                <p>En esta sección construiremos el registro de préstamos de libros a lectores.</p>
              </div>
            </div>
            <p>Este módulo todavía está en desarrollo.</p>
          </section>
        )}

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;

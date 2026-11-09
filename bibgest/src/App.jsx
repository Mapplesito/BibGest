import { useEffect, useState } from "react";
import "./styles/index.css";

// Servicio de conexión con el backend
import {
  probarConexionBackend,
  obtenerLibros,
  crearLibro,
  actualizarLibro,
  eliminarLibroAPI,
} from "./services/api";

// Importaciones de Libros
import { AgregarLibro } from "./components/libros/AgregarLibro";
import { EditarLibro } from "./components/libros/EditarLibro";
import { EliminarLibro } from "./components/libros/EliminarLibro";

// Importaciones de Lectores
import { AgregarLector } from "./components/lectores/AgregarLector";
import { EditarLector } from "./components/lectores/EditarLector";
import { EliminarLector } from "./components/lectores/EliminarLector";

// Importaciones de Préstamos
import { RegistrarPrestamo } from "./components/prestamos/RegistrarPrestamo";
import { RegistrarDevolucion } from "./components/prestamos/RegistrarDevolucion";
import { HistorialPrestamos } from "./components/prestamos/HistorialPrestamos";

const fechaHoy = () => new Date().toLocaleDateString("en-CA");

function leerDatos(clave, inicial) {
  try {
    const guardado = localStorage.getItem(clave);
    return guardado ? JSON.parse(guardado) : inicial;
  } catch {
    return inicial;
  }
}

function App() {
  // Los libros ahora se consultan desde PostgreSQL.
  const [libros, setLibros] = useState([]);

  // Los lectores y préstamos siguen usando localStorage temporalmente.
  const [lectores, setLectores] = useState(() =>
    leerDatos("bibgest-lectores", [])
  );

  const [prestamos, setPrestamos] = useState(() =>
    leerDatos("bibgest-prestamos", [])
  );

  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [busquedaLibros, setBusquedaLibros] = useState("");
  const [busquedaLectores, setBusquedaLectores] = useState("");
  const [busquedaPrestamos, setBusquedaPrestamos] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estado de conexión con el backend.
  const [estadoBackend, setEstadoBackend] = useState(
    "Conectando con el backend..."
  );

  const [backendConectado, setBackendConectado] = useState(false);

  // Estados del formulario de libros.
  const [mostrarFormularioLibro, setMostrarFormularioLibro] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  // Estados del formulario de lectores.
  const [mostrarFormularioLector, setMostrarFormularioLector] = useState(false);
  const [lectorEditando, setLectorEditando] = useState(null);
  const [nombreLector, setNombreLector] = useState("");
  const [documentoLector, setDocumentoLector] = useState("");
  const [correoLector, setCorreoLector] = useState("");

  // Estados del formulario de préstamos.
  const [mostrarFormularioPrestamo, setMostrarFormularioPrestamo] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [lectorSeleccionado, setLectorSeleccionado] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState(fechaHoy());
  const [fechaLimite, setFechaLimite] = useState("");

  // ==========================================
  // CONEXIÓN CON EL BACKEND Y POSTGRESQL
  // ==========================================

  useEffect(() => {
    let componenteActivo = true;

    async function conectarYConsultarLibros() {
      try {
        // Comprobar conexión con el backend.
        await probarConexionBackend();

        // Consultar los libros almacenados en PostgreSQL.
        const librosBD = await obtenerLibros();

        if (componenteActivo) {
          setLibros(librosBD);
          setBackendConectado(true);
          setEstadoBackend("Backend conectado");
        }
      } catch (error) {
        console.error(
          "No fue posible conectar o consultar los libros:",
          error
        );

        if (componenteActivo) {
          setBackendConectado(false);
          setEstadoBackend("Backend desconectado");
        }
      }
    }

    conectarYConsultarLibros();

    return () => {
      componenteActivo = false;
    };
  }, []);

  // ==========================================
  // GUARDADO TEMPORAL DE LECTORES Y PRÉSTAMOS
  // ==========================================

  useEffect(() => {
    localStorage.setItem("bibgest-lectores", JSON.stringify(lectores));
  }, [lectores]);

  useEffect(() => {
    localStorage.setItem("bibgest-prestamos", JSON.stringify(prestamos));
  }, [prestamos]);

  // ==========================================
  // FILTROS Y ESTADÍSTICAS
  // ==========================================

  const prestamosActivos = prestamos.filter(
    (prestamo) => prestamo.estado === "Activo"
  );

  const prestamosVencidos = prestamos.filter((prestamo) => {
    if (prestamo.estado !== "Activo") return false;
    return prestamo.fechaLimite < fechaHoy();
  });

  const librosDisponibles = libros.filter(
    (libro) => libro.estado === "Disponible"
  );

  const librosFiltrados = libros.filter((libro) =>
    `${libro.titulo} ${libro.autor}`
      .toLowerCase()
      .includes(busquedaLibros.toLowerCase())
  );

  const lectoresFiltrados = lectores.filter((lector) =>
    `${lector.nombre} ${lector.documento} ${lector.correo}`
      .toLowerCase()
      .includes(busquedaLectores.toLowerCase())
  );

  const prestamosFiltrados = prestamos.filter((prestamo) => {
    const libro = libros.find(
      (item) => Number(item.id) === Number(prestamo.libroId)
    );

    const lector = lectores.find(
      (item) => Number(item.id) === Number(prestamo.lectorId)
    );

    const texto = `${libro?.titulo || ""} ${lector?.nombre || ""} ${
      lector?.documento || ""
    } ${prestamo.estado}`.toLowerCase();

    return texto.includes(busquedaPrestamos.toLowerCase());
  });

  // ==========================================
  // NAVEGACIÓN
  // ==========================================

  function cambiarSeccion(seccion) {
    setSeccionActiva(seccion);
    setMensaje("");
  }

  // ==========================================
  // CRUD DE LIBROS - POSTGRESQL
  // ==========================================

  function editarLibro(libro) {
    setLibroEditando(libro);
    setTitulo(libro.titulo);
    setAutor(libro.autor);
    setMostrarFormularioLibro(true);
    setMensaje("");
  }

  async function guardarLibro(event) {
    event.preventDefault();

    const tituloLimpio = titulo.trim();
    const autorLimpio = autor.trim();

    if (!tituloLimpio || !autorLimpio) {
      setMensaje("Completa el título y el autor.");
      return;
    }

    const libroExiste = libros.some(
      (item) =>
        item.titulo.toLowerCase() === tituloLimpio.toLowerCase() &&
        item.autor.toLowerCase() === autorLimpio.toLowerCase() &&
        Number(item.id) !== Number(libroEditando?.id)
    );

    if (libroExiste) {
      setMensaje("Ya existe un libro registrado con ese título y autor.");
      return;
    }

    try {
      if (libroEditando) {
        // Actualizar libro en PostgreSQL.
        const respuesta = await actualizarLibro(libroEditando.id, {
          titulo: tituloLimpio,
          autor: autorLimpio,
        });

        setLibros((actuales) =>
          actuales.map((libro) =>
            Number(libro.id) === Number(libroEditando.id)
              ? respuesta.libro
              : libro
          )
        );

        setMensaje("Libro actualizado correctamente en PostgreSQL.");
      } else {
        // Registrar libro en PostgreSQL.
        const respuesta = await crearLibro({
          titulo: tituloLimpio,
          autor: autorLimpio,
        });

        setLibros((actuales) => [...actuales, respuesta.libro]);

        setMensaje("Libro registrado correctamente en PostgreSQL.");
      }

      setTitulo("");
      setAutor("");
      setLibroEditando(null);
      setMostrarFormularioLibro(false);
    } catch (error) {
      console.error("Error al guardar el libro:", error);
      setMensaje(error.message || "No fue posible guardar el libro.");
    }
  }

  async function eliminarLibro(libro) {
    const tienePrestamoActivo = prestamosActivos.some(
      (prestamo) =>
        Number(prestamo.libroId) === Number(libro.id)
    );

    if (tienePrestamoActivo) {
      setMensaje(
        "No puedes eliminar un libro que tiene un préstamo activo."
      );
      return;
    }

    if (
      !window.confirm(
        `¿Seguro que deseas eliminar "${libro.titulo}"?`
      )
    ) {
      return;
    }

    try {
      // Eliminar el libro de PostgreSQL.
      await eliminarLibroAPI(libro.id);

      // Actualizar la lista en React.
      setLibros((actuales) =>
        actuales.filter(
          (item) => Number(item.id) !== Number(libro.id)
        )
      );

      setMensaje("Libro eliminado correctamente de PostgreSQL.");
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      setMensaje(error.message || "No fue posible eliminar el libro.");
    }
  }

  // ==========================================
  // CRUD DE LECTORES - LOCALSTORAGE TEMPORAL
  // ==========================================

  function guardarLector(event) {
    event.preventDefault();

    if (
      !nombreLector.trim() ||
      !documentoLector.trim() ||
      !correoLector.trim()
    ) {
      setMensaje("Completa todos los datos del lector.");
      return;
    }

    const documentoExiste = lectores.some(
      (lector) =>
        lector.documento.trim().toLowerCase() ===
          documentoLector.trim().toLowerCase() &&
        lector.id !== lectorEditando?.id
    );

    if (documentoExiste) {
      setMensaje("Ya existe un lector con ese documento.");
      return;
    }

    if (lectorEditando) {
      setLectores((actuales) =>
        actuales.map((lector) =>
          lector.id === lectorEditando.id
            ? {
                ...lector,
                nombre: nombreLector.trim(),
                documento: documentoLector.trim(),
                correo: correoLector.trim(),
              }
            : lector
        )
      );

      setMensaje("Lector actualizado correctamente.");
    } else {
      setLectores((actuales) => [
        ...actuales,
        {
          id: Date.now(),
          nombre: nombreLector.trim(),
          documento: documentoLector.trim(),
          correo: correoLector.trim(),
        },
      ]);

      setMensaje("Lector registrado correctamente.");
    }

    setNombreLector("");
    setDocumentoLector("");
    setCorreoLector("");
    setLectorEditando(null);
    setMostrarFormularioLector(false);
  }

  function editarLector(lector) {
    setLectorEditando(lector);
    setNombreLector(lector.nombre);
    setDocumentoLector(lector.documento);
    setCorreoLector(lector.correo);
    setMostrarFormularioLector(true);
    setMensaje("");
  }

  function eliminarLector(lector) {
    const tienePrestamoActivo = prestamosActivos.some(
      (prestamo) => prestamo.lectorId === lector.id
    );

    if (tienePrestamoActivo) {
      setMensaje(
        "No puedes eliminar un lector que tiene préstamos activos."
      );
      return;
    }

    if (
      !window.confirm(
        `¿Seguro que deseas eliminar a "${lector.nombre}"?`
      )
    ) {
      return;
    }

    setLectores((actuales) =>
      actuales.filter((item) => item.id !== lector.id)
    );

    setMensaje("Lector eliminado correctamente.");
  }

  // ==========================================
  // PRÉSTAMOS - LOCALSTORAGE TEMPORAL
  // ==========================================

  function registrarPrestamo(event) {
    event.preventDefault();

    const libroId = Number(libroSeleccionado);
    const lectorId = Number(lectorSeleccionado);

    const libro = libros.find(
      (item) => Number(item.id) === libroId
    );

    if (!libro || libro.estado !== "Disponible") {
      setMensaje("El libro seleccionado ya no está disponible.");
      return;
    }

    if (
      !lectores.some((lector) => Number(lector.id) === lectorId)
    ) {
      setMensaje("Selecciona un lector registrado.");
      return;
    }

    const lectorTienePrestamoActivo = prestamos.some(
      (prestamo) =>
        Number(prestamo.lectorId) === lectorId &&
        prestamo.estado === "Activo"
    );

    if (lectorTienePrestamoActivo) {
      setMensaje(
        "Este lector ya tiene un préstamo activo. Debe devolverlo antes de solicitar otro."
      );
      return;
    }

    if (
      !fechaPrestamo ||
      !fechaLimite ||
      fechaLimite < fechaPrestamo
    ) {
      setMensaje(
        "La fecha prevista de devolución debe ser igual o posterior al préstamo."
      );
      return;
    }

    const nuevoPrestamo = {
      id: Date.now(),
      libroId,
      lectorId,
      fechaPrestamo,
      fechaLimite,
      fechaDevolucionReal: null,
      estado: "Activo",
    };

    setPrestamos((actuales) => [
      ...actuales,
      nuevoPrestamo,
    ]);

    // Por ahora el estado del libro se actualiza en React.
    // La sincronización de préstamos con PostgreSQL vendrá después.
    setLibros((actuales) =>
      actuales.map((item) =>
        Number(item.id) === libroId
          ? { ...item, estado: "Prestado" }
          : item
      )
    );

    setLibroSeleccionado("");
    setLectorSeleccionado("");
    setFechaPrestamo(fechaHoy());
    setFechaLimite("");
    setMostrarFormularioPrestamo(false);

    setMensaje("Préstamo registrado correctamente.");
  }

  function registrarDevolucion(prestamo) {
    if (prestamo.estado !== "Activo") {
      return;
    }

    const confirmar = window.confirm(
      "¿Confirmas que el libro fue devuelto?"
    );

    if (!confirmar) {
      return;
    }

    setPrestamos((actuales) =>
      actuales.map((item) =>
        item.id === prestamo.id
          ? {
              ...item,
              estado: "Devuelto",
              fechaDevolucionReal: fechaHoy(),
            }
          : item
      )
    );

    setLibros((actuales) =>
      actuales.map((libro) =>
        Number(libro.id) === Number(prestamo.libroId)
          ? { ...libro, estado: "Disponible" }
          : libro
      )
    );

    setMensaje(
      "Devolución registrada. El libro está disponible nuevamente."
    );
  }

  // ==========================================
  // FUNCIONES AUXILIARES
  // ==========================================

  function nombreLibro(id) {
    return (
      libros.find(
        (libro) => Number(libro.id) === Number(id)
      )?.titulo || "Libro no disponible"
    );
  }

  function nombreDelLector(id) {
    return (
      lectores.find(
        (lector) => Number(lector.id) === Number(id)
      )?.nombre || "Lector no disponible"
    );
  }

  // ==========================================
  // INTERFAZ
  // ==========================================

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="logo">
          Bib<span>Gest</span>
        </h1>

        <p className="menu-label">MENÚ PRINCIPAL</p>

        <nav>
          <a
            className={`nav-item ${
              seccionActiva === "inicio" ? "active" : ""
            }`}
            href="#inicio"
            onClick={() => cambiarSeccion("inicio")}
          >
            ▦ <span>Inicio</span>
          </a>

          <a
            className={`nav-item ${
              seccionActiva === "libros" ? "active" : ""
            }`}
            href="#libros"
            onClick={() => cambiarSeccion("libros")}
          >
            ▤ <span>Libros</span>
          </a>

          <a
            className={`nav-item ${
              seccionActiva === "prestamos" ? "active" : ""
            }`}
            href="#prestamos"
            onClick={() => cambiarSeccion("prestamos")}
          >
            ⇄ <span>Préstamos</span>
          </a>

          <a
            className={`nav-item ${
              seccionActiva === "lectores" ? "active" : ""
            }`}
            href="#lectores"
            onClick={() => cambiarSeccion("lectores")}
          >
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

      <main className="main-content" id="inicio">
        <header className="topbar">
          <div>
            <p className="eyebrow">SISTEMA DE GESTIÓN</p>

            <h2>
              {seccionActiva === "inicio"
                ? "Panel principal"
                : seccionActiva === "libros"
                ? "Gestión de libros"
                : seccionActiva === "lectores"
                ? "Gestión de lectores"
                : "Préstamos y devoluciones"}
            </h2>
          </div>

          <span className="status">
            <span
              style={{
                background: backendConectado
                  ? "#38bc83"
                  : "#d97706",
              }}
            />

            {estadoBackend}
          </span>
        </header>

        {/* ======================================
            INICIO
        ====================================== */}

        {seccionActiva === "inicio" && (
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
                  borderColor:
                    prestamosVencidos.length > 0
                      ? "#f2d4d4"
                      : undefined,
                }}
              >
                <span
                  className="stat-icon"
                  style={{
                    background: "#fff0f0",
                    color: "#c03939",
                  }}
                >
                  ⚠️
                </span>

                <p>Préstamos vencidos</p>

                <strong
                  style={{
                    color:
                      prestamosVencidos.length > 0
                        ? "#c03939"
                        : "inherit",
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
                  📚 Libros totales registrados:{" "}
                  <strong>{libros.length}</strong> (Disponibles:{" "}
                  {librosDisponibles.length} | Prestados:{" "}
                  {libros.length - librosDisponibles.length})
                </p>

                <p>
                  👤 Lectores inscritos en el sistema:{" "}
                  <strong>{lectores.length}</strong>
                </p>

                <p>
                  🔄 Préstamos activos en curso:{" "}
                  <strong>{prestamosActivos.length}</strong>
                </p>

                <p
                  style={{
                    color:
                      prestamosVencidos.length > 0
                        ? "#c03939"
                        : "inherit",
                  }}
                >
                  🚨 Alertas de devolución vencida:{" "}
                  <strong>{prestamosVencidos.length}</strong>
                </p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <button
                  className="primary-button"
                  onClick={() => cambiarSeccion("prestamos")}
                >
                  Gestionar préstamos
                </button>
              </div>
            </section>
          </>
        )}

        {/* ======================================
            LIBROS
        ====================================== */}

        {seccionActiva === "libros" && (
          <section className="catalog" id="libros">
            <div className="section-heading">
              <div>
                <h2>Catálogo de libros</h2>
                <p>
                  Consulta y registra los libros de la biblioteca.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setLibroEditando(null);
                  setTitulo("");
                  setAutor("");
                  setMensaje("");

                  setMostrarFormularioLibro(
                    !mostrarFormularioLibro
                  );
                }}
              >
                {mostrarFormularioLibro
                  ? "Cancelar"
                  : "+ Agregar libro"}
              </button>
            </div>

            {mostrarFormularioLibro &&
              (libroEditando ? (
                <EditarLibro
                  titulo={titulo}
                  setTitulo={setTitulo}
                  autor={autor}
                  setAutor={setAutor}
                  guardarLibro={guardarLibro}
                />
              ) : (
                <AgregarLibro
                  titulo={titulo}
                  setTitulo={setTitulo}
                  autor={autor}
                  setAutor={setAutor}
                  guardarLibro={guardarLibro}
                />
              ))}

            {mensaje && (
              <p className="feedback" role="status">
                {mensaje}
              </p>
            )}

            <input
              className="search"
              type="search"
              placeholder="Buscar por título o autor..."
              value={busquedaLibros}
              onChange={(event) =>
                setBusquedaLibros(event.target.value)
              }
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
                      <td className="book-title">
                        {libro.titulo}
                      </td>

                      <td>{libro.autor}</td>

                      <td>
                        <span
                          className={`badge ${
                            libro.estado === "Disponible"
                              ? "available"
                              : "loaned"
                          }`}
                        >
                          {libro.estado}
                        </span>
                      </td>

                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => editarLibro(libro)}
                        >
                          Editar
                        </button>

                        <EliminarLibro
                          libro={libro}
                          eliminarLibro={eliminarLibro}
                        />
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
        )}

        {/* ======================================
            LECTORES
        ====================================== */}

        {seccionActiva === "lectores" && (
          <section className="catalog" id="lectores">
            <div className="section-heading">
              <div>
                <h2>Registro de lectores</h2>
                <p>
                  Administra las personas que pueden pedir libros prestados.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setLectorEditando(null);
                  setNombreLector("");
                  setDocumentoLector("");
                  setCorreoLector("");
                  setMensaje("");

                  setMostrarFormularioLector(
                    !mostrarFormularioLector
                  );
                }}
              >
                {mostrarFormularioLector
                  ? "Cancelar"
                  : "+ Agregar lector"}
              </button>
            </div>

            {mostrarFormularioLector &&
              (lectorEditando ? (
                <EditarLector
                  nombreLector={nombreLector}
                  setNombreLector={setNombreLector}
                  documentoLector={documentoLector}
                  setDocumentoLector={setDocumentoLector}
                  correoLector={correoLector}
                  setCorreoLector={setCorreoLector}
                  guardarLector={guardarLector}
                />
              ) : (
                <AgregarLector
                  nombreLector={nombreLector}
                  setNombreLector={setNombreLector}
                  documentoLector={documentoLector}
                  setDocumentoLector={setDocumentoLector}
                  correoLector={correoLector}
                  setCorreoLector={setCorreoLector}
                  guardarLector={guardarLector}
                />
              ))}

            {mensaje && (
              <p className="feedback" role="status">
                {mensaje}
              </p>
            )}

            <input
              className="search"
              type="search"
              placeholder="Buscar por nombre, documento o correo..."
              value={busquedaLectores}
              onChange={(event) =>
                setBusquedaLectores(event.target.value)
              }
            />

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>NOMBRE</th>
                    <th>DOCUMENTO</th>
                    <th>CORREO</th>
                    <th>ACCIONES</th>
                  </tr>
                </thead>

                <tbody>
                  {lectoresFiltrados.map((lector) => (
                    <tr key={lector.id}>
                      <td className="book-title">
                        {lector.nombre}
                      </td>

                      <td>{lector.documento}</td>
                      <td>{lector.correo}</td>

                      <td className="actions-cell">
                        <button
                          className="edit-button"
                          onClick={() => editarLector(lector)}
                        >
                          Editar
                        </button>

                        <EliminarLector
                          lector={lector}
                          eliminarLector={eliminarLector}
                        />
                      </td>
                    </tr>
                  ))}

                  {lectoresFiltrados.length === 0 && (
                    <tr>
                      <td colSpan="4" className="empty">
                        No hay lectores registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ======================================
            PRÉSTAMOS
        ====================================== */}

        {seccionActiva === "prestamos" && (
          <section className="catalog" id="prestamos">
            <div className="section-heading">
              <div>
                <h2>Préstamos y devoluciones</h2>
                <p>
                  Registra préstamos y controla el retorno de los libros.
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  setMensaje("");
                  setLibroSeleccionado("");
                  setLectorSeleccionado("");
                  setFechaPrestamo(fechaHoy());
                  setFechaLimite("");

                  setMostrarFormularioPrestamo(
                    !mostrarFormularioPrestamo
                  );
                }}
              >
                {mostrarFormularioPrestamo
                  ? "Cancelar"
                  : "+ Registrar préstamo"}
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
              onChange={(event) =>
                setBusquedaPrestamos(event.target.value)
              }
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
                      <td className="book-title">
                        {nombreLibro(prestamo.libroId)}
                      </td>

                      <td>
                        {nombreDelLector(prestamo.lectorId)}
                      </td>

                      <td>{prestamo.fechaPrestamo}</td>
                      <td>{prestamo.fechaLimite}</td>

                      <td>
                        <span
                          className={`badge ${
                            prestamo.estado === "Activo"
                              ? "loaned"
                              : "available"
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

            {/* Historial de préstamos finalizados */}
            <HistorialPrestamos
              prestamos={prestamos}
              libros={libros}
              lectores={lectores}
            />
          </section>
        )}

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;
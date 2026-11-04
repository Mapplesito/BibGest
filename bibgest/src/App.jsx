import { useEffect, useState } from "react";
import "./styles/index.css";
import { Sidebar } from "./components/Sidebar";
import { Topbar } from "./components/Topbar";
import { WelcomeBanner } from "./components/WelcomeBanner";
import { StatsGrid } from "./components/StatsGrid";
import { BookForm } from "./components/BookForm";
import { SearchBar } from "./components/SearchBar";
import { BookTable } from "./components/BookTable";

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
      <Sidebar />

      <main className="main-content" id="inicio">
        <Topbar />
        <WelcomeBanner />
        <StatsGrid totalLibros={libros.length} disponibles={disponibles} />
        
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
            <BookForm
              libroEditando={libroEditando}
              titulo={titulo}
              setTitulo={setTitulo}
              autor={autor}
              setAutor={setAutor}
              onSubmit={libroEditando ? actualizarLibro : registrarLibro}
            />
          )}

          {mensaje && (
            <p className="feedback" role="status">{mensaje}</p>
          )}

          <SearchBar busqueda={busqueda} setBusqueda={setBusqueda} />

          <BookTable
            librosFiltrados={librosFiltrados}
            editarLibro={editarLibro}
            eliminarLibro={eliminarLibro}
          />
        </section>

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;

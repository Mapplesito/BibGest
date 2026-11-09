import { useState } from "react";
import "./styles/index.css";

import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { Inicio } from "./pages/Inicio";
import { Libros } from "./pages/Libros";
import { Lectores } from "./pages/Lectores";
import { Prestamos } from "./pages/Prestamos";

import { useBibliotecaData } from "./hooks/useBibliotecaData";
import { useLibros } from "./hooks/useLibros";
import { useLectores } from "./hooks/useLectores";
import { usePrestamos } from "./hooks/usePrestamos";

function App() {
  const [seccionActiva, setSeccionActiva] = useState("inicio");
  const [mensaje, setMensaje] = useState("");

  const {
    libros,
    setLibros,
    lectores,
    setLectores,
    prestamos,
    setPrestamos,
    estadoBackend,
    backendConectado,
  } = useBibliotecaData();

  const accionesLibros = useLibros({
    libros,
    setLibros,
    prestamos,
    setMensaje,
  });

  const accionesLectores = useLectores({
    lectores,
    setLectores,
    prestamos,
    setMensaje,
  });

  const accionesPrestamos = usePrestamos({
    libros,
    setLibros,
    lectores,
    prestamos,
    setPrestamos,
    setMensaje,
  });

  function cambiarSeccion(seccion) {
    setSeccionActiva(seccion);
    setMensaje("");
  }

  return (
    <div className="app">
      <Sidebar
        seccionActiva={seccionActiva}
        cambiarSeccion={cambiarSeccion}
      />

      <main className="main-content" id="inicio">
        <Topbar
          seccionActiva={seccionActiva}
          backendConectado={backendConectado}
          estadoBackend={estadoBackend}
        />

        {seccionActiva === "inicio" && (
          <Inicio
            libros={libros}
            lectores={lectores}
            librosDisponibles={accionesLibros.librosDisponibles}
            prestamosActivos={accionesPrestamos.prestamosActivos}
            prestamosVencidos={accionesPrestamos.prestamosVencidos}
            irAPrestamos={() => cambiarSeccion("prestamos")}
          />
        )}

        {seccionActiva === "libros" && (
          <Libros mensaje={mensaje} acciones={accionesLibros} />
        )}

        {seccionActiva === "lectores" && (
          <Lectores mensaje={mensaje} acciones={accionesLectores} />
        )}

        {seccionActiva === "prestamos" && (
          <Prestamos
            mensaje={mensaje}
            lectores={lectores}
            libros={libros}
            prestamos={prestamos}
            librosDisponibles={accionesLibros.librosDisponibles}
            acciones={accionesPrestamos}
          />
        )}

        <footer>© 2026 BibGest · Proyecto Integrador</footer>
      </main>
    </div>
  );
}

export default App;

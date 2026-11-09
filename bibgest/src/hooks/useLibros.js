import { useState } from "react";
import {
  crearLibro,
  actualizarLibro,
  eliminarLibroAPI,
} from "../services/api";

export function useLibros({ libros, setLibros, prestamos, setMensaje }) {
  const [busquedaLibros, setBusquedaLibros] = useState("");
  const [mostrarFormularioLibro, setMostrarFormularioLibro] = useState(false);
  const [libroEditando, setLibroEditando] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");

  const librosDisponibles = libros.filter(
    (libro) => libro.estado === "Disponible"
  );

  const librosFiltrados = libros.filter((libro) =>
    `${libro.titulo} ${libro.autor}`
      .toLowerCase()
      .includes(busquedaLibros.toLowerCase())
  );

  function abrirFormularioLibro() {
    setLibroEditando(null);
    setTitulo("");
    setAutor("");
    setMensaje("");
    setMostrarFormularioLibro((actual) => !actual);
  }

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
    const tieneHistorialPrestamos = prestamos.some(
      (prestamo) => Number(prestamo.libroId) === Number(libro.id)
    );

    if (tieneHistorialPrestamos) {
      setMensaje(
        "No puedes eliminar un libro que tiene préstamos registrados en su historial."
      );
      return;
    }

    if (!window.confirm(`¿Seguro que deseas eliminar "${libro.titulo}"?`)) {
      return;
    }

    try {
      await eliminarLibroAPI(libro.id);

      setLibros((actuales) =>
        actuales.filter((item) => Number(item.id) !== Number(libro.id))
      );

      setMensaje("Libro eliminado correctamente de PostgreSQL.");
    } catch (error) {
      console.error("Error al eliminar el libro:", error);
      setMensaje(error.message || "No fue posible eliminar el libro.");
    }
  }

  return {
    busquedaLibros,
    setBusquedaLibros,
    mostrarFormularioLibro,
    setMostrarFormularioLibro,
    libroEditando,
    titulo,
    setTitulo,
    autor,
    setAutor,
    librosDisponibles,
    librosFiltrados,
    abrirFormularioLibro,
    editarLibro,
    guardarLibro,
    eliminarLibro,
  };
}

import { useState } from "react";
import { crearPrestamo, registrarDevolucionAPI } from "../services/api";
import { fechaHoy } from "../utils/fechas";

export function usePrestamos({
  libros,
  setLibros,
  lectores,
  prestamos,
  setPrestamos,
  setMensaje,
}) {
  const [busquedaPrestamos, setBusquedaPrestamos] = useState("");
  const [mostrarFormularioPrestamo, setMostrarFormularioPrestamo] =
    useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState("");
  const [lectorSeleccionado, setLectorSeleccionado] = useState("");
  const [fechaPrestamo, setFechaPrestamo] = useState(fechaHoy());
  const [fechaLimite, setFechaLimite] = useState("");

  const prestamosActivos = prestamos.filter(
    (prestamo) => prestamo.estado === "Activo"
  );

  const prestamosVencidos = prestamos.filter((prestamo) => {
    if (prestamo.estado !== "Activo") return false;
    return prestamo.fechaLimite < fechaHoy();
  });

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

  function abrirFormularioPrestamo() {
    setMensaje("");
    setLibroSeleccionado("");
    setLectorSeleccionado("");
    setFechaPrestamo(fechaHoy());
    setFechaLimite("");
    setMostrarFormularioPrestamo((actual) => !actual);
  }

  async function registrarPrestamo(event) {
    event.preventDefault();

    const libroId = Number(libroSeleccionado);
    const lectorId = Number(lectorSeleccionado);

    const libro = libros.find((item) => Number(item.id) === libroId);

    if (!libro || libro.estado !== "Disponible") {
      setMensaje("El libro seleccionado ya no está disponible.");
      return;
    }

    if (!lectores.some((lector) => Number(lector.id) === lectorId)) {
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

    if (!fechaPrestamo || !fechaLimite || fechaLimite < fechaPrestamo) {
      setMensaje(
        "La fecha prevista de devolución debe ser igual o posterior al préstamo."
      );
      return;
    }

    try {
      const respuesta = await crearPrestamo({
        libroId,
        lectorId,
        fechaPrestamo,
        fechaLimite,
      });

      setPrestamos((actuales) => [...actuales, respuesta.prestamo]);

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
      setMensaje("Préstamo registrado correctamente en PostgreSQL.");
    } catch (error) {
      console.error("Error al registrar el préstamo:", error);
      setMensaje(error.message || "No fue posible registrar el préstamo.");
    }
  }

  async function registrarDevolucion(prestamo) {
    if (prestamo.estado !== "Activo") return;

    const confirmar = window.confirm(
      "¿Confirmas que el libro fue devuelto?"
    );
    if (!confirmar) return;

    try {
      const respuesta = await registrarDevolucionAPI(prestamo.id);

      setPrestamos((actuales) =>
        actuales.map((item) =>
          Number(item.id) === Number(prestamo.id)
            ? respuesta.prestamo
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
        "Devolución registrada correctamente. El libro está disponible nuevamente."
      );
    } catch (error) {
      console.error("Error al registrar la devolución:", error);
      setMensaje(error.message || "No fue posible registrar la devolución.");
    }
  }

  function nombreLibro(id) {
    return (
      libros.find((libro) => Number(libro.id) === Number(id))?.titulo ||
      "Libro no disponible"
    );
  }

  function nombreDelLector(id) {
    return (
      lectores.find((lector) => Number(lector.id) === Number(id))?.nombre ||
      "Lector no disponible"
    );
  }

  return {
    busquedaPrestamos,
    setBusquedaPrestamos,
    mostrarFormularioPrestamo,
    setMostrarFormularioPrestamo,
    libroSeleccionado,
    setLibroSeleccionado,
    lectorSeleccionado,
    setLectorSeleccionado,
    fechaPrestamo,
    setFechaPrestamo,
    fechaLimite,
    setFechaLimite,
    prestamosActivos,
    prestamosVencidos,
    prestamosFiltrados,
    abrirFormularioPrestamo,
    registrarPrestamo,
    registrarDevolucion,
    nombreLibro,
    nombreDelLector,
  };
}

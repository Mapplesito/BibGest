import { useState } from "react";
import {
  crearLector,
  actualizarLector,
  eliminarLectorAPI,
} from "../services/api";

export function useLectores({ lectores, setLectores, prestamos, setMensaje }) {
  const [busquedaLectores, setBusquedaLectores] = useState("");
  const [mostrarFormularioLector, setMostrarFormularioLector] = useState(false);
  const [lectorEditando, setLectorEditando] = useState(null);
  const [nombreLector, setNombreLector] = useState("");
  const [documentoLector, setDocumentoLector] = useState("");
  const [correoLector, setCorreoLector] = useState("");

  const lectoresFiltrados = lectores.filter((lector) =>
    `${lector.nombre} ${lector.documento} ${lector.correo}`
      .toLowerCase()
      .includes(busquedaLectores.toLowerCase())
  );

  function abrirFormularioLector() {
    setLectorEditando(null);
    setNombreLector("");
    setDocumentoLector("");
    setCorreoLector("");
    setMensaje("");
    setMostrarFormularioLector((actual) => !actual);
  }

  function editarLector(lector) {
    setLectorEditando(lector);
    setNombreLector(lector.nombre);
    setDocumentoLector(lector.documento);
    setCorreoLector(lector.correo);
    setMostrarFormularioLector(true);
    setMensaje("");
  }

  async function guardarLector(event) {
    event.preventDefault();

    const nombreLimpio = nombreLector.trim();
    const documentoLimpio = documentoLector.trim();
    const correoLimpio = correoLector.trim();

    if (!nombreLimpio || !documentoLimpio || !correoLimpio) {
      setMensaje("Completa todos los datos del lector.");
      return;
    }

    const documentoExiste = lectores.some(
      (lector) =>
        lector.documento.trim().toLowerCase() ===
          documentoLimpio.toLowerCase() &&
        Number(lector.id) !== Number(lectorEditando?.id)
    );

    if (documentoExiste) {
      setMensaje("Ya existe un lector con ese documento.");
      return;
    }

    const datosLector = {
      nombre: nombreLimpio,
      documento: documentoLimpio,
      correo: correoLimpio,
    };

    try {
      if (lectorEditando) {
        const respuesta = await actualizarLector(
          lectorEditando.id,
          datosLector
        );

        setLectores((actuales) =>
          actuales.map((lector) =>
            Number(lector.id) === Number(lectorEditando.id)
              ? respuesta.lector
              : lector
          )
        );

        setMensaje("Lector actualizado correctamente en PostgreSQL.");
      } else {
        const respuesta = await crearLector(datosLector);
        setLectores((actuales) => [...actuales, respuesta.lector]);
        setMensaje("Lector registrado correctamente en PostgreSQL.");
      }

      setNombreLector("");
      setDocumentoLector("");
      setCorreoLector("");
      setLectorEditando(null);
      setMostrarFormularioLector(false);
    } catch (error) {
      console.error("Error al guardar el lector:", error);
      setMensaje(error.message || "No fue posible guardar el lector.");
    }
  }

  async function eliminarLector(lector) {
    const tieneHistorialPrestamos = prestamos.some(
      (prestamo) => Number(prestamo.lectorId) === Number(lector.id)
    );

    if (tieneHistorialPrestamos) {
      setMensaje(
        "No puedes eliminar un lector que tiene préstamos registrados en su historial."
      );
      return;
    }

    if (!window.confirm(`¿Seguro que deseas eliminar a "${lector.nombre}"?`)) {
      return;
    }

    try {
      await eliminarLectorAPI(lector.id);

      setLectores((actuales) =>
        actuales.filter((item) => Number(item.id) !== Number(lector.id))
      );

      setMensaje("Lector eliminado correctamente de PostgreSQL.");
    } catch (error) {
      console.error("Error al eliminar el lector:", error);
      setMensaje(error.message || "No fue posible eliminar el lector.");
    }
  }

  return {
    busquedaLectores,
    setBusquedaLectores,
    mostrarFormularioLector,
    setMostrarFormularioLector,
    lectorEditando,
    nombreLector,
    setNombreLector,
    documentoLector,
    setDocumentoLector,
    correoLector,
    setCorreoLector,
    lectoresFiltrados,
    abrirFormularioLector,
    editarLector,
    guardarLector,
    eliminarLector,
  };
}

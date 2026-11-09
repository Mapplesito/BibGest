import { useEffect, useState } from "react";
import {
  probarConexionBackend,
  obtenerLibros,
  obtenerLectores,
  obtenerPrestamos,
} from "../services/api";

// Centraliza la carga inicial de la información almacenada en PostgreSQL.
export function useBibliotecaData() {
  const [libros, setLibros] = useState([]);
  const [lectores, setLectores] = useState([]);
  const [prestamos, setPrestamos] = useState([]);
  const [estadoBackend, setEstadoBackend] = useState(
    "Conectando con el backend..."
  );
  const [backendConectado, setBackendConectado] = useState(false);

  useEffect(() => {
    let componenteActivo = true;

    async function conectarYConsultarDatos() {
      try {
        await probarConexionBackend();

        const [librosBD, lectoresBD, prestamosBD] = await Promise.all([
          obtenerLibros(),
          obtenerLectores(),
          obtenerPrestamos(),
        ]);

        if (componenteActivo) {
          setLibros(librosBD);
          setLectores(lectoresBD);
          setPrestamos(prestamosBD);
          setBackendConectado(true);
          setEstadoBackend("Backend conectado");
        }
      } catch (error) {
        console.error(
          "No fue posible conectar o consultar los datos:",
          error
        );

        if (componenteActivo) {
          setBackendConectado(false);
          setEstadoBackend("Backend desconectado");
        }
      }
    }

    conectarYConsultarDatos();

    return () => {
      componenteActivo = false;
    };
  }, []);

  return {
    libros,
    setLibros,
    lectores,
    setLectores,
    prestamos,
    setPrestamos,
    estadoBackend,
    backendConectado,
  };
}

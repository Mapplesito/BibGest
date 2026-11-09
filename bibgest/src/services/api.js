// Dirección del backend publicado por Docker.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Función común para realizar peticiones.
async function solicitarAPI(ruta, opciones = {}) {
  const respuesta = await fetch(`${API_URL}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...opciones.headers,
    },
  });

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(
      datos.error || `Error del servidor: ${respuesta.status}`
    );
  }

  return datos;
}

// Comprobar conexión con PostgreSQL.
export async function probarConexionBackend() {
  return solicitarAPI("/test");
}

// Consultar todos los libros.
export async function obtenerLibros() {
  return solicitarAPI("/libros");
}

// Registrar un libro.
export async function crearLibro(libro) {
  return solicitarAPI("/libros", {
    method: "POST",
    body: JSON.stringify(libro),
  });
}

// Actualizar un libro.
export async function actualizarLibro(id, libro) {
  return solicitarAPI(`/libros/${id}`, {
    method: "PUT",
    body: JSON.stringify(libro),
  });
}

// Eliminar un libro.
export async function eliminarLibroAPI(id) {
  return solicitarAPI(`/libros/${id}`, {
    method: "DELETE",
  });
}
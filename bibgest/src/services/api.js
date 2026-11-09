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

// ==========================================
// FUNCIONES DE LIBROS
// ==========================================

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

// ==========================================
// FUNCIONES DE LECTORES
// ==========================================

// Consultar todos los lectores.
export async function obtenerLectores() {
  return solicitarAPI("/lectores");
}

// Registrar un lector.
export async function crearLector(lector) {
  return solicitarAPI("/lectores", {
    method: "POST",
    body: JSON.stringify(lector),
  });
}

// Actualizar un lector.
export async function actualizarLector(id, lector) {
  return solicitarAPI(`/lectores/${id}`, {
    method: "PUT",
    body: JSON.stringify(lector),
  });
}

// Eliminar un lector.
export async function eliminarLectorAPI(id) {
  return solicitarAPI(`/lectores/${id}`, {
    method: "DELETE",
  });
}
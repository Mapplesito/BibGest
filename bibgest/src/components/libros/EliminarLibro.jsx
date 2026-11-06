export function EliminarLibro({ libro, eliminarLibro }) {
  return (
    <button className="delete-button" onClick={() => eliminarLibro(libro)}>
      Eliminar
    </button>
  );
}

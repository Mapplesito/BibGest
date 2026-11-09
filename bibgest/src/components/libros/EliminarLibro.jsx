export function EliminarLibro({ libro, eliminarLibro }) {
  return (
    <button type="button" className="delete-button" onClick={() => eliminarLibro(libro)}>
      Eliminar
    </button>
  );
}

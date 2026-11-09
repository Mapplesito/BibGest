export function EliminarLector({ lector, eliminarLector }) {
  return (
    <button
      type="button"
      className="delete-button"
      onClick={() => eliminarLector(lector)}
    >
      Eliminar
    </button>
  );
}
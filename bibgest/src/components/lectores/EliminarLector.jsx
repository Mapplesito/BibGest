export function EliminarLector({ lector, eliminarLector }) {
  return (
    <button className="delete-button" onClick={() => eliminarLector(lector)}>
      Eliminar
    </button>
  );
}

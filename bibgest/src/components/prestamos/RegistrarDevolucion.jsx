export function RegistrarDevolucion({ prestamo, registrarDevolucion }) {
  return (
    <>
      {prestamo.estado === "Activo" ? (
        <button className="edit-button" onClick={() => registrarDevolucion(prestamo)}>Registrar devolución</button>
      ) : (
        <span>{prestamo.fechaDevolucionReal || "—"}</span>
      )}
    </>
  );
}

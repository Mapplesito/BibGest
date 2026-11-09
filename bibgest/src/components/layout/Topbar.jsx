export function Topbar({ seccionActiva, backendConectado, estadoBackend }) {
  const titulos = {
    inicio: "Panel principal",
    libros: "Gestión de libros",
    lectores: "Gestión de lectores",
    prestamos: "Préstamos y devoluciones",
  };

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">SISTEMA DE GESTIÓN</p>
        <h2>{titulos[seccionActiva]}</h2>
      </div>

      <span className="status">
        <span
          style={{
            background: backendConectado ? "#38bc83" : "#d97706",
          }}
        />
        {estadoBackend}
      </span>
    </header>
  );
}

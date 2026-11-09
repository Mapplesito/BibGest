export function Sidebar({ seccionActiva, cambiarSeccion }) {
  return (
    <aside className="sidebar">
      <h1 className="logo">
        Bib<span>Gest</span>
      </h1>

      <p className="menu-label">MENÚ PRINCIPAL</p>

      <nav>
        <a
          className={`nav-item ${seccionActiva === "inicio" ? "active" : ""}`}
          href="#inicio"
          onClick={() => cambiarSeccion("inicio")}
        >
          ▦ <span>Inicio</span>
        </a>

        <a
          className={`nav-item ${seccionActiva === "libros" ? "active" : ""}`}
          href="#libros"
          onClick={() => cambiarSeccion("libros")}
        >
          ▤ <span>Libros</span>
        </a>

        <a
          className={`nav-item ${seccionActiva === "prestamos" ? "active" : ""}`}
          href="#prestamos"
          onClick={() => cambiarSeccion("prestamos")}
        >
          ⇄ <span>Préstamos</span>
        </a>

        <a
          className={`nav-item ${seccionActiva === "lectores" ? "active" : ""}`}
          href="#lectores"
          onClick={() => cambiarSeccion("lectores")}
        >
          ♙ <span>Lectores</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <span className="avatar">BG</span>
        <div>
          <strong>Administrador</strong>
          <small>Biblioteca</small>
        </div>
      </div>
    </aside>
  );
}

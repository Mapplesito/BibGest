export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1 className="logo">Bib<span>Gest</span></h1>
      <p className="menu-label">MENÚ PRINCIPAL</p>

      <nav>
        <a className="nav-item active" href="#inicio">▦ <span>Inicio</span></a>
        <a className="nav-item" href="#libros">▤ <span>Libros</span></a>
        <a className="nav-item" href="#prestamos">⇄ <span>Préstamos</span></a>
        <a className="nav-item" href="#lectores">♙ <span>Lectores</span></a>
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
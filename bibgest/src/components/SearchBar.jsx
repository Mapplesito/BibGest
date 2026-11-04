export function SearchBar({ busqueda, setBusqueda }) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Buscar por título o autor..."
      value={busqueda}
      onChange={(event) => setBusqueda(event.target.value)}
    />
  );
}
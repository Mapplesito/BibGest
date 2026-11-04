export function BookForm({ 
  libroEditando, 
  titulo, 
  setTitulo, 
  autor, 
  setAutor, 
  onSubmit 
}) {
  return (
    <form className="book-form" onSubmit={onSubmit}>
      <h3>{libroEditando ? "Editar libro" : "Registrar un libro"}</h3>

      <label htmlFor="titulo">Título del libro</label>
      <input
        id="titulo"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        placeholder="Ej. El nombre del viento"
        maxLength={120}
        required
      />

      <label htmlFor="autor">Autor</label>
      <input
        id="autor"
        value={autor}
        onChange={(event) => setAutor(event.target.value)}
        placeholder="Nombre del autor"
        maxLength={100}
        required
      />

      <button className="primary-button" type="submit">
        Guardar libro
      </button>
    </form>
  );
}
export function EditarLibro({ titulo, setTitulo, autor, setAutor, guardarLibro }) {
  return (
    <form className="book-form" onSubmit={guardarLibro}>
      <h3>Editar libro</h3>
      <label htmlFor="titulo">Título del libro</label>
      <input id="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} maxLength={120} required />
      <label htmlFor="autor">Autor</label>
      <input id="autor" value={autor} onChange={(e) => setAutor(e.target.value)} maxLength={100} required />
      <button className="primary-button" type="submit">Guardar libro</button>
    </form>
  );
}

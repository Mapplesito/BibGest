import { AgregarLibro } from "../components/libros/AgregarLibro";
import { EditarLibro } from "../components/libros/EditarLibro";
import { EliminarLibro } from "../components/libros/EliminarLibro";

export function Libros({ mensaje, acciones }) {
  const {
    busquedaLibros,
    setBusquedaLibros,
    mostrarFormularioLibro,
    libroEditando,
    titulo,
    setTitulo,
    autor,
    setAutor,
    librosFiltrados,
    abrirFormularioLibro,
    editarLibro,
    guardarLibro,
    eliminarLibro,
  } = acciones;

  return (
    <section className="catalog" id="libros">
      <div className="section-heading">
        <div>
          <h2>Catálogo de libros</h2>
          <p>Consulta y registra los libros de la biblioteca.</p>
        </div>

        <button className="primary-button" onClick={abrirFormularioLibro}>
          {mostrarFormularioLibro ? "Cancelar" : "+ Agregar libro"}
        </button>
      </div>

      {mostrarFormularioLibro &&
        (libroEditando ? (
          <EditarLibro
            titulo={titulo}
            setTitulo={setTitulo}
            autor={autor}
            setAutor={setAutor}
            guardarLibro={guardarLibro}
          />
        ) : (
          <AgregarLibro
            titulo={titulo}
            setTitulo={setTitulo}
            autor={autor}
            setAutor={setAutor}
            guardarLibro={guardarLibro}
          />
        ))}

      {mensaje && (
        <p className="feedback" role="status">
          {mensaje}
        </p>
      )}

      <input
        className="search"
        type="search"
        placeholder="Buscar por título o autor..."
        value={busquedaLibros}
        onChange={(event) => setBusquedaLibros(event.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>TÍTULO</th>
              <th>AUTOR</th>
              <th>ESTADO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {librosFiltrados.map((libro) => (
              <tr key={libro.id}>
                <td className="book-title">{libro.titulo}</td>
                <td>{libro.autor}</td>
                <td>
                  <span
                    className={`badge ${
                      libro.estado === "Disponible" ? "available" : "loaned"
                    }`}
                  >
                    {libro.estado}
                  </span>
                </td>
                <td className="actions-cell">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => editarLibro(libro)}
                  >
                    Editar
                  </button>
                  <EliminarLibro libro={libro} eliminarLibro={eliminarLibro} />
                </td>
              </tr>
            ))}

            {librosFiltrados.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  No se encontraron libros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

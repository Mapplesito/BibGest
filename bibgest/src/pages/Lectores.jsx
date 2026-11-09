import { AgregarLector } from "../components/lectores/AgregarLector";
import { EditarLector } from "../components/lectores/EditarLector";
import { EliminarLector } from "../components/lectores/EliminarLector";

export function Lectores({ mensaje, acciones }) {
  const {
    busquedaLectores,
    setBusquedaLectores,
    mostrarFormularioLector,
    lectorEditando,
    nombreLector,
    setNombreLector,
    documentoLector,
    setDocumentoLector,
    correoLector,
    setCorreoLector,
    lectoresFiltrados,
    abrirFormularioLector,
    editarLector,
    guardarLector,
    eliminarLector,
  } = acciones;

  return (
    <section className="catalog" id="lectores">
      <div className="section-heading">
        <div>
          <h2>Registro de lectores</h2>
          <p>Administra las personas que pueden pedir libros prestados.</p>
        </div>

        <button className="primary-button" onClick={abrirFormularioLector}>
          {mostrarFormularioLector ? "Cancelar" : "+ Agregar lector"}
        </button>
      </div>

      {mostrarFormularioLector &&
        (lectorEditando ? (
          <EditarLector
            nombreLector={nombreLector}
            setNombreLector={setNombreLector}
            documentoLector={documentoLector}
            setDocumentoLector={setDocumentoLector}
            correoLector={correoLector}
            setCorreoLector={setCorreoLector}
            guardarLector={guardarLector}
          />
        ) : (
          <AgregarLector
            nombreLector={nombreLector}
            setNombreLector={setNombreLector}
            documentoLector={documentoLector}
            setDocumentoLector={setDocumentoLector}
            correoLector={correoLector}
            setCorreoLector={setCorreoLector}
            guardarLector={guardarLector}
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
        placeholder="Buscar por nombre, documento o correo..."
        value={busquedaLectores}
        onChange={(event) => setBusquedaLectores(event.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>NOMBRE</th>
              <th>DOCUMENTO</th>
              <th>CORREO</th>
              <th>ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {lectoresFiltrados.map((lector) => (
              <tr key={lector.id}>
                <td className="book-title">{lector.nombre}</td>
                <td>{lector.documento}</td>
                <td>{lector.correo}</td>
                <td className="actions-cell">
                  <button
                    className="edit-button"
                    type="button"
                    onClick={() => editarLector(lector)}
                  >
                    Editar
                  </button>
                  <EliminarLector lector={lector} eliminarLector={eliminarLector} />
                </td>
              </tr>
            ))}

            {lectoresFiltrados.length === 0 && (
              <tr>
                <td colSpan="4" className="empty">
                  No hay lectores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

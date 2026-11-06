export function EditarLector({ nombreLector, setNombreLector, documentoLector, setDocumentoLector, correoLector, setCorreoLector, guardarLector }) {
  return (
    <form className="book-form" onSubmit={guardarLector}>
      <h3>Editar lector</h3>
      <label htmlFor="nombreLector">Nombre completo</label>
      <input id="nombreLector" value={nombreLector} onChange={(e) => setNombreLector(e.target.value)} maxLength={120} required />
      <label htmlFor="documentoLector">Documento</label>
      <input id="documentoLector" value={documentoLector} onChange={(e) => setDocumentoLector(e.target.value)} maxLength={30} required />
      <label htmlFor="correoLector">Correo electrónico</label>
      <input id="correoLector" type="email" value={correoLector} onChange={(e) => setCorreoLector(e.target.value)} maxLength={120} required />
      <button className="primary-button" type="submit">Guardar lector</button>
    </form>
  );
}

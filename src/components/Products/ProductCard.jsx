export default function ProductCard({ producto, onAgregar }) {
  return (
    <article className="tarjeta-producto">
      <p className="tarjeta-origen">{producto.origen}</p>
      <h3 className="tarjeta-nombre">{producto.nombre}</h3>

      <dl className="tarjeta-ficha">
        <div className="tarjeta-ficha-fila">
          <dt>Proceso</dt>
          <dd>{producto.proceso}</dd>
        </div>
        <div className="tarjeta-ficha-fila">
          <dt>Altitud</dt>
          <dd>{producto.altitud}</dd>
        </div>
        <div className="tarjeta-ficha-fila">
          <dt>Tueste</dt>
          <dd>{producto.tueste}</dd>
        </div>
      </dl>

      <p className="tarjeta-notas">{producto.notas}</p>

      <div className="tarjeta-pie">
        <span className="tarjeta-precio">
          ${producto.precio.toLocaleString('es-CL')}
        </span>
        <button type="button" onClick={() => onAgregar(producto)}>
          Añadir
        </button>
      </div>
    </article>
  );
}

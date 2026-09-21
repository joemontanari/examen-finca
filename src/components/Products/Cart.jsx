export default function Cart({ items, onQuitar, onVaciar }) {
  const total = items.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );

  return (
    <aside className="carrito">
      <h2>Tu pedido</h2>

      {items.length === 0 ? (
        <p className="carrito-vacio">Añade un café para empezar tu pedido.</p>
      ) : (
        <>
          <ul className="carrito-lista">
            {items.map((item) => (
              <li key={item.id} className="carrito-item">
                <div className="carrito-item-info">
                  <span className="carrito-item-nombre">{item.nombre}</span>
                  <span className="carrito-item-cantidad">× {item.cantidad}</span>
                </div>
                <span className="carrito-item-precio">
                  ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                </span>
                <button
                  type="button"
                  className="carrito-quitar"
                  onClick={() => onQuitar(item.id)}
                  aria-label={`Quitar ${item.nombre} del pedido`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>

          <div className="carrito-total">
            <span>Total</span>
            <span>${total.toLocaleString('es-CL')}</span>
          </div>

          <button type="button" className="carrito-vaciar" onClick={onVaciar}>
            Vaciar pedido
          </button>
        </>
      )}
    </aside>
  );
}

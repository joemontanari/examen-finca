import { Component } from 'react';
import { PRODUCTOS } from '../../data/products';
import ProductCard from './ProductCard';
import Cart from './Cart';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carrito: [],
    };
  }

  agregarAlCarrito = (producto) => {
    this.setState((estadoPrevio) => {
      const yaExiste = estadoPrevio.carrito.find((item) => item.id === producto.id);

      if (yaExiste) {
        return {
          carrito: estadoPrevio.carrito.map((item) =>
            item.id === producto.id
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          ),
        };
      }

      return {
        carrito: [...estadoPrevio.carrito, { ...producto, cantidad: 1 }],
      };
    });
  };

  quitarDelCarrito = (id) => {
    this.setState((estadoPrevio) => ({
      carrito: estadoPrevio.carrito.filter((item) => item.id !== id),
    }));
  };

  vaciarCarrito = () => {
    this.setState({ carrito: [] });
  };

  render() {
    return (
      <section className="catalogo">
        <div className="grilla-productos">
          {PRODUCTOS.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={this.agregarAlCarrito}
            />
          ))}
        </div>

        <Cart
          items={this.state.carrito}
          onQuitar={this.quitarDelCarrito}
          onVaciar={this.vaciarCarrito}
        />
      </section>
    );
  }
}

export default ProductList;

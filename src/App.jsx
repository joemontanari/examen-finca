import { useState } from 'react';
import ProductList from './components/Products/ProductList';
import ContactForm from './components/Contact/ContactForm';
import Account from './components/Account/Account';

const SECCIONES = [
  { id: 'catalogo', etiqueta: 'Catálogo' },
  { id: 'contacto', etiqueta: 'Contacto' },
  { id: 'cuenta', etiqueta: 'Mi cuenta' },
];

export default function App() {
  const [seccion, setSeccion] = useState('catalogo');

  return (
    <div className="pagina">
      <header className="encabezado">
        <span className="marca-nombre">Finca</span>
        <span className="marca-divisor" aria-hidden="true" />
        <span className="marca-tag">Café de origen, tueste a pedido</span>

        <nav className="nav-secciones">
          {SECCIONES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={seccion === item.id ? 'tab-seccion activa' : 'tab-seccion'}
              onClick={() => setSeccion(item.id)}
            >
              {item.etiqueta}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {seccion === 'catalogo' && <ProductList />}
        {seccion === 'contacto' && <ContactForm />}
        {seccion === 'cuenta' && <Account />}
      </main>
    </div>
  );
}

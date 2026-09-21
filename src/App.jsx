import { useState } from 'react';
import ProductList from './components/Products/ProductList';
import ContactForm from './components/Contact/ContactForm';
import Account from './components/Account/Account';

function IconTaza() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8h11v6a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5V8Z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 5c0-.8.4-1 .6-1.6M11.5 5c0-.8.4-1 .6-1.6" />
    </svg>
  );
}

function IconSobre() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function IconPersona() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8.5" r="3.2" />
      <path d="M5 19.5c1-3.3 3.8-5 7-5s6 1.7 7 5" />
    </svg>
  );
}

const SECCIONES = [
  { id: 'catalogo', etiqueta: 'Catálogo', Icono: IconTaza },
  { id: 'contacto', etiqueta: 'Contacto', Icono: IconSobre },
  { id: 'cuenta', etiqueta: 'Mi cuenta', Icono: IconPersona },
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

      <nav className="nav-mobile" aria-label="Navegación principal">
        {SECCIONES.map((item) => {
          const { Icono } = item;
          return (
            <button
              key={item.id}
              type="button"
              className={seccion === item.id ? 'tab-mobile activa' : 'tab-mobile'}
              onClick={() => setSeccion(item.id)}
            >
              <Icono />
              <span>{item.etiqueta}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

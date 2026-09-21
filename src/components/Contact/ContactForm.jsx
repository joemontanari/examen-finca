import { useRef, useState } from 'react';
import SimpleReactValidator from 'simple-react-validator';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebase';

const CONTACTOS_COLLECTION = 'contactos';

export default function ContactForm() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [archivo, setArchivo] = useState(null);
  const [, forceUpdate] = useState(0);
  const [enviando, setEnviando] = useState(false);
  const [estado, setEstado] = useState(null);

  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        required: 'Este campo es obligatorio.',
        email: 'Ingresa un correo válido.',
        min: 'El mensaje debe tener al menos :min caracteres.',
      },
    })
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validator.current.allValid()) {
      validator.current.showMessages();
      forceUpdate((n) => n + 1);
      return;
    }

    setEnviando(true);
    setEstado(null);

    try {
      let archivoUrl = null;

      if (archivo) {
        const referencia = ref(storage, `comprobantes/${Date.now()}-${archivo.name}`);
        await uploadBytes(referencia, archivo);
        archivoUrl = await getDownloadURL(referencia);
      }

      await addDoc(collection(db, CONTACTOS_COLLECTION), {
        nombre,
        email,
        mensaje,
        archivoUrl,
        creadoEn: Date.now(),
      });

      setNombre('');
      setEmail('');
      setMensaje('');
      setArchivo(null);
      validator.current.hideMessages();
      setEstado({ tipo: 'exito', texto: 'Tu mensaje fue enviado. Te contactaremos pronto.' });
    } catch (error) {
      console.error('Error al guardar el contacto:', error);
      setEstado({ tipo: 'error', texto: 'No pudimos enviar tu mensaje. Intenta de nuevo.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '560px' }}>
      <h2 className="h4 mb-3">Escríbenos</h2>
      <p className="text-muted mb-4">
        Para pedidos al por mayor, visitas a la finca o cualquier otra consulta.
      </p>

      {estado && (
        <div className={`alert ${estado.tipo === 'exito' ? 'alert-success' : 'alert-danger'}`} role="alert">
          {estado.texto}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            id="nombre"
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => validator.current.showMessageFor('nombre')}
          />
          <div className="form-text text-danger">
            {validator.current.message('nombre', nombre, 'required')}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Correo
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => validator.current.showMessageFor('email')}
          />
          <div className="form-text text-danger">
            {validator.current.message('email', email, 'required|email')}
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">
            Mensaje
          </label>
          <textarea
            id="mensaje"
            className="form-control"
            rows={4}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            onBlur={() => validator.current.showMessageFor('mensaje')}
          />
          <div className="form-text text-danger">
            {validator.current.message('mensaje', mensaje, 'required|min:10')}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="archivo" className="form-label">
            Foto de tu local (opcional)
          </label>
          <input
            id="archivo"
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => setArchivo(e.target.files?.[0] ?? null)}
          />
          <div className="form-text">Se guarda en Firebase Storage.</div>
        </div>

        <button type="submit" className="btn btn-dark" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </div>
  );
}

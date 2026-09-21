import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from '../../firebase';

export default function Account() {
  const [usuario, setUsuario] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [modo, setModo] = useState('ingresar');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioActual) => {
      setUsuario(usuarioActual);
      setCargandoSesion(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    try {
      if (modo === 'ingresar') {
        await signInWithEmailAndPassword(auth, email, clave);
      } else {
        await createUserWithEmailAndPassword(auth, email, clave);
      }
      setEmail('');
      setClave('');
    } catch (err) {
      setError(traducirError(err.code));
    } finally {
      setEnviando(false);
    }
  };

  const handleSignOut = () => signOut(auth);

  if (cargandoSesion) {
    return <p className="text-muted">Cargando sesión...</p>;
  }

  if (usuario) {
    return (
      <div className="container" style={{ maxWidth: '480px' }}>
        <h2 className="h4 mb-3">Mi cuenta</h2>
        <p>
          Sesión iniciada como <strong>{usuario.email}</strong>.
        </p>
        <button type="button" className="btn btn-outline-dark" onClick={handleSignOut}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '420px' }}>
      <h2 className="h4 mb-3">Mi cuenta</h2>

      <div className="btn-group mb-4" role="group">
        <button
          type="button"
          className={`btn btn-sm ${modo === 'ingresar' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setModo('ingresar')}
        >
          Ingresar
        </button>
        <button
          type="button"
          className={`btn btn-sm ${modo === 'crear' ? 'btn-dark' : 'btn-outline-dark'}`}
          onClick={() => setModo('crear')}
        >
          Crear cuenta
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="cuentaEmail" className="form-label">
            Correo
          </label>
          <input
            id="cuentaEmail"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cuentaClave" className="form-label">
            Contraseña
          </label>
          <input
            id="cuentaClave"
            type="password"
            className="form-control"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            minLength={6}
            required
          />
        </div>

        <button type="submit" className="btn btn-dark w-100" disabled={enviando}>
          {enviando
            ? 'Procesando...'
            : modo === 'ingresar'
              ? 'Ingresar'
              : 'Crear cuenta'}
        </button>
      </form>
    </div>
  );
}

function traducirError(codigo) {
  switch (codigo) {
    case 'auth/invalid-email':
      return 'El correo no es válido.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    default:
      return 'Ocurrió un error. Intenta de nuevo.';
  }
}

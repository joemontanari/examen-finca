# Finca — Examen Programación de Componentes

Aplicación React para el examen de la Unidad II. Catálogo de café de origen con carrito de compras, formulario de contacto conectado a Firebase y una sección de cuenta con autenticación.

## Stack

- React 18 + Vite
- Firebase (Firestore, Authentication, Storage)
- react-simple-validator
- Bootstrap 5

## Estructura por ejercicio

### Ejercicio 1 — Catálogo y carrito (`src/components/Products`)

- `ProductList.jsx`: componente **padre**, de clase, mantiene el carrito en `this.state` y lo actualiza con `this.setState({})`.
- `ProductCard.jsx`: componente **hijo**, funcional. Recibe el producto por props y notifica al padre mediante el callback `onAgregar` (comunicación hijo → padre).
- `Cart.jsx`: muestra el carrito, permite quitar ítems y vaciar el pedido.
- Los productos se listan con `map()` usando `id` como `key`.

### Ejercicio 2 — Formulario y Firestore (`src/components/Contact`)

- `ContactForm.jsx`: formulario de contacto validado con `react-simple-validator` (nombre y correo obligatorios, correo válido, mensaje de mínimo 10 caracteres).
- Al enviar, guarda el documento en la colección `contactos` de Firestore.

### Ejercicio 3 — Bootstrap, Auth y Storage

- El formulario de contacto y la sección "Mi cuenta" están estilizados con clases de Bootstrap (`form-control`, `btn`, `alert`, `container`).
- `src/components/Account/Account.jsx`: registro e inicio de sesión con **Firebase Authentication** (correo y contraseña), y cierre de sesión.
- `ContactForm.jsx` permite adjuntar una imagen opcional que se sube a **Firebase Storage**; la URL resultante se guarda junto con el resto del formulario en Firestore.
- Empaquetado móvil (Android Studio, Gradle, Cordova, firma y prueba del APK) documentado en la sección siguiente — requiere herramientas que no están disponibles en este entorno de desarrollo.

## Cómo correrlo

```bash
npm install
npm run dev
```

Copia `.env.example` a `.env` y completa las credenciales del proyecto de Firebase antes de levantar el servidor.

## Firebase

El proyecto usa Firestore, Authentication y Storage. La primera vez que se usa un proyecto de Firebase nuevo, dos servicios se activan desde la consola (no se pueden habilitar por línea de comandos):

1. **Firestore** → consola de Firebase → Firestore Database → *Crear base de datos* (modo producción, cualquier región).
2. **Storage** → consola de Firebase → Storage → *Comenzar*.
3. **Authentication** → consola de Firebase → Authentication → Sign-in method → habilitar el proveedor **Correo/contraseña**.

Las reglas de Firestore y Storage (`firestore.rules`, `storage.rules`) están abiertas a propósito, solo para fines académicos de este examen.

Para desplegar las reglas una vez creados los servicios:

```bash
firebase deploy --only firestore:rules,storage
```

## Empaquetado a APK (Android)

Pasos a ejecutar en un equipo con Android Studio instalado:

1. `npm run build` genera la versión de producción en `dist/`.
2. Instalar Cordova: `npm install -g cordova`.
3. Crear el wrapper: `cordova create finca-app com.finca.app Finca` y copiar el contenido de `dist/` a `finca-app/www/`.
4. `cordova platform add android`.
5. Abrir el proyecto en Android Studio para instalar el SDK/Gradle que falte.
6. `cordova build android` (debug) o `cordova build android --release` (release).
7. Firmar el APK con `apksigner` o `jarsigner` usando un keystore propio (`keytool -genkey -v -keystore finca.keystore -alias finca -keyalg RSA -keysize 2048 -validity 10000`).
8. Instalar y probar en un dispositivo o emulador: `adb install app-release-signed.apk`.

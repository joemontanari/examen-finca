# Finca

Proyecto para el examen de Programación de Componentes (Unidad II). Es una tienda de café con carrito de compras, un formulario de contacto guardado en Firebase, y una sección para crear cuenta / iniciar sesión.

Usa React + Vite, Firebase (Firestore, Auth y Storage), react-simple-validator para las validaciones y Bootstrap para el formulario y la cuenta.

- Repo: https://github.com/joemontanari/examen-finca
- Deploy: https://examen-finca.netlify.app

## Para correrlo

```
npm install
npm run dev
```

Antes de eso hay que copiar `.env.example` a `.env` y poner ahí las credenciales de Firebase del proyecto (las de la consola, en Configuración del proyecto > tus apps).

## Qué hay en cada parte

**Catálogo (Ejercicio 1)** — está en `src/components/Products`. `ProductList` es un componente de clase que hace de padre y guarda el carrito en el state (con `this.setState`). Cada producto se pinta con `ProductCard`, que es el hijo, y cuando apretái "Añadir" le avisa al padre con un callback. El listado se arma con `map()`.

**Formulario de contacto (Ejercicio 2)** — `src/components/Contact/ContactForm.jsx`. Valida nombre, correo y mensaje con react-simple-validator, y al enviar guarda todo en la colección `contactos` de Firestore.

**Cuenta y Storage (Ejercicio 3)** — el formulario de contacto y `src/components/Account/Account.jsx` están hechos con clases de Bootstrap. La cuenta permite registrarse/iniciar sesión con correo y contraseña usando Firebase Auth. El formulario de contacto también deja subir una foto opcional, que se guarda en Firebase Storage y su link queda guardado junto al resto de los datos en Firestore.

También se empaquetó como app Android con Cordova (carpeta `finca-app` al lado de este proyecto), firmado con un keystore propio y probado en un emulador. Los pasos están más abajo.

## Firebase

Antes de que funcione hay que activar tres cosas desde la consola de Firebase (esto no se puede hacer por consola de comandos, hay que entrar y darle click):

- Firestore Database > Crear base de datos
- Storage > Comenzar (esto pide activar el plan Blaze, pero no cobra nada si te mantienes en la cuota gratis)
- Authentication > Sign-in method > activar Correo/contraseña

Las reglas de Firestore y Storage están abiertas a propósito (cualquiera puede leer/escribir), es solo para este examen, no para producción.

## Empaquetado a APK

No tengo un Android para probarlo, así que se probó en un emulador (`finca_emulador`, Android 14) en vez de un teléfono real.

1. `npm run build` para generar el `dist/`.
2. `npm install -g cordova`
3. `cordova create finca-app com.finca.app Finca`, copiar `dist/` a `finca-app/www`.
4. `cordova platform add android`
5. Necesita Java 17, el SDK de Android (platform-tools, build-tools 36, platform 34 y 36) y Gradle.
6. `cordova build android` para el debug.
7. Para firmar el release: generar un keystore con `keytool` y guardar los datos en `platforms/android/release-signing.properties` (o pasarlos con `--keystore`, `--storePassword`, `--alias`, `--password`).
8. `cordova build android --release` deja el `.aab` para subir a Play Store. Para instalar directo en un emulador o teléfono se necesita el `.apk`, que se genera aparte con `./gradlew assembleRelease` desde `platforms/android`.
9. Con el emulador prendido: `adb install app-release.apk`.

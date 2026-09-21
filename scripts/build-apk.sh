#!/bin/bash
set -e

# Correr este script desde la carpeta examen-react:
#   cd examen-react
#   bash scripts/build-apk.sh
#
# Requisitos ya instalados: openjdk@17 (brew) y android-commandlinetools (brew).

export JAVA_HOME="/opt/homebrew/opt/openjdk@17"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

echo "== 1. Aceptar licencias del SDK =="
yes | sdkmanager --licenses

echo "== 2. Instalar paquetes del SDK (build-tools 36 es lo que pide cordova-android 15, aunque el emulador use la 34) =="
sdkmanager "platform-tools" "platforms;android-34" "platforms;android-36" "build-tools;34.0.0" "build-tools;36.0.0" "emulator" "system-images;android-34;google_apis;arm64-v8a"

echo "== 3. Crear el emulador (AVD) =="
echo "no" | avdmanager create avd -n finca_emulador -k "system-images;android-34;google_apis;arm64-v8a" --force

echo "== 4. Compilar el proyecto React =="
npm run build

echo "== 5. Crear el proyecto Cordova y copiar el build =="
cd ..
if [ ! -d finca-app ]; then
  cordova create finca-app com.finca.app Finca
fi
rm -rf finca-app/www
cp -r examen-react/dist finca-app/www
cd finca-app
cordova platform add android 2>/dev/null || true

echo "== 6. Compilar el APK (debug) =="
which gradle >/dev/null 2>&1 || brew install gradle
cordova build android

echo "== 7. Generar el keystore para firmar (solo la primera vez) =="
KEYSTORE="$HOME/finca-release.keystore"
PASS_FILE="$HOME/finca-release.keystore.pass.txt"
if [ ! -f "$KEYSTORE" ]; then
  KEYSTORE_PASS=$(LC_ALL=C tr -dc 'A-Za-z0-9' </dev/urandom | head -c 20)
  echo "$KEYSTORE_PASS" > "$PASS_FILE"
  chmod 600 "$PASS_FILE"
  keytool -genkey -v -keystore "$KEYSTORE" -alias finca -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$KEYSTORE_PASS" -keypass "$KEYSTORE_PASS" \
    -dname "CN=Finca, OU=Examen, O=IPlacex, L=Santiago, S=RM, C=CL"
fi
KEYSTORE_PASS=$(cat "$PASS_FILE")

echo "== 8. Compilar el release (esto deja un .aab, sirve para Play Store pero no se instala directo) =="
cordova build android --release -- --keystore="$KEYSTORE" --storePassword="$KEYSTORE_PASS" --alias=finca --password="$KEYSTORE_PASS"

echo "== 8b. Generar el .apk firmado (usa el release-signing.properties que dejó el paso anterior) =="
(cd platforms/android && ./gradlew assembleRelease)

APK=$(find platforms/android/app/build/outputs/apk/release -name "*.apk" | head -1)
echo "APK generado en: $APK"

echo "== 9. Levantar el emulador (se abre una ventana con el teléfono virtual) =="
emulator -avd finca_emulador &
echo "Espera a que el emulador termine de bootear (barra de carga completa) y después corre:"
echo "  adb install \"$APK\""

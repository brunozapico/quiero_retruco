# Truco · Contador PWA

Contador mobile-first para partidas de truco a **15 o 30 puntos**, optimizado para iPhone 15 Pro Max y preparado para instalarse como PWA.

## Funcionalidades

- Modalidad a 15 o 30 puntos.
- Equipos fijos: **Nosotros** y **Ellos**.
- Controles exclusivos `+1` y `−1`.
- Detección automática del ganador.
- Revancha, reinicio y cambio de modalidad.
- Sonidos generados con Web Audio, sin archivos externos.
- Vibración progresiva en navegadores compatibles.
- Animaciones sutiles y soporte para `prefers-reduced-motion`.
- Uso offline mediante service worker.
- Persistencia únicamente de la partida actual; no guarda historial.
- Sin backend, base de datos, login ni variables de entorno.

## Stack

- React 19
- TypeScript 6
- Vite 8
- `vite-plugin-pwa` / Workbox
- CSS nativo

## Desarrollo local

Requiere Node.js 20.19 o superior. Se incluye `.nvmrc` para Node 22.

```bash
npm install
npm run dev
```

Abrí la URL que muestra Vite. Para probar desde el iPhone en la misma red:

```bash
npm run dev -- --host
```

## Validación

```bash
npm run check
```

Este comando ejecuta ESLint, TypeScript y el build de producción.

## Deploy en Vercel

1. Subí esta carpeta a un repositorio de GitHub.
2. En Vercel, elegí **Add New → Project**.
3. Importá el repositorio.
4. Vercel detectará Vite automáticamente:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Tocá **Deploy**.

No requiere variables de entorno ni configuración adicional.

## Instalar en iPhone

1. Abrí la URL publicada en Safari.
2. Tocá el botón **Compartir**.
3. Elegí **Agregar a Inicio**.
4. Tocá **Agregar**.

Después del primer acceso online, la aplicación puede abrirse sin conexión.

## Nota sobre haptics en iPhone

La API web estándar de vibración no está expuesta por Safari en iOS. El proyecto activa vibración en navegadores que sí la soportan y usa sonido más animación como feedback principal en iPhone. Para haptics nativos reales sería necesario empaquetar la interfaz con Capacitor y distribuir una aplicación nativa, no una PWA alojada únicamente en Vercel.

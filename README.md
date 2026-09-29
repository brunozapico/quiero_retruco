# QuieroReTruco

Contador de puntos para partidas de truco, pensado para usarse cómodamente desde el celular y especialmente como aplicación instalada en la pantalla de inicio.

Permite llevar partidas a **15 o 30 puntos** entre **Nosotros** y **Ellos**, con una interfaz simple, controles grandes y un historial de movimientos que ayuda a despejar rápidamente la duda de si un punto se sumó o se restó.

## Funcionalidades

- Partidas a 15 o 30 puntos.
- Controles rápidos para sumar y restar puntos.
- Detección automática del equipo ganador.
- Historial de movimientos por equipo, con horario y puntaje resultante.
- Reinicio, revancha y cambio de modalidad.
- Persistencia local de la partida en curso.
- Sonidos generados con Web Audio y vibración en dispositivos compatibles.
- Preferencia de sonido guardada en el dispositivo.
- Instalación como PWA y funcionamiento sin conexión.
- Diseño mobile-first, adaptable a otros tamaños de pantalla.

El historial pertenece únicamente a la partida actual: se borra al reiniciar el contador, iniciar una revancha o cambiar la cantidad de puntos.

## Cómo está pensada

QuieroReTruco busca resolver una sola tarea y hacerla bien. La pantalla principal mantiene el marcador como protagonista, mientras que las acciones secundarias —historial, sonido, información y reinicio— quedan disponibles en la barra superior sin ocupar espacio innecesario.

La aplicación no requiere cuentas, backend ni conexión permanente. El estado de la partida se guarda en `localStorage`, por lo que permanece disponible al cerrar o recargar la aplicación, pero nunca sale del dispositivo. No se conservan partidas anteriores ni se recopilan datos personales.

## Stack

- [React 19](https://react.dev/) para la interfaz.
- [TypeScript 6](https://www.typescriptlang.org/) para el tipado y el modelo de estado.
- [Vite 8](https://vite.dev/) para desarrollo y build.
- CSS nativo para estilos, animaciones y diseño responsive.
- Web Audio API para el feedback sonoro.
- Service Worker y Web App Manifest propios para la experiencia PWA y offline.
- Vercel Web Analytics para métricas de visitas.
- Vercel para el despliegue.

## Estructura del proyecto

```text
src/
├── components/        Componentes visuales reutilizables
├── hooks/useGame.ts   Estado, persistencia y reglas del contador
├── lib/feedback.ts    Sonido y vibración
├── App.tsx            Flujo principal, pantallas y modales
├── styles.css         Sistema visual y adaptación responsive
└── types.ts           Tipos del dominio

public/
├── icons/             Logo, favicon e íconos instalables
├── manifest.webmanifest
└── sw.js              Caché y soporte offline
```

La lógica de la partida vive en el hook `useGame`. Cada cambio válido de puntaje genera una entrada de historial y actualiza el estado persistido. Los componentes reciben ese estado y las acciones necesarias, manteniendo separadas la lógica del contador y su presentación.

## Desarrollo local

### Requisitos

- Node.js 22
- npm 10 o compatible

El repositorio incluye `.nvmrc`, por lo que con [nvm](https://github.com/nvm-sh/nvm) se puede seleccionar la versión correcta automáticamente:

```bash
nvm use
npm ci
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Para probar la aplicación desde un teléfono conectado a la misma red:

```bash
npm run dev -- --host
```

## Build de producción

```bash
npm run build
```

El resultado se genera en `dist/`. Para revisarlo localmente:

```bash
npm run preview
```

## Deploy en Vercel

El proyecto incluye un `vercel.json` listo para producción. Al importar el repositorio, Vercel utiliza:

- Instalación: `npm ci --no-audit --no-fund`
- Build: `npm run build`
- Directorio de salida: `dist`

No se necesitan variables de entorno ni servicios externos.

## Instalar en iPhone

1. Abrir la aplicación publicada desde Safari.
2. Tocar **Compartir**.
3. Elegir **Agregar a Inicio**.
4. Confirmar con **Agregar**.

Una vez cargada por primera vez, la aplicación puede abrirse sin conexión desde el ícono de la pantalla de inicio.

> Safari en iOS no expone la API web estándar de vibración. En iPhone, el feedback principal es visual y sonoro; en navegadores compatibles también se activa la vibración.

## Privacidad

QuieroReTruco funciona completamente del lado del cliente y no usa cookies de seguimiento, base de datos ni autenticación. La partida actual y la preferencia de sonido se almacenan únicamente en el navegador del usuario.

La aplicación utiliza Vercel Web Analytics para obtener métricas agregadas de visitas y uso del sitio. Esta medición no accede al marcador ni al historial de la partida.

## Licencia

Este proyecto se distribuye bajo la [Licencia MIT](LICENSE). Podés usarlo, modificarlo y distribuirlo libremente respetando sus condiciones.

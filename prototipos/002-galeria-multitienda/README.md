# 002 — Kuri Fashion: galería multitienda

**Estado:** prototipo interactivo verificable (sin backend). 11 de noviembre de 2026.

Inspirado en la navegación por columnas de [alanmenken.com](https://www.alanmenken.com/), con una adaptación propia para la plataforma de varias tiendas Kuri Fashion.

## Cómo probarlo

Abre [`index.html`](index.html) en tu navegador. El documento es autocontenido: incluye el CSS, JavaScript, fotografías y **12 microvídeos de demostración**. No necesita instalación ni servidor.

1. Pasa el cursor sobre una columna: se expande y empieza un clip en bucle.
2. Retira el cursor: vuelve a su tamaño original y el clip se pausa y reinicia.
3. Haz clic sobre una columna: se abre el perfil de la tienda correspondiente.
4. Entra en su selección: aparecerán tres imágenes editoriales de ejemplo.
5. Regresa a las tiendas o cambia a la vista de cuadrícula.
6. Prueba el menú y la experiencia en móvil; las rutas `#tienda/nomada`, `#tienda/trama`, `#tienda/relevo` y `#tienda/umbral` pueden abrirse directamente.

## Alcance y honestidad sobre el material

- **Las cuatro tiendas son ficticias**: Nómada, Trama, Relevo y Umbral.
- Los clips se han creado con un efecto de cámara suave a partir de fotografías generadas. No son grabaciones reales de productos o tiendas. Se sustituyen por vídeos autorizados de cada comercio cuando estén disponibles.
- Las imágenes ilustran una dirección artística: todavía no son un catálogo, no hay precios, stock, pagos, reservas ni logística.
- El clic **no lleva a otro repositorio de GitHub**, sino a la sección o perfil de una tienda dentro de la plataforma, que es el modelo comercial previsto.
- En móvil el hover se sustituye por selección táctil; la reproducción automática no es esencial para navegar.

## Verificación

Pruebas automatizadas locales con Playwright sobre Chromium a 1440×900 y 390×844: 12 columnas, 4 tarjetas de tiendas, inicio y pausa del vídeo en hover, navegación, regreso, cuadrícula y acceso directo por hash. Sin errores JavaScript detectados en esas pruebas. No equivale a una auditoría completa de accesibilidad o rendimiento.

## Evolución

El prototipo 001 queda intacto. Si seguimos evolucionando este concepto sin cambiar su esencia, registraremos los cambios mediante commits; para un diseño alternativo abriremos `003-...`.
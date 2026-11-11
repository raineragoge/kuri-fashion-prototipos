# 002 · Escaparates inmersivos / Kuri Fashion

**Estado:** prototipo interactivo de demostración, rediseñado el 11 de noviembre de 2026.  
**Referencia:** [Alan Menken](https://www.alanmenken.com/) (columnas que se expanden y reproducen vídeo al pasar el cursor), reinterpretada para una plataforma que reúne varias tiendas.

## Qué cambia frente a la versión 001

La 001 era una galería de 12 imágenes en un fondo claro. La 002 tiene **cuatro escaparates grandes**, un tratamiento editorial con alto contraste, una presentación mucho más clara de los cuatro comercios y un universo propio para cada tienda. No es una simple variación de los textos de la 001.

### Interacciones

- **Escritorio:** al pasar el cursor sobre un escaparate, la columna se expande, aumenta el protagonismo de la imagen y comienza un clip corto; al salir, el clip se pausa y el escaparate recupera su tamaño.
- **Clic:** abre la página de la tienda en la misma experiencia, con cabecera propia y tres productos conceptuales.
- **Móvil:** escaparates desplazables horizontalmente, sin depender del hover. Cada tarjeta abre su tienda.
- **Directorio:** cuatro tiendas con accesos independientes.
- **Menú:** navegación a portada, directorio y manifiesto.
- **Rutas:** `#tienda/nomada`, `#tienda/trama`, `#tienda/relevo` y `#tienda/umbral`.

## Cómo abrir

Descarga `index.html` y ábrelo en Chrome o Chromium. Es un **HTML autocontenido**, con imágenes y clips incluidos. No necesita npm ni un servidor. Si se incrusta en una página, debe permitirse la reproducción de vídeos silenciados.

## Qué hemos probado

Verificación local con Playwright + Chromium en resoluciones **1440 × 900** y **390 × 844**:

- Cuatro escaparates, cuatro entradas del directorio y tres productos en la tienda probada.
- Reproducción al hacer hover y pausa al salir (escritorio).
- Apertura de Trama, regreso a la portada y funcionamiento del menú.
- Sin desbordamiento horizontal de la página ni errores JavaScript detectados.

Las pruebas no sustituyen una auditoría completa de accesibilidad, rendimiento ni compatibilidad con todos los dispositivos.

## Contenido demostrativo

Las cuatro tiendas son **ficticias** y los productos no están a la venta. Los clips son *movimientos de cámara generados a partir de fotografías*: **no son grabaciones reales de tiendas**. Cuando tengamos contenido comercial autorizado, se deberán reemplazar. No se copió material de la web de Alan Menken.

**Conservación:** el prototipo 001 sigue disponible sin cambios en su propia carpeta.

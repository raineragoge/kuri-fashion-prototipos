# Kuri Fashion · 008 — Atlas fragmentado

Prototipo HTML independiente: abre `index.html` en un navegador moderno.

## Referencia y reinterpretación
Inspirado en la grabación Recordly aportada por el usuario de la web de Alan Menken: franjas fotográficas, contraste entre imagen atenuada/activa, navegación expansiva y composición fragmentada en transiciones. No utiliza imágenes, marcas ni contenidos de Alan Menken.

## Qué se puede probar
- Portada editorial con **siete columnas** que se expanden al hover/foco y abren una tienda distinta al hacer clic.
- En móvil, galería horizontal táctil con scroll snap; tocar abre la tienda.
- Composición editorial en seis fragmentos navegable con flechas.
- Menú oscuro expansivo y navegación por anclas.
- Siete escaparates con distintas identidades de color, selección de productos, selector de talla y bolsa compartida.
- Bolsa funcional de demostración: añadir/quitar artículos y subtotal, sin pasarela de pago.
- Adaptación responsive y soporte para `prefers-reduced-motion`.

## Limitaciones
- Los siete comercios, relatos, prendas y precios son **ficticios**. Es una prueba de concepto, no un marketplace listo para producción.
- Las fotografías se solicitan a Unsplash desde Internet; no están incluidas en el HTML para mantenerlo ligero. Conviene sustituirlas por material autorizado de comercios reales antes de publicar.
- No hay backend, autenticación, inventario ni compras reales. La bolsa se guarda únicamente en memoria durante la sesión.
- Los vídeos por columna quedan pendientes de contar con clips reales autorizados. Se usan fotografías en movimiento/transición, no se afirma que sean vídeos reales.
- Comprobaciones automáticas de UI recomendadas en escritorio y móvil; la usabilidad en dispositivos reales requiere una prueba física adicional.
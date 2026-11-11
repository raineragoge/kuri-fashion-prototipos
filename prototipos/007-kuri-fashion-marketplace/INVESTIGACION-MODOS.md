# Investigación de la portada de Alan Menken

Sesión Playwright en Microsoft Edge, 1440 × 900 y emulación iPhone 13, 11 de noviembre de 2026. Se esperó al final de la introducción audiovisual antes de medir la portada. Las capturas se tomaron de la página pública como referencia de estudio.

## Observado

- El botón circular de **barras verticales**, activo al entrar en escritorio, muestra diez columnas estrechas de imágenes distintas. Están escalonadas en tres alturas y hay espacio amplio sobre y bajo la composición. La imagen en reposo está velada; la interacción devuelve color y revela texto contextual.
- El botón circular de **rectángulo horizontal** sustituye ese mosaico por una sola obra. Una imagen continua aparece cortada en franjas verticales. Una franja vacía aloja el nombre de la obra en vertical; a izquierda y derecha hay enlaces para cambiar a la obra contigua. [Galería](tests/referencia-galeria.jpg) · [Obra única](tests/referencia-campana.jpg).
- Al pulsar un control, las columnas salientes se estrechan y se repliegan antes de que se abra la nueva composición. Durante la transición se reducen casi a líneas; la llegada es escalonada. El estado activo se indica con un trazo circular exterior.
- En el modo de obra única, las franjas comparten contenido visual. El texto lateral nombra las obras adyacentes. El clic en la obra lleva a su experiencia de vídeo; en Kuri Fashion se sustituye ese destino por la tienda.
- En emulación móvil, las columnas se presentan en un carrusel horizontal. La imagen centrada adquiere presencia y su rótulo aparece sin hover. Los dos controles circulares siguen bajo la composición. En el modo de obra única, las franjas continuas también se desplazan horizontalmente. [Mosaico móvil](tests/referencia-movil-galeria.jpg) · [Obra única móvil](tests/referencia-movil-campana.jpg).

## Adaptado en Kuri Fashion

- El modo galería mantiene la geometría y el tratamiento fotográfico de 005. El segundo modo ofrece campañas originales y diferenciadas para las cuatro marcas. La alternancia no toca el hash ni recarga la página.
- Se introdujo una secuencia CSS de revelado y replegado, con tiempos breves y desfases entre columnas. Cuando se solicita movimiento reducido, el cambio es inmediato y no arranca el vídeo.
- Las flechas laterales recorren las cuatro campañas. Una franja activa se amplía y desplaza sus vecinas; su vídeo es una demostración con movimiento sobre foto fija. La franja vuelve a reposo y el vídeo se pausa al perder foco.
- En móvil se conserva el barrido horizontal para las dos composiciones y se ofrecen controles accesibles para recorrer campañas. El destino de la fotografía siempre es un escaparate Kuri Fashion.

Las capturas y medidas describen lo observado en esa sesión. La recreación de Kuri sigue su lógica visual; sus fotografías, nombres, textos y transiciones son propios.

Comparación a 1440 × 900: [mosaico](tests/comparacion-galeria.jpg) · [campaña fragmentada](tests/comparacion-campana.jpg). Se conservan la franja fotográfica escalonada, el fondo claro y los controles centrados. La tipografía de la campaña, las flechas y el tratamiento de borde expresan las firmas de Kuri; el título general de la referencia se omite para mantener la portada limpia solicitada en iteraciones anteriores.

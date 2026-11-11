# Comparación visual y pruebas de Kuri Fashion 004

Playwright + Edge Chromium. Capturas de ambas portadas a **1440 × 900** y móvil emulado iPhone 13. La referencia se revisó de nuevo en esta fase, después de terminar su introducción audiovisual.

| Medida a 1440 × 900 | Alan Menken observado | Kuri Fashion 004 verificado |
|---|---:|---:|
| Columnas visibles | 10 | 10 |
| X iniciales | 90, 218, 346 … 1242 px | 90, 218, 346 … 1242 px |
| Y iniciales | 111, 141, 176 px, patrón repetido | 111, 141, 176 px, mismo patrón |
| Abertura en reposo | 108 px visibles | 108 px |
| Abertura activa | 216 px | 216 px |
| Tercera columna activa | X = 292 px | X = 292 px |
| Primera y cuarta durante ese hover | X = 36 y 528 px | X = 36 y 528 px |
| Retorno tras salir | Coordenadas iniciales | Coordenadas iniciales |

En la referencia, medí cajas DOM de 216 px para los medios incluso en reposo; el recorte visible era de unos 108 px. En Kuri el enlace de cada columna mide 108 px en reposo y 216 px activo. Las **aberturas visibles** y sus posiciones coinciden.

El texto de tienda está oculto en escritorio hasta el hover; se desvanece al salir. En móvil aparece para la columna seleccionada. A 390 px de ancho, la primera columna de Kuri comienza a X≈116 px y mide 159 px. En Alan Menken comienza a X≈115 px y mide 159 px. La segunda comienza a X≈283 px en ambos casos.

La tipografía de marca y la ausencia de un título permanente bajo la galería son decisiones propias de Kuri Fashion. Las imágenes muestran prendas independientes y son originales generadas con IA; los clips son simulaciones de movimiento. La referencia usa material audiovisual propio que no se reutilizó.

## Pruebas pasadas

- Diez columnas, geometría de reposo y hover, vuelta exacta, nombre visible solo en selección y clip activo pausado al salir.
- Clic desde imágenes de las cuatro tiendas, tres productos por tienda, «Ver selección» y retorno a portada.
- Categoría Abrigos y chaquetas con seis productos, ficha de Relevo y carrito compartido con artículos de Relevo y Casa Bies.
- Móvil: diez imágenes, selección por desplazamiento, rótulo de la tienda centrada y toque al escaparate.

Capturas: `reference-desktop.png`, `reference-hover.png`, `reference-mobile.png`, `004-desktop-rest.png`, `004-desktop-hover.png`, `004-mobile-first.png`, `004-mobile-selected.png` y `004-cart.png`.

Pendiente de comprobar en dispositivo físico: Safari/iOS y Android. Pendiente para producción: fotografía de prendas reales y vídeo rodado.

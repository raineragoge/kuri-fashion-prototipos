# Kuri Fashion 007 · diez firmas independientes

Desde esta carpeta, ejecutar `python -m http.server 8007` y abrir <http://localhost:8007/>. No requiere compilación. La versión 007 es independiente; 001–006 permanecen intactas.

## Qué incluye

- Diez columnas en la primera pantalla, una por firma. Se conservan la geometría, el espacio negativo, los controles circulares y los bordes fotográficos de 006. En hover, la columna se expande, desplaza a las vecinas, revela otra fotografía o un clip de demostración y muestra el nombre de la marca.
- Un segundo modo de campaña panorámica fragmentada. Las flechas recorren las diez firmas; cada uno de sus seis fragmentos muestra una fotografía **diferente** de la misma colección al activarse. El clic abre el escaparate correspondiente.
- Tres secuencias editoriales bajo la primera pantalla: campaña destacada, diálogo fotográfico entre firmas y selección transversal de productos. La primera impresión permanece despejada.
- Diez escaparates con portadas, marcas tipográficas, historias, secuencias de seis fotografías y catálogos propios. Las entradas y revelados al hacer scroll tienen ritmos diferentes según la identidad de cada firma.
- Categorías transversales, fichas con tallas demostrativas y bolsa única para productos de varios comercios. No hay pagos reales.

| Firma | Especialidad | Clave visual |
|---|---|---|
| Umbral | Underground | Lona, flash, negro mineral y tipografía condensada. |
| Casa Bies | Vestidos | Movimiento de seda, luz de atelier y serif cursiva. |
| Relevo | Vintage y segunda mano | Piel recuperada, papel de archivo y notas mecanografiadas. |
| Plano | Moda contemporánea unisex | Volumen, hormigón y retícula de patrón. |
| Vértice | Streetwear | Pista al amanecer, azul cobalto y diagonal roja. |
| Oficio | Sastrería | Lana azul tinta, taller y proporción precisa. |
| Trenza | Punto artesanal | Lana irregular, telar y luz de invierno. |
| Orilla | Lino contemporáneo | Piedra, brisa marina y composición abierta. |
| Sutura | Moda experimental | Prenda reconstruida, hilván rojo y cortes asimétricos. |
| Aro | Joyería de autor | Plata cepillada, piel y penumbra de galería. |

## Arquitectura de contenido

`data.js` contiene marcas, orden de portada, estado activo, identidad, historia, campañas, medios y productos. `app.js` contiene el router, los componentes y la bolsa; `seven.css` concentra la dirección visual de esta iteración. Para añadir una firma, se agrega un registro en `KURI_DATA.brands` y sus archivos en `assets/`; la galería y el carrusel leen la lista activa y ordenada. A partir de diez columnas, el mosaico se desplaza horizontalmente y aparece el control **Más firmas**.

Cada marca admite `enabled`, `order`, `home.poster`, `home.hoverImage`, `home.hoverVideo`, `campaigns[]`, `featuredCampaignId`, `collections[]`, `featuredCollectionId` y `products[]`. Cada fragmento de campaña tiene `poster`, `hoverImage` y `hoverVideo` opcional. Una colección enlaza una campaña con una lista de IDs de producto; se puede añadir y seleccionar desde los datos. Las categorías se asignan a cada producto mediante una lista de IDs y pueden reunir artículos de cualquier firma. El bloque editorial del home también se configura en `data.js`.

Los datos se definen en JavaScript para mantener el prototipo sin build ni CMS. La forma del registro está preparada para sustituirse por una API o un CMS; todavía no existe persistencia de inventario ni gestión de comercios.

## Medios y autenticidad

La iteración incorpora seis panorámicas nuevas, sesenta fotografías alternativas de campaña y dieciocho fotografías adicionales de producto. Son imágenes originales generadas con ImageGen para esta prueba. Las cuatro panorámicas y fotografías de producto previas se conservan. Los WebP están optimizados y las imágenes fuera de pantalla usan carga diferida; los vídeos usan `preload="none"`.

Los cuatro MP4 heredados del 006 son **movimientos simulados sobre fotografías fijas** y se señalan como demostración. No hay rodajes reales ni vídeo generado expresamente en 007: se priorizó una campaña fotográfica coherente antes que clips de procedencia o calidad dudosa. Los vídeos auténticos de 3–8 segundos por firma quedan pendientes. Las fuentes y prompts de los recursos están documentados en [ASSETS.md](ASSETS.md).

En una medición local con Playwright y Edge a 1440 × 900, la primera carga transfirió aproximadamente 1,34 MB en 22 recursos de `assets/`; `DOMContentLoaded` llegó a 294 ms. Son cifras de esta máquina y servidor local, no una promesa de producción.

## Verificación

Con Playwright para Python y Microsoft Edge, iniciar el servidor en el puerto 8007 y ejecutar `python tests/test_007.py`. La prueba comprueba las diez rutas, dos modos de portada, imágenes de hover distintas, reproducción y pausa de clips de demostración, entradas de marca, revelados al hacer scroll, secciones bajo el home, categorías, bolsa de varias firmas, móvil, teclado, movimiento reducido, ausencia de errores y un registro de una undécima marca inyectado sin cambiar `app.js`. Las capturas están en `tests/`.

Pendiente: comprobar tacto y rendimiento en dispositivos físicos y sustituir los clips simulados por rodajes propios o vídeos generados con calidad consistente. La investigación de los dos modos de Alan Menken que motivó 006 se conserva en [INVESTIGACION-MODOS.md](INVESTIGACION-MODOS.md).

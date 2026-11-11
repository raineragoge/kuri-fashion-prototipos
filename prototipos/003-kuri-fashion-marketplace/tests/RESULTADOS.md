# Resultado de la revisión del primer hito

Playwright con Edge Chromium, 1440 × 900 y emulación iPhone 13. Ejecución correcta.

- Portada de escritorio y móvil capturada tras cargar los cuatro recortes.
- Hover Umbral: anchura de la imagen principal 252 → 314 px, aumento visible de 62 px. Al retirar el cursor: 252 px.
- El MP4 comenzó a avanzar en hover y quedó pausado al salir.
- Umbral y Casa Bies abrieron sus rutas y mostraron tres piezas cada una.
- El enlace de regreso volvió a la portada. Se comprobó acceso directo a Umbral.
- Toque móvil abrió cada tienda. Capturas de portada y ambos escaparates.

Las fotografías son recortes de una lámina conceptual generada con IA. Los MP4 son simulaciones de movimiento sobre imágenes fijas. Safari/iOS y Android físicos quedan pendientes de verificación.

Para repetir las pruebas, instalar Playwright y ejecutar `python tests/test_interactions.py` desde el directorio del prototipo con el servidor local en el puerto 8000.

# Kuri Fashion 005

Desde este directorio, ejecutar `python -m http.server 8005` y abrir http://localhost:8005/.

## Portada e índice

En una sesión Playwright de escritorio (1440 × 900), el control superior de Alan Menken desplegó una navegación de 272 px sobre la galería. Al cerrarla, el panel volvió por encima del borde superior y la URL siguió siendo la de portada. [Captura de investigación](tests/referencia-menu.jpg).

En Kuri, **Firmas** abre un índice retráctil con un retrato y la firma tipográfica de cada tienda. El panel permite entrar directamente al escaparate o explorar por categoría. Escape cierra el índice y devuelve el foco al botón. Las diez columnas conservan el ritmo de 004. Una textura de alfa original combina fibra clara, pigmento tostado y un velo ámbar irregular en los primeros píxeles del borde. Su orientación e intensidad varían entre copias. La textura se compone encima de la fotografía y del vídeo.

## Cuatro portadas de marca

| Firma | Edición | Decisión visual |
|---|---|---|
| Umbral | Turno de noche | Cartel de fondo carbón, retrato a flash, mayúsculas condensadas y ampliación del herraje. |
| Casa Bies | Estudio del giro | Figura entera, cursiva alta, luz lateral y un segundo encuadre bajo para leer el vuelo del vestido. |
| Relevo | Cuaderno de hallazgos | Fotografías con margen de papel, anotaciones mecanografiadas y una ficha de conservación junto a la piel reparada. |
| Plano | Patrón abierto | Retícula de construcción, palo seco, abrigo de volumen recto y un detalle del hombro dentro de su propia celda. |

Los precios y las tallas son demostrativos. Las fotografías son conceptos generados con IA. Los MP4 de portada son demostraciones a partir de imágenes fijas.

## Verificación

Con el servidor en el puerto 8005, Playwright para Python y Edge instalados, ejecutar `python tests/test_005.py`. Se comprobó en escritorio el rótulo en reposo, la expansión a 216 px, la reproducción del clip, el retorno de geometría, el clic de imagen, el índice, Escape y la restauración del foco. Desde el índice se recorrieron las cuatro marcas, sus selecciones y las fichas hasta obtener una bolsa de cuatro comercios. En emulación iPhone 13 se verificaron la selección centrada, la entrada táctil al escaparate y el acceso a categorías. Queda pendiente la prueba en teléfonos físicos. [Capturas](tests/).

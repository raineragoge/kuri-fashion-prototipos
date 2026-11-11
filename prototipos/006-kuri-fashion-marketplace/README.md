# Kuri Fashion 006 · dos lecturas de una portada

Desde este directorio, ejecutar `python -m http.server 8006` y abrir <http://localhost:8006/>. No requiere compilación.

La versión 006 preserva 001–005. La portada mantiene la galería de diez columnas fotográficas del 005 y añade el segundo modo observado en [Alan Menken](https://www.alanmenken.com/): una sola campaña repartida en franjas verticales con hueco tipográfico y navegación lateral. Los dos controles circulares viven en el centro inferior; el cambio mantiene la ruta y alterna salida, reorganización y entrada de las franjas. No aparece ningún titular comercial permanente sobre el mosaico. La marca se revela al activar una columna; en móvil, al centrarla.

El segundo modo usa una panorámica original para cada tienda. Las seis franjas recomponen una única fotografía, y el nombre de la firma ocupa un vacío dentro de ella. Las flechas cambian de campaña sin cambiar de ruta. Pulsar una franja o la firma abre el escaparate correspondiente. En ambos modos el hover amplía la franja, desplaza a las vecinas y muestra un MP4 demostrativo; al salir, pausa el vídeo y restituye la composición. Los MP4 simulan movimiento a partir de fotografías fijas, no son rodajes reales.

## Cuatro firmas

| Firma | Dirección 006 |
|---|---|
| Umbral | Retrato bajo paso de hormigón, cartel a modo de uniforme nocturno, negro mineral y rótulo condensado. |
| Casa Bies | Campaña en atelier con giro del vestido, nota de taller, composición aireada y serif cursiva. |
| Relevo | Fotografía de hallazgo en arcada, ficha punteada de archivo, papel y huellas de uso. |
| Plano | Figura en arquitectura brutalista, lectura de patrón en retícula y tipografía de construcción. |

Cada escaparate conserva navegación, selección, fichas y bolsa comunes. Las cuatro secciones de campaña usan composiciones y lenguaje editorial diferentes. Las imágenes son conceptos originales generados con IA; las panorámicas WebP ocupan aproximadamente 175–310 KB cada una. Ningún recurso de Alan Menken se utiliza en la web. Los precios y tallas son demostrativos, sin cobro real.

Los recursos nuevos y sus prompts figuran en [ASSETS.md](ASSETS.md).

## Investigación y prueba

La comparación observada y las decisiones de adaptación están en [INVESTIGACION-MODOS.md](INVESTIGACION-MODOS.md). Las capturas de referencia incluidas allí son documentación visual y no recursos del sitio.

Con Playwright para Python y Microsoft Edge instalados, ejecutar `python tests/test_006.py` mientras el servidor funciona en el puerto 8006. La prueba cubre modos, animaciones, hover, vídeo, ida y vuelta, las cuatro tiendas, productos, bolsa, móvil, teclado y movimiento reducido. Las capturas nuevas están en `tests/`. Queda pendiente verificar el tacto y el rendimiento en teléfonos físicos.

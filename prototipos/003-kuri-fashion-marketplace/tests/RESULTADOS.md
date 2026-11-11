# Revisión del primer hito

Playwright con Edge Chromium, escritorio de 1440 × 900 y emulación iPhone 13. Todas las aserciones pasaron.

- «Ver selección» desplaza el catálogo de Umbral y Casa Bies dentro de la tienda. La URL conserva `#/tienda/umbral` o `#/tienda/bies` en escritorio y móvil.
- La portada y los enlaces de regreso funcionan en ambos tamaños. También se verificó la entrada directa a Umbral.
- Cada tienda muestra tres piezas. Umbral dispone un retrato amplio con la cremallera superpuesta, título condensado y catálogo compacto. Casa Bies sitúa el vestido a la derecha, el detalle entre foto y texto, título en cursiva y catálogo con mayor espacio.
- Hover Umbral: imagen principal 252 → 314 px; tras salir, 252 px. El MP4 se reproduce al entrar y se pausa al salir.

Capturas nuevas: `08-tienda-umbral-revisada.png`, `09-tienda-casa-bies-revisada.png`, `10-umbral-movil-revisada.png` y `11-casa-bies-movil-revisada.png`. Las capturas de portada y hover se regeneraron con la misma prueba.

Las fotos siguen siendo recortes de la lámina conceptual de fase 1 generada con IA. Los MP4 simulan movimiento sobre imágenes fijas. La prueba móvil emplea emulación Chromium; Safari/iOS y Android físicos siguen pendientes.

Para repetir la prueba, instalar Playwright, servir este directorio en `http://localhost:8000/` y ejecutar `python tests/test_interactions.py`.

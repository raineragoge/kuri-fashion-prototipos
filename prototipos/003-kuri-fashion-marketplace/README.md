# Kuri Fashion 003 · Segundo hito

Marketplace de demostración con cuatro escaparates independientes: Umbral, Casa Bies, Relevo y Plano. La portada conserva su galería editorial de silueta y detalle. Las rutas comparten navegación, categorías, ficha de producto y bolsa.

## Ejecutar

Desde este directorio:

```bash
python -m http.server 8000
```

Abrir http://localhost:8000/.

## Recorrido

- Portada: hover con expansión y clip silenciado; clic o toque abre la tienda. En móvil, la galería se desliza horizontalmente.
- Tiendas: cada escaparate muestra tres piezas y «Ver selección» desplaza al catálogo manteniendo la ruta.
- Categorías: Abrigos y chaquetas, Vestidos, Accesorios, Vintage y segunda mano. Una pieza puede figurar en varias categorías y el listado reúne varias tiendas.
- Fichas: imagen, nombre, precio, descripción y tallas S, M y L de demostración.
- Bolsa: admite piezas de diferentes tiendas, suma cantidades y permite quitar productos. Se guarda en el navegador con localStorage. No hay pagos ni reservas reales.

Las fotografías son conceptos generados con IA y recortados para este prototipo. Los MP4 son **simulaciones de movimiento sobre imágenes fijas**, no vídeos rodados. Los nombres, productos, precios y tallas son datos de muestra. Algunas fotos se repiten entre fichas de una misma tienda hasta contar con un catálogo fotografiado.

Las pruebas Playwright están en `tests/test_interactions.py` y `tests/test_second_milestone.py`. Sus capturas y resultados están en `tests/`. Para ejecutarlas, instalar Playwright con el navegador Edge o adaptar el canal, iniciar el servidor en el puerto 8000 y ejecutar ambos archivos con Python.

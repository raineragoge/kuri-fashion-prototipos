# Kuri Fashion 004

Portada de diez columnas verticales con composición y comportamiento contrastados con la página principal de Alan Menken. Cada imagen abre la tienda correspondiente. Los escaparates de Umbral, Casa Bies, Relevo y Plano, las categorías, las fichas y el carrito proceden de Kuri Fashion 003 y siguen funcionando dentro de este prototipo independiente.

## Ejecutar

Desde este directorio:

```bash
python -m http.server 8004
```

Abrir http://localhost:8004/.

## Portada

- Escritorio: diez imágenes de 108 × 487 px, dispuestas a tres alturas y separadas por 20 px a 1440 × 900. El hover amplía la columna a 216 px y desplaza las vecinas 54 px a cada lado. El nombre aparece al activar una imagen y se desvanece al retirarse.
- Móvil: primera imagen centrada y ensanchada, con la siguiente visible. El desplazamiento horizontal selecciona la imagen más cercana al centro y muestra su tienda. Un toque abre el escaparate.
- Todas las columnas utilizan imágenes originales generadas para Kuri Fashion. Los MP4 son **simulaciones de movimiento sobre fotografías**, no vídeo rodado. Los recursos utilizados por la referencia permanecen fuera del prototipo.

Los productos, precios y tallas son demostrativos. El carrito se guarda en `localStorage`. No hay pagos, reservas ni stock real.

## Verificación

`tests/test_004.py` comprueba composición, hover, nombre, vídeo, retorno, cuatro tiendas, categoría, ficha, carrito y móvil con Playwright. Requiere Edge Chromium y un servidor local en el puerto 8004. Las capturas de comparación y resultados están en `tests/`.

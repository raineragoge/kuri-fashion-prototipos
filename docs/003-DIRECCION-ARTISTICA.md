# Kuri Fashion 003 — Dirección artística y ejecución

**Estado:** fase 1 preparada; pendiente de auditoría interactiva de la referencia con Playwright y propuesta visual.

**Rama de trabajo:** `feature/003-kuri-fashion-marketplace`  
**Carpeta final del prototipo:** `prototipos/003-kuri-fashion-marketplace/`  
**Referencia prioritaria:** https://www.alanmenken.com/

## 1. Concepto comercial

Kuri Fashion es un **marketplace multimarca** para tiendas de moda independientes. La portada es una galería colectiva de descubrimiento. Se debe poder explorar por **tienda**, por **categoría de ropa** y por **producto**. Una tienda puede vender productos en varias categorías; una categoría puede reunir productos de muchas tiendas.

El usuario permanece en una plataforma común con navegación, ficha de producto y carrito compartidos. Los escaparates tienen personalidad propia en función de su ropa y clientela (por ejemplo underground frente a vestidos), sin convertirse en sitios ajenos.

## 2. Dirección artística: criterios no negociables

Inspirarse en la página principal de Alan Menken **en composición y microinteracciones**, sin copiar su identidad ni sus medios.

- Inicio luminoso y editorial, con fondo blanco cálido o marfil, fotografías desaturadas de distintas alturas y columnas estrechas con ritmo visual irregular pero deliberado.
- Mucho espacio negativo; tipografía discreta y sofisticada; sin landing genérica de encabezados gigantes ni tarjetas convencionales.
- **Hover:** columna se expande poco, vídeo corto se reproduce silenciado; al salir, vídeo se pausa y columna vuelve exactamente a su geometría anterior.
- **Clic:** NO abrir vídeo fullscreen; abrir el escaparate de la tienda correspondiente en la misma experiencia. Una columna de categoría puede enlazar a esa categoría.
- **Móvil:** decisión deliberada de interacción táctil sin depender del hover; swipe o scroll horizontal cuando sea apropiado.
- Respetar `prefers-reduced-motion`, teclado y foco visible.
- Usar fotos/vídeos propios o con licencia. Si solo hay animaciones tipo Ken Burns sobre una imagen, etiquetarlas como **simulación de movimiento**, no como vídeo real.

## 3. Tiendas versus categorías

Demo sugerida con cuatro escaparates de estilos reconocibles:
- Tienda de moda underground/streetwear — identidad gráfica urbana.
- Tienda centrada en vestidos — identidad delicada/editorial.
- Tienda de vintage/segunda mano — narrativa de archivo y texturas analógicas.
- Tienda contemporánea/unisex — composición minimalista/arquitectónica.

Estos son ejemplos comerciales, no una taxonomía obligatoria ni una restricción de categorías para las tiendas.

En el diseño, diferenciar tiendas **por composición, fotografía, tipo de producto y tono**, no solo por paleta.

## 4. Estrategia de modelos y fases

### Fase 1 — Dirección artística / auditoría (Astra, Medium si disponible)
- Abrir la web de referencia con navegador automatizado/Playwright.
- Probar hover, salida del cursor, clic, scroll, menú, transiciones y táctil/móvil.
- Registrar solo comportamientos realmente observados, con capturas o trazas.
- Proponer una única dirección artística convincente y un mapa de navegación, **sin implementar todavía la web completa**.
- Entregable: breve informe con comportamiento observado, decisiones visuales, wireframe de portada + dos ejemplos contrastados de tienda, riesgos y plan de pruebas.
- Validación: el informe distingue lo observado, lo supuesto y lo pendiente.

### Fase 2 — Desarrollo (Sol, Medium)
- Crear `prototipos/003-kuri-fashion-marketplace/` en esta rama.
- Primer hito comprobable: portada interactiva y entrada a **dos tiendas realmente diferentes**, catálogo breve, navegación de vuelta.
- Segundo hito: cuatro tiendas, categorías cruzadas, ficha de producto, carrito de demo y móvil.
- Evitar recodificar todo o crear diseños radicales sin revisión de capturas del primer hito.
- Sin pagos ni stock real.

### Fase 3 — QA y pequeños ajustes (Terra o Luna, Low/Medium)
- Playwright: comprobar layout escritorio/móvil, entrada/salida hover, play/pause vídeo, clic a tienda, filtros, producto, carrito y retorno a portada.
- Comparar screenshots con la referencia solo en composición e interacción (no pixel-perfect ni reutilización de imágenes ajenas).
- Corregir fallos concretos e informar de límites comprobables.
- Actualizar README del prototipo e índice raíz solo cuando funcione.

## 5. Reglas del repositorio

- Mantener intactos `prototipos/001-galeria-editorial/` y `prototipos/002-galeria-multitienda/`.
- Trabajar en rama `feature/003-kuri-fashion-marketplace`, sin modificar directamente `main`.
- No utilizar los prototipos 001 o 002 como referencia visual obligatoria.
- Separar recursos, componentes, datos de demostración y tests cuando aporte claridad.
- Documentar qué es real, qué es simulado y qué se ha verificado.

## 6. Criterio principal de éxito

**No buscamos otra landing bonita**. Queremos un escaparate colectivo que recuerde por su ritmo y sus interacciones a la referencia, y que al entrar en un comercio comunique inmediatamente una familia de moda distinta, sin abandonar la experiencia de un único marketplace.

const stores = {
  umbral: {
    name: "Umbral", kind: "Underground / prendas con peso", number: "01",
    intro: "Ropa para atravesar la ciudad.", note: "Lona lavada, metal gastado y siluetas que dejan espacio al cuerpo.",
    products: [
      ["Chaqueta de lona lavada", "Lona de algodón · grafito", "168 €", "umbral-look.webp"],
      ["Pieza de archivo 01", "Costuras y metal", "92 €", "umbral-detail.webp"],
      ["Chaqueta Umbral", "Corte amplio · edición corta", "184 €", "umbral-look.webp"]
    ]
  },
  bies: {
    name: "Casa Bies", kind: "Vestidos / movimiento y caída", number: "02",
    intro: "Vestidos que siguen el movimiento.", note: "Cortes al bies, luz de taller y tejidos que encuentran su forma al andar.",
    products: [
      ["Vestido al bies", "Rosa empolvado · largo", "215 €", "bies-look.webp"],
      ["Estudio del dobladillo", "Tejido ligero · rosa", "138 €", "bies-detail.webp"],
      ["Vestido de taller", "Espalda abierta · edición corta", "240 €", "bies-look.webp"]
    ]
  },
  relevo: {
    name: "Relevo", kind: "Vintage / piezas con historia", number: "03",
    intro: "La ropa guarda otras vidas.", note: "Hallazgos de segunda mano, piel marcada por el tiempo y prendas listas para volver a salir.",
    products: [
      ["Blazer de piel recuperada", "Piel vintage · caramelo", "126 €", "relevo-look.webp"],
      ["Pañuelo de archivo", "Seda estampada · segunda mano", "34 €", "relevo-detail.webp"],
      ["Chaqueta setenta", "Pieza única · revisada", "112 €", "relevo-look.webp"]
    ]
  },
  plano: {
    name: "Plano", kind: "Contemporánea / unisex", number: "04",
    intro: "Formas para todos los cuerpos.", note: "Volúmenes precisos, hombros definidos y prendas concebidas para durar más de una temporada.",
    products: [
      ["Abrigo de estructura", "Algodón técnico · crudo", "228 €", "plano-look.webp"],
      ["Estudio de hombro", "Línea unisex · algodón", "96 €", "plano-detail.webp"],
      ["Sobrecamisa modular", "Corte amplio · unisex", "154 €", "plano-look.webp"]
    ]
  }
};
const categories = {
  abrigos: "Abrigos y chaquetas",
  vestidos: "Vestidos",
  accesorios: "Accesorios",
  archivo: "Vintage y segunda mano"
};
const productCategories = {
  "umbral-0": ["abrigos"], "umbral-1": ["accesorios"], "umbral-2": ["abrigos"],
  "bies-0": ["vestidos"], "bies-1": ["vestidos", "accesorios"], "bies-2": ["vestidos"],
  "relevo-0": ["abrigos", "archivo"], "relevo-1": ["accesorios", "archivo"], "relevo-2": ["abrigos", "archivo"],
  "plano-0": ["abrigos"], "plano-1": ["accesorios"], "plano-2": ["abrigos"]
};
const allProducts = Object.entries(stores).flatMap(([storeId, store]) =>
  store.products.map((item, index) => ({ id: `${storeId}-${index}`, storeId, item, categories: productCategories[`${storeId}-${index}`] }))
);
const app = document.getElementById("app");
const assets = "assets/";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let lastStore = null;
let homeScroll = 0;
let activeVideo = null;
let cart = JSON.parse(localStorage.getItem("kuri-cart") || "[]");
function productCard(product, index) {
  const [name, description, price, image] = product.item;
  return `<article class="product product-${index + 1}"><a class="product-image" href="#/producto/${product.id}" aria-label="Ver ${name}"><img src="${assets}${image}" alt="${name}" loading="lazy"></a><div class="product-meta"><div><h3><a href="#/producto/${product.id}">${name}</a></h3><p>${stores[product.storeId].name} · ${description}</p></div><span>${price}</span></div></article>`;
}
function updateCartCount() {
  document.querySelector(".cart-count").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function saveCart() {
  localStorage.setItem("kuri-cart", JSON.stringify(cart));
  updateCartCount();
}

const galleryImages = [
  ["umbral", "umbral-alt"], ["relevo", "relevo-look"],
  ["plano", "plano-alt"], ["bies", "bies-alt"],
  ["relevo", "relevo-alt"], ["bies", "bies-look"],
  ["plano", "plano-look"], ["umbral", "umbral-look"],
  ["bies", "bies-detail"], ["plano", "plano-detail"]
];
let selectedColumn = null;
let mobileColumn = 0;
let labelResetTimer;
let homeMode = "gallery";
let featureIndex = 0;
let modeTimer;
const featureOrder = ["umbral", "bies", "relevo", "plano"];
const featureTitles = {
  umbral: "Turno de noche", bies: "Estudio del giro",
  relevo: "Cuaderno de hallazgos", plano: "Patrón abierto"
};
function strip([storeId, image], index) {
  const video = `${image}.mp4`;
  return `<a class="gallery-strip" href="#/tienda/${storeId}" data-index="${index}" data-store="${storeId}" style="--i:${index};left:${index * 128}px;top:${[0,30,65,30,0,65,30,0,65,0][index]}px" aria-label="Entrar en ${stores[storeId].name}"><img src="${assets}${image}.webp" alt="" width="216" height="487"><video muted loop playsinline preload="none" data-src="${assets}${video}" aria-hidden="true"></video></a>`;
}
function galleryScale() {
  document.documentElement.style.setProperty("--gallery-scale", Math.min(1, (innerWidth - 40) / 1260, innerHeight / 900));
}
function featureMarkup() {
  const id = featureOrder[featureIndex];
  const previous = featureOrder[(featureIndex + featureOrder.length - 1) % featureOrder.length];
  const next = featureOrder[(featureIndex + 1) % featureOrder.length];
  return `<div class="feature-view" aria-label="Campaña de ${stores[id].name}">
    <button class="feature-arrow previous" type="button" data-step="-1" aria-label="Campaña anterior: ${stores[previous].name}"><span>${stores[previous].name}</span><b aria-hidden="true">⟵</b></button>
    <div class="feature-stage" style="--campaign:url('${assets}${id}-panorama.webp')">
      ${[0,1,2,3,4,6].map((slice, index) => `<a class="feature-slice" href="#/tienda/${id}" style="--i:${index};--slice:${slice};--rise:${[0,30,20,-10,20,-10][index]}px" aria-label="Entrar en ${stores[id].name}"><span class="feature-poster"></span><video muted loop playsinline preload="none" data-src="${assets}${id}-look.mp4" aria-hidden="true"></video></a>`).join("")}
      <a class="feature-wordmark feature-wordmark-${id}" href="#/tienda/${id}" aria-label="Entrar en ${stores[id].name}"><strong>${stores[id].name}</strong><small>${featureTitles[id]}<span aria-hidden="true"> ↗</span></small></a>
    </div>
    <button class="feature-arrow next" type="button" data-step="1" aria-label="Campaña siguiente: ${stores[next].name}"><span>${stores[next].name}</span><b aria-hidden="true">⟶</b></button>
  </div>`;
}
function bindFeature() {
  const layer = app.querySelector('.feature-layer');
  layer.querySelectorAll('.feature-arrow').forEach(button => button.addEventListener('click', () => changeFeature(Number(button.dataset.step))));
  layer.querySelectorAll('.feature-slice').forEach(slice => {
    slice.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') activateFeatureSlice(slice); });
    slice.addEventListener('pointerleave', () => clearFeatureSlice(slice));
    slice.addEventListener('focus', () => activateFeatureSlice(slice, false));
    slice.addEventListener('blur', () => clearFeatureSlice(slice));
    slice.addEventListener('click', () => { lastStore = featureOrder[featureIndex]; clearVideo(); });
  });
  layer.querySelector('.feature-wordmark').addEventListener('click', () => { lastStore = featureOrder[featureIndex]; clearVideo(); });
}
function activateFeatureSlice(slice, play = true) {
  clearVideo();
  const stage = slice.closest('.feature-stage');
  stage.classList.add('has-focus');
  const slices = [...stage.querySelectorAll('.feature-slice')];
  const current = slices.indexOf(slice);
  slices.forEach((item, index) => {
    const base = Number(item.style.getPropertyValue('--slice')) * (matchMedia('(max-width:700px)').matches ? 96 : 160);
    item.style.left = `${base + (index < current ? -32 : index > current ? 32 : -32)}px`;
  });
  slice.classList.add('active');
  if (!play || reduceMotion.matches) return;
  const video = slice.querySelector('video');
  activeVideo = video;
  if (!video.src) video.src = video.dataset.src;
  video.play().then(() => { if (activeVideo === video) slice.classList.add('playing'); }).catch(() => {});
}
function clearFeatureSlice(slice) {
  clearVideo();
  slice.classList.remove('active');
  const stage = slice.closest('.feature-stage');
  stage?.classList.remove('has-focus');
  stage?.querySelectorAll('.feature-slice').forEach(item => item.style.removeProperty('left'));
}
function changeFeature(step) {
  if (modeTimer) return;
  const layer = app.querySelector('.feature-layer');
  layer.classList.remove('entering');
  layer.classList.add('exiting');
  clearVideo();
  modeTimer = setTimeout(() => {
    featureIndex = (featureIndex + step + featureOrder.length) % featureOrder.length;
    layer.innerHTML = featureMarkup();
    const mobileTitle = app.querySelector('.mobile-feature-title');
    if (mobileTitle) {
      mobileTitle.textContent = stores[featureOrder[featureIndex]].name;
      mobileTitle.href = `#/tienda/${featureOrder[featureIndex]}`;
    }
    bindFeature();
    layer.classList.remove('exiting');
    layer.classList.add('entering');
    modeTimer = null;
  }, reduceMotion.matches ? 0 : 260);
}
function switchMode(next) {
  if (next === homeMode || modeTimer) return;
  clearVideo();
  const current = app.querySelector(`.${homeMode}-layer`);
  const incoming = app.querySelector(`.${next}-layer`);
  current.classList.remove('entering');
  current.classList.add('exiting');
  modeTimer = setTimeout(() => {
    current.hidden = true;
    current.setAttribute('aria-hidden', 'true');
    current.classList.remove('exiting');
    incoming.hidden = false;
    incoming.removeAttribute('aria-hidden');
    incoming.classList.add('entering');
    homeMode = next;
    app.querySelectorAll('.mode-control').forEach(button => {
      const active = button.dataset.mode === next;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (next === 'gallery' && matchMedia('(max-width:700px)').matches) setActiveColumn(mobileColumn, false);
    modeTimer = null;
  }, reduceMotion.matches ? 0 : 260);
}
function home() {
  document.title = "Kuri Fashion — Tiendas independientes";
  document.body.dataset.page = "home";
  app.innerHTML = `<section class="home home-004 home-006" aria-label="Tiendas independientes">
    <div class="gallery-layer mode-layer ${homeMode === 'gallery' ? 'entering' : ''}" ${homeMode === 'gallery' ? '' : 'hidden aria-hidden="true"'}><div class="gallery-004" aria-label="Galería de tiendas">${galleryImages.map(strip).join("")}</div><div class="home-label" aria-live="polite"><span class="home-eyebrow"></span><h1></h1><p></p></div></div>
    <div class="feature-layer mode-layer ${homeMode === 'feature' ? 'entering' : ''}" ${homeMode === 'feature' ? '' : 'hidden aria-hidden="true"'}>${featureMarkup()}</div>
    <a class="mobile-feature-title" href="#/tienda/${featureOrder[featureIndex]}">${stores[featureOrder[featureIndex]].name}</a>
    <nav class="mobile-feature-nav" aria-label="Cambiar campaña"><button type="button" data-step="-1" aria-label="Campaña anterior">← Anterior</button><button type="button" data-step="1" aria-label="Campaña siguiente">Siguiente →</button></nav>
    <div class="mode-switch" role="group" aria-label="Visualización de la portada"><button class="mode-control ${homeMode === 'feature' ? 'selected' : ''}" type="button" data-mode="feature" aria-label="Ver una campaña fragmentada" aria-pressed="${homeMode === 'feature'}"><i class="mode-icon-panorama" aria-hidden="true"></i></button><button class="mode-control ${homeMode === 'gallery' ? 'selected' : ''}" type="button" data-mode="gallery" aria-label="Ver galería de marcas" aria-pressed="${homeMode === 'gallery'}"><i class="mode-icon-columns" aria-hidden="true"></i></button></div>
  </section>`;
  app.querySelectorAll('.mode-control').forEach(button => button.addEventListener('click', () => switchMode(button.dataset.mode)));
  app.querySelectorAll('.mobile-feature-nav button').forEach(button => button.addEventListener('click', () => changeFeature(Number(button.dataset.step))));
  bindFeature();
  galleryScale();
  const gallery = app.querySelector(".gallery-004");
  gallery.querySelectorAll(".gallery-strip").forEach((column, index) => {
    column.addEventListener("pointerenter", event => {
      if (event.pointerType !== "touch" && !matchMedia("(max-width:700px)").matches) setActiveColumn(index, true);
    });
    column.addEventListener("focus", () => setActiveColumn(index, false));
    let startX = 0;
    let dragged = false;
    column.addEventListener("touchstart", event => { startX = event.touches[0].clientX; dragged = false; }, { passive: true });
    column.addEventListener("touchmove", event => { if (Math.abs(event.touches[0].clientX - startX) > 10) dragged = true; }, { passive: true });
    column.addEventListener("click", event => {
      if (dragged) { event.preventDefault(); return; }
      lastStore = column.dataset.store;
      homeScroll = gallery.scrollLeft;
      clearVideo();
    });
  });
  gallery.addEventListener("focusout", event => {
    if (!gallery.contains(event.relatedTarget) && !matchMedia("(max-width:700px)").matches) setActiveColumn(null, false);
  });
  gallery.addEventListener("pointerleave", event => {
    if (event.pointerType !== "touch" && !matchMedia("(max-width:700px)").matches) setActiveColumn(null, false);
  });
  let scrollTimer;
  gallery.addEventListener("scroll", () => {
    if (!matchMedia("(max-width:700px)").matches) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = innerWidth / 2;
      const distances = [...gallery.children].map(item => Math.abs(item.getBoundingClientRect().left + item.getBoundingClientRect().width / 2 - center));
      mobileColumn = distances.indexOf(Math.min(...distances));
      setActiveColumn(mobileColumn, false);
    }, 80);
  }, { passive: true });
  if (matchMedia("(max-width:700px)").matches) {
    setActiveColumn(mobileColumn, false);
    requestAnimationFrame(() => { gallery.scrollLeft = homeScroll; });
  }
}
function clearVideo() {
  if (!activeVideo) return;
  activeVideo.pause();
  activeVideo.currentTime = 0;
  activeVideo.parentElement.classList.remove("playing");
  activeVideo = null;
}
function setActiveColumn(index, play) {
  const gallery = app.querySelector(".gallery-004");
  if (!gallery) return;
  clearVideo();
  selectedColumn = index;
  gallery.querySelectorAll(".gallery-strip").forEach((column, i) => {
    const offset = index === null ? 0 : i < index ? -54 : i > index ? 54 : -54;
    column.style.left = `${i * 128 + offset}px`;
    column.classList.toggle("active", i === index);
  });
  const label = app.querySelector(".home-label");
  const store = index === null ? null : stores[galleryImages[index][0]];
  clearTimeout(labelResetTimer);
  label.classList.toggle("visible", Boolean(store));
  if (store) {
    label.querySelector(".home-eyebrow").textContent = "Explorar tienda";
    label.querySelector("h1").textContent = store.name;
    label.querySelector("p").textContent = "";
  } else {
    labelResetTimer = setTimeout(() => {
      label.querySelector(".home-eyebrow").textContent = "";
      label.querySelector("h1").textContent = "";
      label.querySelector("p").textContent = "";
    }, 380);
  }
  if (play && store && !reduceMotion.matches) {
    const column = gallery.children[index];
    const video = column.querySelector("video");
    activeVideo = video;
    if (!video.src) video.src = video.dataset.src;
    video.currentTime = 0;
    video.play().then(() => { if (activeVideo === video) column.classList.add("playing"); }).catch(() => {});
  }
}
addEventListener("resize", galleryScale);
const editions = {
  umbral: { title: "Turno de noche", text: "Lona y metal bajo el flash. Una chaqueta amplia, hecha para llevar otra capa debajo.", caption: "Lona lavada / herraje oxidado", collection: "El vestuario" },
  bies: { title: "Estudio del giro", text: "Cortamos en diagonal para que la falda acompañe el paso. La espalda abierta deja ver dónde empieza el pliegue.", caption: "El vuelo del bajo", collection: "Los vestidos" },
  relevo: { title: "Cuaderno de hallazgos", text: "Elegimos esta piel por sus marcas de uso. El botón antiguo y la costura reparada forman parte de la pieza.", caption: "Ficha de archivo · piel y latón", collection: "Piezas recuperadas" },
  plano: { title: "Patrón abierto", text: "Un hombro desplazado y un cuerpo recto dan volumen al abrigo. El mismo patrón admite distintas formas de llevarlo.", caption: "Detalle de construcción / hombro", collection: "Serie de prendas" }
};
const brandIndex = document.querySelector("#brand-index");
document.querySelector("#brand-links").innerHTML = Object.entries(stores).map(([id, brand]) =>
  `<a class="signature s-${id}" href="#/tienda/${id}"><img src="${assets}${id}-alt.webp" alt=""><span>${brand.name}</span></a>`
).join("");
document.querySelector("#open-index").addEventListener("click", () => {
  clearVideo();
  brandIndex.showModal();
});
brandIndex.addEventListener("click", event => {
  if (event.target.closest("a") || event.target === brandIndex && event.clientY > brandIndex.getBoundingClientRect().bottom) brandIndex.close();
});
function brandSpread(id) {
  const brand = stores[id];
  const edition = editions[id];
  return `<section class="spread spread-${id}">
    <header class="imprint"><h1 id="store-title" tabindex="-1">${brand.name}</h1><h2>${edition.title}</h2></header>
    <img class="campaign" src="${assets}${id}-${id === "relevo" ? "look" : "alt"}.webp" alt="${brand.name}, ${edition.title}">
    <figure class="sample"><img src="${assets}${id}-detail.webp" alt=""><figcaption>${edition.caption}</figcaption></figure>
    <div class="editorial"><p>${edition.text}</p><button type="button" class="collection-link">Ver selección ↓</button></div>
  </section>`;
}
function brandInterlude(id) {
  const details = {
    umbral: ["UMB / 01", "HECHO PARA LA NOCHE", "El uniforme cambia cuando la ciudad se vacía."],
    bies: ["Casa Bies", "EL MOVIMIENTO ES EL PATRÓN", "Una línea empieza en el hombro y termina al andar."],
    relevo: ["ARCHIVO R—03", "UNA VIDA MÁS", "Piezas encontradas, revisadas y puestas de nuevo en circulación."],
    plano: ["P / 04", "FORMA EN USO", "Una prenda. Distintas maneras de ocupar el espacio."]
  }[id];
  return `<aside class="brand-interlude interlude-${id}" aria-label="Universo de ${stores[id].name}"><div class="interlude-image"><img src="${assets}${id}-panorama.webp" alt="Editorial de ${stores[id].name}" loading="lazy"></div><div class="interlude-copy"><span>${details[0]}</span><strong>${details[1]}</strong><p>${details[2]}</p></div></aside>`;
}
function store(id) {
  const s = stores[id];
  if (!s) { location.hash = "/"; return; }
  document.title = `${s.name} — Kuri Fashion`;
  document.body.dataset.page = id;
  const products = allProducts.filter(product => product.storeId === id).map(productCard).join("");
  app.innerHTML = `<section class="store-page ${id}" aria-labelledby="store-title"><div class="store-top"><a class="back-link" href="#/">← Volver a Kuri Fashion</a><span>${s.number} / Tiendas independientes</span></div>${brandSpread(id)}${brandInterlude(id)}<section class="collection" id="coleccion" aria-labelledby="collection-title"><div class="collection-heading"><p>Selección / 01</p><h2 id="collection-title">${editions[id].collection}</h2><span>03 piezas</span></div><div class="products">${products}</div></section></section>`;
  app.querySelector(".collection-link").addEventListener("click", () => {
    app.querySelector("#coleccion").scrollIntoView({
      behavior: reduceMotion.matches ? "instant" : "smooth",
      block: "start"
    });
  });
  window.scrollTo(0,0);
  requestAnimationFrame(() => document.getElementById("store-title").focus({preventScroll:true}));
}
function categoriesPage(selected) {
  document.body.dataset.page = "categories";
  document.title = "Categorías — Kuri Fashion";
  const filters = Object.entries(categories).map(([id, label]) => `<a href="#/categorias/${id}" class="category-filter ${selected === id ? "selected" : ""}">${label}</a>`).join("");
  const visible = selected ? allProducts.filter(product => product.categories.includes(selected)) : allProducts;
  app.innerHTML = `<section class="listing-page"><div class="page-kicker">Explorar / Kuri Fashion</div><h1>Categorías <em>sin fronteras.</em></h1><p class="listing-intro">Una categoría reúne piezas de distintas tiendas. Cada prenda conserva su origen.</p><nav class="category-filters" aria-label="Filtrar categorías"><a href="#/categorias" class="category-filter ${selected ? "" : "selected"}">Todas</a>${filters}</nav><p class="result-count">${selected ? categories[selected] : "Todas las piezas"} · ${visible.length} piezas</p><div class="products listing-products">${visible.map(productCard).join("")}</div></section>`;
  window.scrollTo(0, 0);
}
function productPage(id) {
  const product = allProducts.find(item => item.id === id);
  if (!product) { location.hash = "/"; return; }
  const [name, description, price, image] = product.item;
  document.body.dataset.page = "product";
  document.title = `${name} — Kuri Fashion`;
  app.innerHTML = `<section class="product-page"><a class="back-link" href="#/tienda/${product.storeId}">← ${stores[product.storeId].name}</a><div class="product-layout"><div class="product-main-image"><img src="${assets}${image}" alt="${name}"></div><div class="product-info"><p class="eyebrow">${stores[product.storeId].name} / ${product.categories.map(category => categories[category]).join(" · ")}</p><h1>${name}</h1><p class="product-price">${price}</p><p class="product-description">${description}. Pieza de demostración de ${stores[product.storeId].name}; selección independiente dentro de Kuri Fashion.</p><label for="size">Talla</label><select id="size"><option value="S">S</option><option value="M">M</option><option value="L">L</option></select><button type="button" class="add-to-cart">Añadir a la bolsa</button><p class="demo-note">Carrito de demostración · sin pagos reales</p></div></div></section>`;
  app.querySelector(".add-to-cart").addEventListener("click", () => {
    const size = app.querySelector("#size").value;
    const row = cart.find(item => item.id === id && item.size === size);
    if (row) row.quantity += 1;
    else cart.push({ id, size, quantity: 1 });
    saveCart();
    location.hash = "/carrito";
  });
  window.scrollTo(0, 0);
}
function cartPage() {
  document.body.dataset.page = "cart";
  document.title = "Bolsa — Kuri Fashion";
  const rows = cart.map((entry, index) => {
    const product = allProducts.find(item => item.id === entry.id);
    if (!product) return "";
    const [name, , price, image] = product.item;
    return `<div class="cart-row"><img src="${assets}${image}" alt=""><div><a href="#/producto/${entry.id}">${name}</a><p>${stores[product.storeId].name} · Talla ${entry.size} · Cantidad ${entry.quantity}</p><button class="remove-item" data-index="${index}" type="button">Quitar</button></div><span>${(parseInt(price, 10) * entry.quantity)} €</span></div>`;
  }).join("");
  const total = cart.reduce((sum, entry) => {
    const product = allProducts.find(item => item.id === entry.id);
    return sum + (product ? parseInt(product.item[2], 10) * entry.quantity : 0);
  }, 0);
  app.innerHTML = `<section class="cart-page"><p class="page-kicker">Kuri Fashion / Carrito común</p><h1>Tu bolsa.</h1>${cart.length ? rows : "<p>Tu bolsa está vacía.</p>"}<div class="cart-total"><span>Total de demostración</span><strong>${total} €</strong></div><p class="demo-note">Selección de muestra. No se realizan pagos ni reservas.</p><a class="back-link" href="#/">← Seguir explorando tiendas</a></section>`;
  app.querySelectorAll(".remove-item").forEach(button => button.addEventListener("click", () => {
    cart.splice(Number(button.dataset.index), 1);
    saveCart();
    cartPage();
  }));
  window.scrollTo(0, 0);
}
function route() {
  clearTimeout(modeTimer);
  modeTimer = null;
  if (brandIndex.open) brandIndex.close();
  clearVideo();
  const path = location.hash.slice(1);
  const storeMatch = path.match(/^\/tienda\/(umbral|bies|relevo|plano)$/);
  const categoryMatch = path.match(/^\/categorias(?:\/(abrigos|vestidos|accesorios|archivo))?$/);
  const productMatch = path.match(/^\/producto\/([a-z]+-[0-2])$/);
  updateCartCount();
  if (storeMatch) store(storeMatch[1]);
  else if (categoryMatch) categoriesPage(categoryMatch[1]);
  else if (productMatch) productPage(productMatch[1]);
  else if (path === "/carrito") cartPage();
  else home();
}
addEventListener("hashchange", route);
route();

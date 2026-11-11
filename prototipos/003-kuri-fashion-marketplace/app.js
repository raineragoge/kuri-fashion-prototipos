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

function card(id) {
  const s = stores[id];
  return `<a class="store-card ${id}" href="#/tienda/${id}" data-store="${id}" aria-label="Entrar en ${s.name}, ${s.kind}">
    <span class="diptych">
      <span class="photo look"><img src="${assets}${id}-look.webp" alt="" width="367" height="582"><video muted loop playsinline preload="none" poster="${assets}${id}-look.webp" data-src="${assets}${id}-look.mp4" aria-hidden="true"></video></span>
      <span class="photo detail"><img src="${assets}${id}-detail.webp" alt="" width="340" height="585"></span>
    </span>
    <span class="store-caption"><span class="store-number">${s.number} / Tienda independiente</span><span class="store-name">${s.name}<span class="arrow" aria-hidden="true">↗</span></span><span class="store-kind">${s.kind}</span><span class="mobile-enter">Entrar en ${s.name} <span aria-hidden="true">→</span></span></span>
  </a>`;
}
function home() {
  document.title = "Kuri Fashion — Tiendas independientes";
  document.body.dataset.page = "home";
  app.innerHTML = `<section class="home" aria-labelledby="home-title"><div class="home-top"><p>Selección de tiendas independientes</p><p>Cuatro maneras de vestir · un mismo lugar</p></div><h1 id="home-title">La prenda, <em>en dos planos.</em></h1><div class="gallery" aria-label="Escaparates de tiendas">${card("umbral")}${card("bies")}${card("relevo")}${card("plano")}</div><div class="home-bottom"><span>01 — 04</span><p>Descubre la silueta. Acércate al detalle.</p><span>Desliza para explorar <span aria-hidden="true">→</span></span></div></section>`;
  document.querySelectorAll(".store-card").forEach(setupCard);
  requestAnimationFrame(() => { window.scrollTo(0, homeScroll); if (lastStore) document.querySelector(`[data-store="${lastStore}"]`)?.focus({preventScroll:true}); });
}
function setupCard(card) {
  const video = card.querySelector("video");
  card.addEventListener("pointerenter", e => {
    if (e.pointerType === "touch" || reduceMotion.matches) return;
    if (activeVideo && activeVideo !== video) stopVideo(activeVideo);
    activeVideo = video;
    if (!video.src) video.src = video.dataset.src;
    video.currentTime = 0;
    video.play().then(() => card.classList.add("playing")).catch(() => {});
  });
  card.addEventListener("pointerleave", () => stopVideo(video));
  card.addEventListener("blur", () => stopVideo(video));
  let startX = 0, startY = 0, dragged = false;
  card.addEventListener("touchstart", e => { startX=e.touches[0].clientX; startY=e.touches[0].clientY; dragged=false; }, {passive:true});
  card.addEventListener("touchmove", e => { if (Math.abs(e.touches[0].clientX-startX)>12 || Math.abs(e.touches[0].clientY-startY)>12) dragged=true; }, {passive:true});
  card.addEventListener("click", e => {
    if (dragged) { e.preventDefault(); dragged=false; return; }
    homeScroll = window.scrollY;
    lastStore = card.dataset.store;
    stopVideo(video);
  });
}
function stopVideo(video) {
  video.pause();
  video.currentTime = 0;
  video.closest(".store-card")?.classList.remove("playing");
  if (activeVideo === video) activeVideo = null;
}
function store(id) {
  const s = stores[id];
  if (!s) { location.hash = "/"; return; }
  document.title = `${s.name} — Kuri Fashion`;
  document.body.dataset.page = id;
  const products = allProducts.filter(product => product.storeId === id).map(productCard).join("");
  app.innerHTML = `<section class="store-page ${id}" aria-labelledby="store-title"><div class="store-top"><a class="back-link" href="#/">← Volver a Kuri Fashion</a><span>${s.number} / Tiendas independientes</span></div><div class="store-hero"><div class="hero-image"><img src="${assets}${id}-look.webp" alt="${s.name}: ${s.kind}" width="367" height="582"></div><div class="hero-copy"><p class="eyebrow">${s.kind}</p><h1 id="store-title" tabindex="-1">${s.name}</h1><p class="intro">${s.intro}</p><div class="hero-rule"></div><p class="store-note">${s.note}</p><button type="button" class="collection-link">Ver selección <span aria-hidden="true">↓</span></button></div><div class="hero-detail"><img src="${assets}${id}-detail.webp" alt="Detalle de la colección ${s.name}"></div></div><section class="collection" id="coleccion" aria-labelledby="collection-title"><div class="collection-heading"><p>Selección / 01</p><h2 id="collection-title">Piezas de ${s.name}</h2><span>03 piezas</span></div><div class="products">${products}</div></section></section>`;
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

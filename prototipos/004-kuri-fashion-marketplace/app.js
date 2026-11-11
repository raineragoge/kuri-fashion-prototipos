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
function strip([storeId, image], index) {
  const video = `${image}.mp4`;
  return `<a class="gallery-strip" href="#/tienda/${storeId}" data-index="${index}" data-store="${storeId}" style="left:${index * 128}px;top:${[0,30,65,30,0,65,30,0,65,0][index]}px" aria-label="Entrar en ${stores[storeId].name}"><img src="${assets}${image}.webp" alt="" width="216" height="487"><video muted loop playsinline preload="none" data-src="${assets}${video}" aria-hidden="true"></video></a>`;
}
function galleryScale() {
  document.documentElement.style.setProperty("--gallery-scale", Math.min(1, (innerWidth - 40) / 1260));
}
function home() {
  document.title = "Kuri Fashion — Tiendas independientes";
  document.body.dataset.page = "home";
  app.innerHTML = `<section class="home home-004" aria-label="Tiendas independientes"><div class="gallery-004" aria-label="Galería de tiendas">${galleryImages.map(strip).join("")}</div><div class="home-label" aria-live="polite"><span class="home-eyebrow"></span><h1></h1><p></p></div><div class="home-bottom-004"><a href="#/categorias">Explorar categorías</a><span>Desliza o selecciona una imagen</span></div></section>`;
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
    label.querySelector("p").textContent = store.kind;
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


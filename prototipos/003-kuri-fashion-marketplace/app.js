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
  }
};
const app = document.getElementById("app");
const assets = "assets/";
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
let lastStore = null;
let homeScroll = 0;
let activeVideo = null;

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
  app.innerHTML = `<section class="home" aria-labelledby="home-title"><div class="home-top"><p>Selección de tiendas independientes</p><p>Dos maneras de vestir · un mismo lugar</p></div><h1 id="home-title">La prenda, <em>en dos planos.</em></h1><div class="gallery" aria-label="Escaparates de tiendas">${card("umbral")}${card("bies")}</div><div class="home-bottom"><span>01 — 02</span><p>Descubre la silueta. Acércate al detalle.</p><span>Desliza para explorar <span aria-hidden="true">→</span></span></div></section>`;
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
  const products = s.products.map((p,i) => `<article class="product product-${i+1}"><div class="product-image"><img src="${assets}${p[3]}" alt="${p[0]}" loading="lazy"></div><div class="product-meta"><div><h3>${p[0]}</h3><p>${p[1]}</p></div><span>${p[2]}</span></div></article>`).join("");
  app.innerHTML = `<section class="store-page ${id}" aria-labelledby="store-title"><div class="store-top"><a class="back-link" href="#/">← Volver a Kuri Fashion</a><span>${s.number} / Tiendas independientes</span></div><div class="store-hero"><div class="hero-image"><img src="${assets}${id}-look.webp" alt="${s.name}: ${s.kind}" width="367" height="582"></div><div class="hero-copy"><p class="eyebrow">${s.kind}</p><h1 id="store-title" tabindex="-1">${s.name}</h1><p class="intro">${s.intro}</p><div class="hero-rule"></div><p class="store-note">${s.note}</p><a href="#coleccion" class="collection-link">Ver selección <span aria-hidden="true">↓</span></a></div><div class="hero-detail"><img src="${assets}${id}-detail.webp" alt="Detalle de la colección ${s.name}"></div></div><section class="collection" id="coleccion" aria-labelledby="collection-title"><div class="collection-heading"><p>Selección / 01</p><h2 id="collection-title">Piezas de ${s.name}</h2><span>03 piezas</span></div><div class="products">${products}</div></section></section>`;
  window.scrollTo(0,0);
  requestAnimationFrame(() => document.getElementById("store-title").focus({preventScroll:true}));
}
function route() {
  const match = location.hash.match(/^#\/tienda\/(umbral|bies)$/);
  if (match) store(match[1]);
  else home();
}
addEventListener("hashchange", route);
route();

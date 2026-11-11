const catalog = window.KURI_DATA;
const brands = catalog.brands.filter(brand => brand.enabled).sort((a, b) => a.order - b.order);
const brandById = new Map(brands.map(brand => [brand.id, brand]));
const allProducts = brands.flatMap(brand => brand.products.map(product => ({ ...product, brandId: brand.id })));
const productById = new Map(allProducts.map(product => [product.id, product]));
const app = document.getElementById('app');
const assets = 'assets/';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const brandIndex = document.getElementById('brand-index');
const galleryConfig = { visibleColumns: 10, step: 128, stripWidth: 108, expandedWidth: 216, heights: [0, 30, 65, 30, 0, 65, 30, 0, 65, 0] };
let homeMode = 'gallery';
let featureIndex = 0;
let mobileColumn = 0;
let galleryScroll = 0;
let activeVideo = null;
let modeTimer = null;
let labelTimer = null;
let routeObserver = null;
let cart = JSON.parse(localStorage.getItem('kuri-cart') || '[]').filter(item => productById.has(item.id));

function campaignOf(brand) {
  return brand.campaigns.find(campaign => campaign.id === brand.featuredCampaignId) || brand.campaigns[0];
}
function collectionOf(brand) {
  return brand.collections.find(collection => collection.id === brand.featuredCollectionId) || brand.collections[0];
}
function euros(value) { return `${value} €`; }
function cartCount() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('.cart-count').textContent = count;
}
function saveCart() {
  localStorage.setItem('kuri-cart', JSON.stringify(cart));
  cartCount();
}
function clearVideo() {
  if (!activeVideo) return;
  activeVideo.pause();
  activeVideo.currentTime = 0;
  activeVideo.parentElement?.classList.remove('playing');
  activeVideo = null;
}
function playVideo(container) {
  clearVideo();
  if (reducedMotion.matches) return;
  const video = container.querySelector('video');
  if (!video) return;
  if (!video.src) video.src = video.dataset.src;
  activeVideo = video;
  video.currentTime = 0;
  video.play().then(() => { if (activeVideo === video) container.classList.add('playing'); }).catch(() => {});
}
function observeReveals() {
  routeObserver?.disconnect();
  const items = [...app.querySelectorAll('.reveal')];
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    items.forEach(item => item.classList.add('in-view'));
    return;
  }
  routeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        routeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px 65px 0px' });
  items.forEach(item => routeObserver.observe(item));
}

function galleryStrip(brand, index) {
  const offset = galleryConfig.heights[index % galleryConfig.heights.length];
  return `<a class="gallery-strip gallery-strip-007" href="#/tienda/${brand.id}" data-index="${index}" data-store="${brand.id}" style="--i:${index};left:${index * galleryConfig.step}px;top:${offset}px" aria-label="Entrar en ${brand.name}">
    <img class="strip-poster" src="${assets}${brand.home.poster}" alt="" width="216" height="487" ${index > 6 ? 'loading="lazy"' : ''}>
    <img class="strip-hover" src="${assets}${brand.home.hoverImage}" alt="" width="216" height="487" loading="lazy">
    ${brand.home.hoverVideo ? `<video muted loop playsinline preload="none" data-src="${assets}${brand.home.hoverVideo}" aria-hidden="true"></video>` : ''}
  </a>`;
}
function galleryScale() {
  document.documentElement.style.setProperty('--gallery-scale', Math.min(1, (innerWidth - 40) / 1260, innerHeight / 900));
}
function setActiveColumn(index, play) {
  const gallery = app.querySelector('.gallery-007');
  if (!gallery) return;
  clearVideo();
  [...gallery.querySelectorAll('.gallery-strip')].forEach((column, i) => {
    const offset = index === null ? 0 : i < index ? -54 : i > index ? 54 : -54;
    column.style.left = `${i * galleryConfig.step + offset}px`;
    column.classList.toggle('active', i === index);
  });
  const label = app.querySelector('.home-label');
  const brand = index === null ? null : brands[index];
  clearTimeout(labelTimer);
  label.classList.toggle('visible', Boolean(brand));
  if (brand) {
    label.querySelector('.home-eyebrow').textContent = play && brand.home.hoverVideo ? 'Movimiento fotográfico de demostración / entrar' : 'Explorar firma';
    label.querySelector('h1').textContent = brand.name;
    if (play) playVideo(gallery.children[index]);
  } else {
    labelTimer = setTimeout(() => {
      label.querySelector('.home-eyebrow').textContent = '';
      label.querySelector('h1').textContent = '';
    }, 380);
  }
}
function bindGallery() {
  const gallery = app.querySelector('.gallery-007');
  gallery.querySelectorAll('.gallery-strip').forEach((column, index) => {
    column.addEventListener('pointerenter', event => {
      if (event.pointerType !== 'touch' && !matchMedia('(max-width:700px)').matches) setActiveColumn(index, true);
    });
    column.addEventListener('focus', () => setActiveColumn(index, false));
    let startX = 0, dragged = false;
    column.addEventListener('touchstart', event => { startX = event.touches[0].clientX; dragged = false; }, { passive:true });
    column.addEventListener('touchmove', event => { if (Math.abs(event.touches[0].clientX - startX) > 10) dragged = true; }, { passive:true });
    column.addEventListener('click', event => {
      if (dragged) { event.preventDefault(); return; }
      galleryScroll = gallery.scrollLeft;
      featureIndex = index;
      clearVideo();
    });
  });
  gallery.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch' && !matchMedia('(max-width:700px)').matches) setActiveColumn(null, false);
  });
  gallery.addEventListener('focusout', event => {
    if (!gallery.contains(event.relatedTarget) && !matchMedia('(max-width:700px)').matches) setActiveColumn(null, false);
  });
  let timer;
  gallery.addEventListener('scroll', () => {
    if (!matchMedia('(max-width:700px)').matches) return;
    clearTimeout(timer);
    timer = setTimeout(() => {
      const center = innerWidth / 2;
      const columns = [...gallery.querySelectorAll('.gallery-strip')];
      const distances = columns.map(column => Math.abs(column.getBoundingClientRect().left + column.getBoundingClientRect().width / 2 - center));
      mobileColumn = distances.indexOf(Math.min(...distances));
      setActiveColumn(mobileColumn, false);
    }, 80);
  }, { passive:true });
  if (matchMedia('(max-width:700px)').matches) {
    setActiveColumn(Math.min(mobileColumn, brands.length - 1), false);
    requestAnimationFrame(() => { gallery.scrollLeft = galleryScroll; });
  }
}

function featureMarkup() {
  const brand = brands[featureIndex];
  const campaign = campaignOf(brand);
  const fragments = campaign.fragments;
  const gap = Math.max(1, fragments.length - 1);
  const step = 1100 / (fragments.length + 1);
  const width = step - 15;
  const previous = brands[(featureIndex - 1 + brands.length) % brands.length];
  const next = brands[(featureIndex + 1) % brands.length];
  return `<div class="feature-view" style="--feature-slots:${fragments.length + 1}" aria-label="Campaña de ${brand.name}">
    <button class="feature-arrow previous" type="button" data-step="-1" aria-label="Campaña anterior: ${previous.name}"><span>${previous.name}</span><b aria-hidden="true">⟵</b></button>
    <div class="feature-stage feature-stage-007" style="--feature-step:${step}px;--feature-width:${width}px;--feature-slots:${fragments.length + 1};--campaign:url('${assets}${campaign.poster}')">
      ${fragments.map((fragment, index) => {
        const slot = index < gap ? index : index + 1;
        const rise = galleryConfig.heights[index % galleryConfig.heights.length] / 3;
        return `<a class="feature-slice feature-slice-007" href="#/tienda/${brand.id}" style="--i:${index};--slot:${slot};--rise:${rise}px" aria-label="Entrar en ${brand.name}, imagen ${index + 1}">
          <span class="feature-poster" style="--fragment-poster:url('${assets}${fragment.poster}')"></span>
          <img class="fragment-hover" src="${assets}${fragment.hoverImage}" alt="" loading="lazy">
          ${fragment.hoverVideo ? `<video muted loop playsinline preload="none" data-src="${assets}${fragment.hoverVideo}" aria-hidden="true"></video>` : ''}
        </a>`;
      }).join('')}
      <a class="feature-wordmark feature-wordmark-${brand.id}" style="--gap:${gap}" href="#/tienda/${brand.id}" aria-label="Entrar en ${brand.name}"><strong>${brand.name}</strong><small>${campaign.title}<span aria-hidden="true"> ↗</span></small></a>
    </div>
    <button class="feature-arrow next" type="button" data-step="1" aria-label="Campaña siguiente: ${next.name}"><span>${next.name}</span><b aria-hidden="true">⟶</b></button>
  </div>`;
}
function clearFeatureSlice(slice) {
  clearVideo();
  slice.classList.remove('active');
  const stage = slice.closest('.feature-stage');
  stage?.classList.remove('has-focus');
  stage?.querySelectorAll('.feature-slice').forEach(item => item.style.removeProperty('left'));
}
function activateFeatureSlice(slice, play = true) {
  const stage = slice.closest('.feature-stage');
  const slices = [...stage.querySelectorAll('.feature-slice')];
  const activeIndex = slices.indexOf(slice);
  const step = matchMedia('(max-width:700px)').matches ? 96 : parseFloat(stage.style.getPropertyValue('--feature-step'));
  slices.forEach((item, index) => {
    const slot = Number(item.style.getPropertyValue('--slot'));
    item.style.left = `${slot * step + (index < activeIndex ? -32 : index > activeIndex ? 32 : -32)}px`;
  });
  stage.classList.add('has-focus');
  slice.classList.add('active');
  if (play) playVideo(slice);
}
function bindFeature() {
  const layer = app.querySelector('.feature-layer');
  layer.querySelectorAll('.feature-arrow').forEach(button => button.addEventListener('click', () => changeFeature(Number(button.dataset.step))));
  layer.querySelectorAll('.feature-slice').forEach(slice => {
    slice.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') activateFeatureSlice(slice); });
    slice.addEventListener('pointerleave', () => clearFeatureSlice(slice));
    slice.addEventListener('focus', () => activateFeatureSlice(slice, false));
    slice.addEventListener('blur', () => clearFeatureSlice(slice));
    slice.addEventListener('click', clearVideo);
  });
  layer.querySelector('.feature-wordmark').addEventListener('click', clearVideo);
}
function changeFeature(step) {
  if (modeTimer) return;
  const layer = app.querySelector('.feature-layer');
  layer.classList.remove('entering');
  layer.classList.add('exiting');
  clearVideo();
  modeTimer = setTimeout(() => {
    featureIndex = (featureIndex + step + brands.length) % brands.length;
    layer.innerHTML = featureMarkup();
    bindFeature();
    const title = app.querySelector('.mobile-feature-title');
    title.textContent = brands[featureIndex].name;
    title.href = `#/tienda/${brands[featureIndex].id}`;
    layer.classList.remove('exiting');
    layer.classList.add('entering');
    modeTimer = null;
  }, reducedMotion.matches ? 0 : 260);
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
      const selected = button.dataset.mode === next;
      button.classList.toggle('selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (next === 'gallery' && matchMedia('(max-width:700px)').matches) setActiveColumn(mobileColumn, false);
    modeTimer = null;
  }, reducedMotion.matches ? 0 : 260);
}

function homeEditorial() {
  const lead = brandById.get(catalog.homeEditorial.leadBrandId) || brands[0];
  const pair = catalog.homeEditorial.pairedBrandIds.map(id => brandById.get(id)).filter(Boolean);
  const picks = catalog.homeEditorial.featuredProductIds.map(id => productById.get(id)).filter(Boolean);
  return `<div class="home-editorial">
    <section class="home-campaign reveal" aria-labelledby="home-campaign-title"><img src="${assets}${campaignOf(lead).poster}" alt="Campaña de ${lead.name}" loading="lazy"><div><span>Campaña / ${lead.name}</span><h2 id="home-campaign-title">${lead.chapter}</h2><a href="#/tienda/${lead.id}">Entrar en ${lead.name} ↗</a></div></section>
    <section class="home-firms" aria-labelledby="home-firms-title"><div class="home-section-heading reveal"><span>Índice / ${String(brands.length).padStart(2,'0')} firmas</span><h2 id="home-firms-title">Cada firma, su propio lugar.</h2></div><div class="firm-pair">${pair.map((brand, index) => `<a class="firm-portrait reveal firm-portrait-${brand.id}" href="#/tienda/${brand.id}"><img src="${assets}${brand.frames[index ? 3 : 0]}" alt="${brand.name}" loading="lazy"><span><small>${brand.motif}</small><strong>${brand.name}</strong><b>↗</b></span></a>`).join('')}</div></section>
    <section class="home-discovery" aria-labelledby="home-discovery-title"><div class="home-section-heading reveal"><span>Selección cruzada</span><h2 id="home-discovery-title">Piezas con origen.</h2></div><div class="discovery-products">${picks.map((product, index) => `<a class="discovery-item reveal" href="#/producto/${product.id}" style="--i:${index}"><img src="${assets}${product.image}" alt="${product.name}" loading="lazy"><span>${brandById.get(product.brandId).name} / ${product.name}</span></a>`).join('')}</div><a class="browse-all" href="#/categorias">Explorar todas las categorías ↗</a></section>
  </div>`;
}
function home() {
  document.title = 'Kuri Fashion — Firmas independientes';
  document.body.dataset.page = 'home';
  document.body.dataset.identity = '';
  app.innerHTML = `<section class="home home-004 home-006 home-007" aria-label="Firmas independientes">
    <div class="gallery-layer mode-layer ${homeMode === 'gallery' ? 'entering' : ''}" ${homeMode === 'gallery' ? '' : 'hidden aria-hidden="true"'}>
      <div class="gallery-004 gallery-007 ${brands.length > galleryConfig.visibleColumns ? 'is-scrollable' : ''}" tabindex="0" aria-label="Galería de ${brands.length} firmas">${brands.map(galleryStrip).join('')}</div>
      <div class="home-label" aria-live="polite"><span class="home-eyebrow"></span><h1></h1></div>
    </div>
    <div class="feature-layer mode-layer ${homeMode === 'feature' ? 'entering' : ''}" ${homeMode === 'feature' ? '' : 'hidden aria-hidden="true"'}>${featureMarkup()}</div>
    <a class="mobile-feature-title" href="#/tienda/${brands[featureIndex].id}">${brands[featureIndex].name}</a>
    <nav class="mobile-feature-nav" aria-label="Cambiar campaña"><button type="button" data-step="-1" aria-label="Campaña anterior">← Anterior</button><button type="button" data-step="1" aria-label="Campaña siguiente">Siguiente →</button></nav>
    <div class="mode-switch" role="group" aria-label="Visualización de la portada"><button class="mode-control ${homeMode === 'feature' ? 'selected' : ''}" type="button" data-mode="feature" aria-label="Ver una campaña fragmentada" aria-pressed="${homeMode === 'feature'}"><i class="mode-icon-panorama" aria-hidden="true"></i></button><button class="mode-control ${homeMode === 'gallery' ? 'selected' : ''}" type="button" data-mode="gallery" aria-label="Ver galería de marcas" aria-pressed="${homeMode === 'gallery'}"><i class="mode-icon-columns" aria-hidden="true"></i></button></div>
    ${brands.length > galleryConfig.visibleColumns ? '<button class="gallery-more" type="button" aria-label="Ver más firmas">Más firmas →</button>' : ''}
  </section>${homeEditorial()}`;
  galleryScale();
  bindGallery();
  bindFeature();
  app.querySelectorAll('.mode-control').forEach(button => button.addEventListener('click', () => switchMode(button.dataset.mode)));
  app.querySelectorAll('.mobile-feature-nav button').forEach(button => button.addEventListener('click', () => changeFeature(Number(button.dataset.step))));
  app.querySelector('.gallery-more')?.addEventListener('click', () => app.querySelector('.gallery-007').scrollBy({ left: galleryConfig.step * galleryConfig.visibleColumns, behavior: reducedMotion.matches ? 'instant' : 'smooth' }));
  observeReveals();
}

function productCard(product, index) {
  const brand = brandById.get(product.brandId);
  return `<article class="product product-${index + 1} reveal"><a class="product-image" href="#/producto/${product.id}" aria-label="Ver ${product.name}"><img src="${assets}${product.image}" alt="${product.name}" loading="lazy"></a><div class="product-meta"><div><h3><a href="#/producto/${product.id}">${product.name}</a></h3><p>${brand.name} · ${product.detail}</p></div><span>${euros(product.price)}</span></div></article>`;
}
function brandSpread(brand) {
  return `<section class="spread spread-${brand.id} brand-intro" data-motion="${brand.identity}">
    <header class="imprint"><span class="brand-mark" aria-hidden="true">${brand.mark}</span><span class="brand-imprint">${brand.motif}</span><h1 id="store-title" tabindex="-1">${brand.name}</h1><h2>${brand.chapter}</h2></header>
    <img class="campaign" src="${assets}${brand.hero}" alt="Editorial de ${brand.name}" fetchpriority="high">
    <figure class="sample"><img src="${assets}${brand.frames[1]}" alt="Detalle de ${brand.name}"><figcaption>${brand.motif}</figcaption></figure>
    <div class="editorial"><p>${brand.intro}</p><button type="button" class="collection-link">Ver selección ↓</button></div>
  </section>`;
}
function brandVisualStory(brand) {
  const campaign = brand.campaigns.find(item => item.id === collectionOf(brand).campaignId) || campaignOf(brand);
  return `<section class="brand-narrative" data-brand="${brand.id}" aria-label="Historia de ${brand.name}">
    <div class="brand-panorama reveal" data-motion="wide"><img src="${assets}${campaign.poster}" alt="Campaña ${campaign.title} de ${brand.name}" loading="lazy"><div><span>${brand.name} / campaña actual</span><strong>${campaign.title}</strong></div></div>
    <div class="brand-statement reveal" data-motion="text"><small>La firma / ${brand.name}</small><p>${brand.story}</p><span>${brand.audience}</span></div>
    <div class="brand-sequence">
      ${brand.frames.map((frame, index) => `<figure class="sequence-frame sequence-frame-${index + 1} reveal" data-motion="${index % 3 === 0 ? 'slide' : index % 3 === 1 ? 'mask' : 'scale'}"><img src="${assets}${frame}" alt="${brand.name}: ${['retrato','detalle de prenda','silueta completa','otro ángulo','materiales','escena editorial'][index % 6]}" loading="lazy"><figcaption>${String(index + 1).padStart(2,'0')} / ${brand.motif.split(' / ')[index % 3]}</figcaption></figure>`).join('')}
    </div>
    <div class="brand-outro reveal" data-motion="text"><span>${brand.name} / ${campaign.title}</span><p>${brand.note}</p></div>
  </section>`;
}
function storePage(id) {
  const brand = brandById.get(id);
  if (!brand) return home();
  const collection = collectionOf(brand);
  const collectionProducts = collection.productIds.map(productId => productById.get(productId)).filter(Boolean);
  document.body.dataset.page = id;
  document.body.dataset.identity = brand.identity;
  document.title = `${brand.name} — Kuri Fashion`;
  app.innerHTML = `<section class="store-page ${id} store-007" aria-labelledby="store-title"><div class="store-top"><a class="back-link" href="#/">← Volver a Kuri Fashion</a><span>${String(brands.indexOf(brand) + 1).padStart(2,'0')} / Firmas independientes</span></div>${brandSpread(brand)}${brandVisualStory(brand)}<section class="collection" id="coleccion" aria-labelledby="collection-title"><div class="collection-heading"><p>Selección / ${brand.name}</p><h2 id="collection-title">${collection.title}</h2><span>${String(collectionProducts.length).padStart(2,'0')} piezas</span></div><div class="products">${collectionProducts.map((product,index) => productCard(product,index)).join('')}</div></section></section>`;
  app.querySelector('.collection-link').addEventListener('click', () => app.querySelector('#coleccion').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block:'start' }));
  scrollTo(0, 0);
  requestAnimationFrame(() => document.getElementById('store-title').focus({ preventScroll:true }));
  observeReveals();
}
function categoriesPage(selected) {
  document.body.dataset.page = 'categories';
  document.body.dataset.identity = '';
  document.title = 'Categorías — Kuri Fashion';
  const filters = Object.entries(catalog.categories).map(([id,label]) => `<a href="#/categorias/${id}" class="category-filter ${selected === id ? 'selected' : ''}">${label}</a>`).join('');
  const visible = selected ? allProducts.filter(product => product.categories.includes(selected)) : allProducts;
  app.innerHTML = `<section class="listing-page"><div class="page-kicker">Explorar / Kuri Fashion</div><h1>Categorías <em>sin fronteras.</em></h1><p class="listing-intro">Las prendas se agrupan por afinidad, pero cada una conserva el origen de su firma.</p><nav class="category-filters" aria-label="Filtrar categorías"><a href="#/categorias" class="category-filter ${selected ? '' : 'selected'}">Todas</a>${filters}</nav><p class="result-count">${selected ? catalog.categories[selected] : 'Todas las piezas'} · ${visible.length} piezas</p><div class="products listing-products">${visible.map(productCard).join('')}</div></section>`;
  scrollTo(0,0);
  observeReveals();
}
function productPage(id) {
  const product = productById.get(id);
  if (!product) return home();
  const brand = brandById.get(product.brandId);
  document.body.dataset.page = 'product';
  document.body.dataset.identity = '';
  document.title = `${product.name} — Kuri Fashion`;
  app.innerHTML = `<section class="product-page"><a class="back-link" href="#/tienda/${brand.id}">← ${brand.name}</a><div class="product-layout"><div class="product-main-image"><img src="${assets}${product.image}" alt="${product.name}"></div><div class="product-info"><p class="eyebrow">${brand.name} / ${product.categories.map(category => catalog.categories[category]).join(' · ')}</p><h1>${product.name}</h1><p class="product-price">${euros(product.price)}</p><p class="product-description">${product.detail}. Pieza de demostración de ${brand.name} dentro de Kuri Fashion.</p><label for="size">Talla</label><select id="size">${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}</select><button type="button" class="add-to-cart">Añadir a la bolsa</button><p class="demo-note">Bolsa de demostración · sin pagos reales</p></div></div></section>`;
  app.querySelector('.add-to-cart').addEventListener('click', () => {
    const size = app.querySelector('#size').value;
    const row = cart.find(item => item.id === id && item.size === size);
    if (row) row.quantity++;
    else cart.push({ id, size, quantity:1 });
    saveCart();
    location.hash = '/carrito';
  });
  scrollTo(0,0);
}
function cartPage() {
  document.body.dataset.page = 'cart';
  document.body.dataset.identity = '';
  document.title = 'Bolsa — Kuri Fashion';
  const rows = cart.map((entry,index) => {
    const product = productById.get(entry.id);
    const brand = brandById.get(product.brandId);
    return `<div class="cart-row"><img src="${assets}${product.image}" alt=""><div><a href="#/producto/${product.id}">${product.name}</a><p>${brand.name} · Talla ${entry.size} · Cantidad ${entry.quantity}</p><button class="remove-item" data-index="${index}" type="button">Quitar</button></div><span>${euros(product.price * entry.quantity)}</span></div>`;
  }).join('');
  const total = cart.reduce((sum,entry) => sum + productById.get(entry.id).price * entry.quantity,0);
  app.innerHTML = `<section class="cart-page"><p class="page-kicker">Kuri Fashion / Bolsa común</p><h1>Tu bolsa.</h1>${cart.length ? rows : '<p>Tu bolsa está vacía.</p>'}<div class="cart-total"><span>Total de demostración</span><strong>${euros(total)}</strong></div><p class="demo-note">Selección de muestra. No se realizan pagos ni reservas.</p><a class="back-link" href="#/">← Seguir explorando firmas</a></section>`;
  app.querySelectorAll('.remove-item').forEach(button => button.addEventListener('click', () => {
    cart.splice(Number(button.dataset.index),1);
    saveCart();
    cartPage();
  }));
  scrollTo(0,0);
}
function route() {
  clearTimeout(modeTimer);
  modeTimer = null;
  clearVideo();
  routeObserver?.disconnect();
  if (brandIndex.open) brandIndex.close();
  cartCount();
  const parts = location.hash.slice(1).split('/').filter(Boolean);
  if (parts[0] === 'tienda' && brandById.has(parts[1])) storePage(parts[1]);
  else if (parts[0] === 'categorias' && (!parts[1] || catalog.categories[parts[1]])) categoriesPage(parts[1]);
  else if (parts[0] === 'producto' && productById.has(parts[1])) productPage(parts[1]);
  else if (parts[0] === 'carrito') cartPage();
  else home();
}

document.getElementById('brand-links').innerHTML = brands.map(brand => `<a class="signature s-${brand.id}" href="#/tienda/${brand.id}"><img src="${assets}${brand.home.poster}" alt="" loading="lazy"><span>${brand.name}</span></a>`).join('');
document.getElementById('open-index').addEventListener('click', () => { clearVideo(); brandIndex.showModal(); });
brandIndex.addEventListener('click', event => {
  if (event.target.closest('a') || event.target === brandIndex && event.clientY > brandIndex.getBoundingClientRect().bottom) brandIndex.close();
});
addEventListener('resize', galleryScale);
addEventListener('hashchange', route);
route();

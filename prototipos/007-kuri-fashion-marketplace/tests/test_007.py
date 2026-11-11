"""Playwright verification for Kuri Fashion 007. Serve this directory on port 8007."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

ROOT = Path(__file__).parent.parent
OUT = Path(__file__).parent
URL = 'http://127.0.0.1:8007/'
IDS = ['umbral','bies','relevo','plano','vertice','oficio','trenza','orilla','sutura','aro']
NAMES = ['Umbral','Casa Bies','Relevo','Plano','Vértice','Oficio','Trenza','Orilla','Sutura','Aro']

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge', args=['--mute-audio'])
    page = browser.new_page(viewport={'width':1440,'height':900})
    errors, missing = [], []
    page.on('pageerror', lambda error: errors.append(str(error)))
    page.on('response', lambda response: missing.append(response.url) if response.status >= 400 and ('/assets/' in response.url) else None)
    page.goto(URL, wait_until='networkidle')
    page.evaluate('document.fonts.ready')
    page.wait_for_timeout(1200)
    strips = page.locator('.gallery-strip')
    expect(strips).to_have_count(10)
    assert strips.evaluate_all('(items) => items.map(item => item.dataset.store)') == IDS
    expect(page.locator('.home-label h1')).to_be_empty()
    page.screenshot(path=OUT/'home-galeria.png')

    # A gallery column opens its own firm. Video is explicitly a demonstration.
    first = strips.first
    first.hover()
    page.wait_for_function("document.querySelector('.gallery-strip.active video').currentTime > .2")
    page.wait_for_timeout(420)
    expect(page.locator('.home-label h1')).to_have_text('Umbral')
    assert round(first.bounding_box()['width']) == 216
    page.screenshot(path=OUT/'home-hover-video.png')
    page.mouse.move(6,80)
    page.wait_for_timeout(430)
    assert first.locator('video').evaluate('v=>v.paused')
    fifth = strips.nth(4)
    fifth.hover()
    page.wait_for_timeout(430)
    expect(page.locator('.home-label h1')).to_have_text('Vértice')
    assert fifth.locator('video').count() == 0
    assert fifth.locator('.strip-hover').evaluate('e=>getComputedStyle(e).opacity') == '1'
    assert fifth.locator('.strip-hover').get_attribute('src') != fifth.locator('.strip-poster').get_attribute('src')
    page.screenshot(path=OUT/'home-hover-foto.png')
    page.mouse.move(6,80)

    # Two modes and ten independent campaigns, each with six different hover shots.
    page.get_by_role('button',name='Ver una campaña fragmentada').click()
    page.wait_for_timeout(1000)
    expect(page.locator('.feature-slice')).to_have_count(6)
    page.screenshot(path=OUT/'home-campana-umbral.png')
    for index, name in enumerate(NAMES):
        expect(page.locator('.feature-wordmark strong')).to_have_text(name)
        sources = page.locator('.feature-slice .fragment-hover').evaluate_all('(items)=>items.map(item=>item.getAttribute("src"))')
        assert len(set(sources)) == 6, (name,sources)
        if index == 2:
            fragment = page.locator('.feature-slice').nth(2)
            before = fragment.bounding_box()['width']
            fragment.hover()
            page.wait_for_timeout(440)
            assert fragment.bounding_box()['width'] > before + 40
            assert fragment.locator('.fragment-hover').evaluate('e=>getComputedStyle(e).opacity') == '1'
            page.screenshot(path=OUT/'home-campana-hover-relevo.png')
            page.mouse.move(5,80)
            page.wait_for_timeout(430)
            assert abs(fragment.bounding_box()['width']-before)<1
        if index < len(NAMES)-1:
            page.locator('.feature-arrow.next').click()
            page.wait_for_timeout(900)
    page.screenshot(path=OUT/'home-campana-aro.png')
    page.locator('.feature-slice').nth(2).click()
    expect(page).to_have_url(URL+'#/tienda/aro')
    page.locator('.back-link').click()
    expect(page.locator('.feature-wordmark strong')).to_have_text('Aro')
    page.get_by_role('button',name='Ver galería de marcas').click()
    page.wait_for_timeout(900)
    expect(page.locator('.gallery-strip')).to_have_count(10)

    # The first viewport stays spare; the lower page gains campaign, brand and product stories.
    assert page.locator('.home-editorial section').count() == 3
    page.locator('.home-campaign').evaluate('e=>e.scrollIntoView({block:"start",behavior:"instant"})')
    expect(page.locator('.home-campaign')).to_have_class('home-campaign reveal in-view')
    page.wait_for_function("document.querySelector('.home-campaign img').naturalWidth > 0")
    page.wait_for_timeout(900)
    page.screenshot(path=OUT/'home-scroll-campana.png')
    page.locator('.home-firms').evaluate('e=>e.scrollIntoView({block:"start",behavior:"instant"})')
    page.wait_for_timeout(900)
    page.screenshot(path=OUT/'home-scroll-firmas.png')
    page.locator('.home-discovery').evaluate('e=>e.scrollIntoView({block:"start",behavior:"instant"})')
    page.wait_for_timeout(900)
    page.screenshot(path=OUT/'home-scroll-productos.png')

    # Ten complete stores, each with editorial sequence and own catalog.
    for id,name in zip(IDS,NAMES):
        page.goto(URL+'#/tienda/'+id, wait_until='networkidle')
        page.wait_for_timeout(750)
        expect(page.locator('#store-title')).to_have_text(name)
        assert page.locator('.brand-sequence .sequence-frame').count() == 6
        assert page.locator('.collection .product').count() >= 3
        assert page.locator('.brand-intro .campaign').evaluate('img=>img.naturalWidth>0')
        page.screenshot(path=OUT/f'tienda-{id}.png')
        for image in page.locator('.brand-sequence img').all():
            image.scroll_into_view_if_needed()
            page.wait_for_timeout(110)
        page.wait_for_timeout(350)
        assert page.locator('.brand-sequence img').evaluate_all('imgs=>imgs.every(img=>img.naturalWidth>0)')
        assert page.locator('.sequence-frame.in-view').count() == 6
        page.screenshot(path=OUT/f'historia-{id}.png')
        page.get_by_role('button',name='Ver selección').click()
        page.wait_for_function("document.querySelector('.collection').getBoundingClientRect().top < 240",timeout=5000)
        assert page.evaluate('document.documentElement.scrollWidth===innerWidth'), id

    # Transversal catalog and shared cart across four distinct stores.
    page.goto(URL+'#/categorias/outerwear',wait_until='networkidle')
    assert page.locator('.listing-products .product').count() >= 5
    for id in ['umbral','bies','vertice','aro']:
        page.goto(URL+f'#/tienda/{id}',wait_until='networkidle')
        page.locator('.collection .product-image').first.click()
        expect(page.locator('.product-info h1')).to_be_visible()
        assert page.locator('#size option').count() >= 1
        page.locator('.add-to-cart').click()
        expect(page.locator('.cart-row').last).to_be_visible()
    expect(page.locator('.cart-row')).to_have_count(4)
    page.screenshot(path=OUT/'bolsa-cuatro-firmas.png')

    # Mobile gallery, feature carousel, store and market navigation.
    mobile = browser.new_page(**pw.devices['iPhone 13'])
    mobile.on('pageerror',lambda error: errors.append(str(error)))
    mobile.goto(URL,wait_until='networkidle')
    mobile.wait_for_timeout(1100)
    expect(mobile.locator('.gallery-strip')).to_have_count(10)
    mobile.screenshot(path=OUT/'movil-galeria.png',scale='css')
    mobile.locator('.gallery-007').evaluate('e=>e.scrollLeft=e.scrollWidth')
    mobile.wait_for_timeout(300)
    expect(mobile.locator('.gallery-strip.active')).to_have_attribute('data-store','aro')
    mobile.locator('.gallery-strip.active').tap()
    expect(mobile.locator('#store-title')).to_have_text('Aro')
    mobile.wait_for_timeout(1100)
    assert mobile.evaluate('document.documentElement.scrollWidth===innerWidth')
    mobile.screenshot(path=OUT/'movil-aro.png',scale='css')
    mobile.locator('.brand').tap()
    mobile.get_by_role('button',name='Ver una campaña fragmentada').tap()
    mobile.wait_for_timeout(800)
    expect(mobile.locator('.mobile-feature-title')).to_have_text('Aro')
    mobile.screenshot(path=OUT/'movil-campana.png',scale='css')
    mobile.get_by_role('button',name='Campaña siguiente',exact=True).tap()
    mobile.wait_for_timeout(800)
    expect(mobile.locator('.mobile-feature-title')).to_have_text('Umbral')
    mobile.get_by_role('button',name='Ver galería de marcas').tap()
    mobile.wait_for_timeout(600)
    assert mobile.evaluate('document.documentElement.scrollWidth===innerWidth')

    # Keyboard and reduced motion.
    keyboard = browser.new_page(viewport={'width':1440,'height':900})
    keyboard.goto(URL)
    keyboard.get_by_role('button',name='Ver una campaña fragmentada').focus()
    keyboard.keyboard.press('Enter')
    expect(keyboard.get_by_role('button',name='Ver una campaña fragmentada')).to_have_attribute('aria-pressed','true')
    keyboard.wait_for_timeout(550)
    keyboard.locator('.feature-slice').first.focus()
    keyboard.keyboard.press('Enter')
    expect(keyboard).to_have_url(URL+'#/tienda/umbral')
    reduced = browser.new_page(viewport={'width':1440,'height':900},reduced_motion='reduce')
    reduced.goto(URL)
    assert reduced.locator('.gallery-strip').first.evaluate('e=>getComputedStyle(e).animationName') == 'none'
    reduced.get_by_role('button',name='Ver una campaña fragmentada').click()
    expect(reduced.locator('.feature-wordmark strong')).to_have_text('Umbral')
    reduced.goto(URL+'#/tienda/umbral')
    assert reduced.locator('.brand-intro .campaign').evaluate('e=>getComputedStyle(e).animationName') == 'none'

    # A future eleventh active brand works without changing app.js or layout code.
    dynamic = browser.new_page(viewport={'width':1440,'height':900})
    source = (ROOT/'data.js').read_text(encoding='utf-8')
    extra = "\nwindow.KURI_DATA.brands.push({...window.KURI_DATA.brands[0],id:'once',name:'Once',order:110,products:[]});"
    dynamic.route('**/data.js',lambda route: route.fulfill(status=200,content_type='application/javascript',body=source+extra))
    dynamic.goto(URL)
    expect(dynamic.locator('.gallery-strip')).to_have_count(11)
    expect(dynamic.get_by_role('button',name='Ver más firmas')).to_be_visible()

    configured = browser.new_page(viewport={'width':1440,'height':900})
    changes = """\nconst b=window.KURI_DATA.brands;
    b.find(x=>x.id==='bies').enabled=false;
    b.find(x=>x.id==='aro').order=0;
    const umbral=b.find(x=>x.id==='umbral');
    umbral.campaigns.push({...umbral.campaigns[0],id:'archive',title:'Archivo alterno'});
    umbral.featuredCampaignId='archive';
    umbral.collections.push({id:'new',status:'active',title:'Nueva edición',story:'Prueba',campaignId:'archive',productIds:['umbral-1']});
    umbral.featuredCollectionId='new';"""
    configured.route('**/data.js',lambda route: route.fulfill(status=200,content_type='application/javascript',body=source+changes))
    configured.goto(URL)
    expect(configured.locator('.gallery-strip')).to_have_count(9)
    expect(configured.locator('.gallery-strip').first).to_have_attribute('data-store','aro')
    configured.get_by_role('button',name='Ver una campaña fragmentada').click()
    configured.wait_for_timeout(600)
    configured.locator('.feature-arrow.next').click()
    configured.wait_for_timeout(600)
    expect(configured.locator('.feature-wordmark small')).to_contain_text('Archivo alterno')
    configured.goto(URL+'#/tienda/umbral')
    expect(configured.locator('#collection-title')).to_have_text('Nueva edición')
    expect(configured.locator('.collection .product')).to_have_count(1)

    assert not errors,errors
    assert not missing,missing
    print('PASS: 10 firmas, 10 campañas con 6 hovers distintos, vídeo demo, scroll, tiendas, carrito, móvil, teclado, movimiento reducido y configuración de firmas/campañas')
    browser.close()

from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(__file__).parent
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge")
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://localhost:8000/")
    assert page.locator(".store-card").count() == 4
    page.screenshot(path=str(out / "12-portada-cuatro-tiendas.png"), full_page=True)
    for store in ["umbral", "bies", "relevo", "plano"]:
        card = page.locator(f".store-card.{store}")
        card.hover()
        page.wait_for_function(f"() => document.querySelector('.store-card.{store} video').currentTime > .1")
        assert not card.locator("video").evaluate("v => v.paused")
        page.mouse.move(5, 850)
        assert card.locator("video").evaluate("v => v.paused")
        card.click()
        assert page.url.endswith(f"#/tienda/{store}")
        page.wait_for_function("() => document.querySelectorAll('.store-page .product').length === 3")
        assert page.locator(".product").count() == 3
        if store in ["relevo", "plano"]:
            page.screenshot(path=str(out / f"13-tienda-{store}.png"), full_page=True)
        page.locator(".collection-link").click()
        page.wait_for_timeout(550)
        assert page.url.endswith(f"#/tienda/{store}")
        page.locator(".back-link").click()
        page.wait_for_function("() => document.querySelectorAll('.store-card').length === 4")
        assert page.locator(".store-card").count() == 4
    page.locator('a[href="#/categorias"]').first.click()
    page.locator(".listing-products .product").first.wait_for()
    assert page.locator(".listing-products .product").count() == 12
    page.locator('a[href="#/categorias/abrigos"]').click()
    page.wait_for_function("() => document.querySelectorAll('.listing-products .product').length === 6")
    assert page.locator(".listing-products .product").count() == 6
    assert "Umbral" in page.locator(".listing-products").inner_text()
    assert "Relevo" in page.locator(".listing-products").inner_text()
    assert "Plano" in page.locator(".listing-products").inner_text()
    page.screenshot(path=str(out / "14-categoria-abrigos.png"), full_page=True)
    page.goto("http://localhost:8000/#/producto/relevo-0")
    assert page.locator(".product-info h1").text_content() == "Blazer de piel recuperada"
    assert page.locator("#size option").count() == 3
    page.screenshot(path=str(out / "15-ficha-producto.png"), full_page=True)
    page.locator("#size").select_option("M")
    page.locator(".add-to-cart").click()
    assert page.url.endswith("#/carrito")
    page.wait_for_function("() => document.querySelectorAll('.cart-row').length === 1")
    assert page.locator(".cart-row").count() == 1
    page.goto("http://localhost:8000/#/producto/bies-0")
    page.locator(".add-to-cart").click()
    page.wait_for_function("() => document.querySelectorAll('.cart-row').length === 2")
    assert page.locator(".cart-row").count() == 2
    assert "Relevo" in page.locator(".cart-page").inner_text()
    assert "Casa Bies" in page.locator(".cart-page").inner_text()
    assert page.locator(".cart-count").text_content() == "2"
    page.screenshot(path=str(out / "16-carrito-multitienda.png"), full_page=True)
    page.reload()
    assert page.locator(".cart-row").count() == 2
    page.locator(".remove-item").first.click()
    assert page.locator(".cart-row").count() == 1
    mobile = browser.new_page(**pw.devices["iPhone 13"])
    mobile.goto("http://localhost:8000/")
    assert mobile.locator(".store-card").count() == 4
    mobile.screenshot(path=str(out / "17-portada-movil-cuatro-tiendas.png"), full_page=True)
    mobile.locator(".gallery").evaluate("gallery => gallery.scrollLeft = gallery.scrollWidth")
    assert mobile.locator(".gallery").evaluate("gallery => gallery.scrollLeft") > 0
    mobile.locator(".store-card.relevo").tap()
    assert mobile.url.endswith("#/tienda/relevo")
    mobile.screenshot(path=str(out / "18-relevo-movil.png"), full_page=True)
    mobile.locator(".collection-link").tap()
    assert mobile.url.endswith("#/tienda/relevo")
    mobile.goto("http://localhost:8000/#/tienda/plano")
    mobile.screenshot(path=str(out / "19-plano-movil.png"), full_page=True)
    mobile.goto("http://localhost:8000/#/categorias/abrigos")
    assert mobile.locator(".product").count() == 6
    mobile.goto("http://localhost:8000/#/producto/plano-0")
    mobile.locator(".add-to-cart").tap()
    mobile.locator(".cart-row").first.wait_for()
    assert mobile.locator(".cart-row").count() == 1
    assert not errors, errors
    print("PASS four stores, hover videos, categories, product pages, shared persistent cart and mobile")
    browser.close()

from pathlib import Path
from playwright.sync_api import sync_playwright

out = Path(__file__).parent
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge")
    page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.goto("http://localhost:8004/")
    strips = page.locator(".gallery-strip")
    assert strips.count() == 10
    rest = [strip.bounding_box() for strip in strips.all()]
    assert [round(box["x"]) for box in rest] == [90 + 128 * i for i in range(10)]
    assert [round(box["y"]) for box in rest] == [111, 141, 176, 141, 111, 176, 141, 111, 176, 111]
    assert not page.locator(".home-label").evaluate("e => e.classList.contains('visible')")
    page.screenshot(path=str(out / "004-desktop-rest.png"))
    strips.nth(2).hover()
    page.wait_for_timeout(650)
    active = [strip.bounding_box() for strip in strips.all()]
    assert [round(box["x"]) for box in active[:4]] == [36, 164, 292, 528]
    assert round(active[2]["width"]) == 216
    assert page.locator(".home-label h1").text_content() == "Plano"
    assert page.locator(".home-label").evaluate("e => e.classList.contains('visible')")
    page.wait_for_function("() => document.querySelector('.gallery-strip.active video').currentTime > .1")
    assert not strips.nth(2).locator("video").evaluate("e => e.paused")
    page.screenshot(path=str(out / "004-desktop-hover.png"))
    page.mouse.move(5, 850)
    page.wait_for_timeout(650)
    assert [round(strip.bounding_box()["x"]) for strip in strips.all()] == [90 + 128 * i for i in range(10)]
    assert strips.nth(2).locator("video").evaluate("e => e.paused")
    assert not page.locator(".home-label").evaluate("e => e.classList.contains('visible')")
    for store in ["umbral", "bies", "relevo", "plano"]:
        page.locator(f'.gallery-strip[data-store="{store}"]').first.click()
        page.locator(".store-page").wait_for()
        assert page.url.endswith(f"#/tienda/{store}")
        assert page.locator(".product").count() == 3
        page.locator(".collection-link").click()
        assert page.url.endswith(f"#/tienda/{store}")
        page.locator(".back-link").click()
        page.locator(".gallery-strip").first.wait_for()
    page.goto("http://localhost:8004/#/categorias/abrigos")
    assert page.locator(".product").count() == 6
    page.goto("http://localhost:8004/#/producto/relevo-0")
    assert page.locator(".product-info h1").text_content() == "Blazer de piel recuperada"
    page.locator(".add-to-cart").click()
    page.locator(".cart-row").first.wait_for()
    page.goto("http://localhost:8004/#/producto/bies-0")
    page.locator(".add-to-cart").click()
    page.wait_for_function("() => document.querySelectorAll('.cart-row').length === 2")
    page.screenshot(path=str(out / "004-cart.png"))
    mobile = browser.new_page(**pw.devices["iPhone 13"])
    mobile.goto("http://localhost:8004/")
    assert mobile.locator(".gallery-strip").count() == 10
    assert mobile.locator(".home-label h1").text_content() == "Umbral"
    mobile.screenshot(path=str(out / "004-mobile-first.png"))
    mobile.locator(".gallery-004").evaluate("e => e.scrollLeft = 420")
    mobile.wait_for_timeout(450)
    selected = mobile.locator(".gallery-strip.active")
    assert selected.count() == 1
    assert mobile.locator(".home-label h1").text_content() in ["Relevo", "Plano", "Casa Bies"]
    mobile.screenshot(path=str(out / "004-mobile-selected.png"))
    selected.tap()
    mobile.locator(".store-page").wait_for()
    assert mobile.url.startswith("http://localhost:8004/#/tienda/")
    assert mobile.locator(".product").count() == 3
    assert not errors, errors
    print("PASS desktop geometry, label fade, hover video, exit, four stores, catalog, category, product, cart, mobile selection and tap")
    browser.close()

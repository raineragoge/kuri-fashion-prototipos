"""Ejecutar con `python -m http.server 8006` desde el directorio 006."""
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

OUT = Path(__file__).parent
URL = "http://127.0.0.1:8006/"

with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge", args=["--mute-audio"])
    desktop = browser.new_page(viewport={"width": 1440, "height": 900})
    errors = []
    desktop.on("pageerror", lambda error: errors.append(str(error)))
    desktop.goto(URL, wait_until="networkidle")
    desktop.evaluate("document.fonts.ready")
    assert desktop.locator(".gallery-layer").evaluate("e => getComputedStyle(e.firstElementChild.firstElementChild).animationName") == "column-in"
    desktop.wait_for_timeout(1200)
    expect(desktop.locator(".gallery-strip")).to_have_count(10)
    expect(desktop.locator(".home-label h1")).to_be_empty()
    desktop.screenshot(path=OUT / "portada-galeria.png")

    gallery_strip = desktop.locator(".gallery-strip").nth(2)
    before = gallery_strip.bounding_box()
    gallery_strip.hover()
    desktop.wait_for_function("document.querySelector('.gallery-strip.active video').currentTime > .2")
    expect(desktop.locator(".home-label h1")).to_have_text("Plano")
    desktop.wait_for_timeout(450)
    assert round(gallery_strip.bounding_box()["width"]) == 216
    desktop.screenshot(path=OUT / "portada-hover.png")
    desktop.mouse.move(5, 80)
    desktop.wait_for_timeout(450)
    assert abs(gallery_strip.bounding_box()["x"] - before["x"]) < 1
    assert gallery_strip.locator("video").evaluate("v => v.paused")

    desktop.get_by_role("button", name="Ver una campaña fragmentada").click()
    desktop.wait_for_timeout(1100)
    assert desktop.locator(".feature-layer").is_visible()
    assert desktop.locator(".gallery-layer").is_hidden()
    expect(desktop.locator(".feature-slice")).to_have_count(6)
    desktop.screenshot(path=OUT / "portada-campana-umbral.png")
    assert desktop.evaluate("document.documentElement.scrollWidth === innerWidth")
    feature_strip = desktop.locator(".feature-slice").nth(2)
    width_before = feature_strip.bounding_box()["width"]
    feature_strip.hover()
    desktop.wait_for_function("document.querySelector('.feature-slice.active video').currentTime > .2")
    desktop.wait_for_timeout(450)
    assert feature_strip.bounding_box()["width"] > width_before + 40
    desktop.screenshot(path=OUT / "campana-hover.png")
    desktop.mouse.move(5, 80)
    desktop.wait_for_timeout(450)
    assert feature_strip.locator("video").evaluate("v => v.paused")
    assert abs(feature_strip.bounding_box()["width"] - width_before) < 1
    desktop.get_by_role("button", name="Campaña siguiente: Casa Bies").click()
    desktop.wait_for_timeout(1100)
    expect(desktop.locator(".feature-wordmark strong")).to_have_text("Casa Bies")
    desktop.screenshot(path=OUT / "portada-campana-bies.png")
    desktop.locator(".feature-slice").nth(3).click()
    expect(desktop).to_have_url(URL + "#/tienda/bies")
    expect(desktop.locator(".brand-interlude")).to_be_visible()
    desktop.locator(".back-link").click()
    expect(desktop.locator(".feature-wordmark strong")).to_have_text("Casa Bies")
    desktop.get_by_role("button", name="Ver galería de marcas").click()
    desktop.wait_for_timeout(1100)
    assert desktop.locator(".gallery-layer").is_visible()
    assert desktop.locator(".feature-layer").is_hidden()
    assert desktop.locator(".gallery-strip").nth(0).evaluate("e => getComputedStyle(e).animationName") == "column-in"
    desktop.screenshot(path=OUT / "portada-regreso.png")

    index = desktop.get_by_role("button", name="Firmas")
    index.click()
    expect(desktop.get_by_role("dialog")).to_be_visible()
    desktop.keyboard.press("Escape")
    expect(index).to_be_focused()
    for brand in ["umbral", "bies", "relevo", "plano"]:
        index.click()
        desktop.locator(f".signature.s-{brand}").click()
        expect(desktop).to_have_url(URL + "#/tienda/" + brand)
        expect(desktop.locator(".brand-interlude")).to_have_class(f"brand-interlude interlude-{brand}")
        desktop.screenshot(path=OUT / f"marca-{brand}.png", full_page=True)
        desktop.get_by_role("button", name="Ver selección").click()
        desktop.locator(".product-image").first.click()
        desktop.locator(".add-to-cart").click()
        desktop.locator(".brand").click()
    desktop.locator(".cart-nav").click()
    expect(desktop.locator(".cart-row")).to_have_count(4)
    desktop.locator(".nav-home[href='#/categorias']").click()
    expect(desktop.locator(".category-filters")).to_be_visible()

    mobile = browser.new_page(**pw.devices["iPhone 13"])
    mobile.on("pageerror", lambda error: errors.append(str(error)))
    mobile.goto(URL, wait_until="networkidle")
    mobile.wait_for_timeout(1300)
    expect(mobile.locator(".gallery-strip.active")).to_have_count(1)
    mobile.screenshot(path=OUT / "movil-galeria.png", scale="css")
    mobile.get_by_role("button", name="Ver una campaña fragmentada").tap()
    mobile.wait_for_timeout(1000)
    mobile.screenshot(path=OUT / "movil-campana.png", scale="css")
    assert mobile.evaluate("document.documentElement.scrollWidth === innerWidth")
    expect(mobile.locator(".mobile-feature-title")).to_have_text("Umbral")
    assert mobile.get_by_role("button", name="Campaña siguiente", exact=True).is_visible()
    assert mobile.locator(".feature-slice").first.bounding_box()["y"] + mobile.locator(".feature-slice").first.bounding_box()["height"] < mobile.get_by_role("button", name="Campaña siguiente", exact=True).bounding_box()["y"]
    mobile.get_by_role("button", name="Campaña siguiente", exact=True).tap()
    mobile.wait_for_timeout(1000)
    expect(mobile.locator(".feature-wordmark strong")).to_have_text("Casa Bies")
    expect(mobile.locator(".mobile-feature-title")).to_have_text("Casa Bies")
    mobile.locator(".feature-layer").evaluate("e => e.scrollLeft = 260")
    mobile.locator(".feature-slice").nth(3).tap()
    expect(mobile).to_have_url(URL + "#/tienda/bies")
    assert mobile.evaluate("document.documentElement.scrollWidth === innerWidth")
    mobile.locator(".brand").tap()
    mobile.get_by_role("button", name="Ver galería de marcas").tap()
    mobile.wait_for_timeout(600)
    assert mobile.locator(".gallery-layer").is_visible()

    keyboard = browser.new_page(viewport={"width": 1440, "height": 900})
    keyboard.goto(URL)
    keyboard.get_by_role("button", name="Ver una campaña fragmentada").focus()
    keyboard.keyboard.press("Enter")
    expect(keyboard.get_by_role("button", name="Ver una campaña fragmentada")).to_have_attribute("aria-pressed", "true")
    keyboard.wait_for_timeout(700)
    keyboard.locator(".feature-slice").first.focus()
    keyboard.keyboard.press("Enter")
    expect(keyboard).to_have_url(URL + "#/tienda/umbral")

    reduced = browser.new_page(viewport={"width": 1440, "height": 900}, reduced_motion="reduce")
    reduced.goto(URL)
    assert reduced.locator(".gallery-strip").first.evaluate("e => getComputedStyle(e).animationName") == "none"
    reduced.get_by_role("button", name="Ver una campaña fragmentada").click()
    expect(reduced.locator(".feature-wordmark strong")).to_have_text("Umbral")
    assert reduced.locator(".feature-slice").first.evaluate("e => getComputedStyle(e).animationName") == "none"
    assert not errors, errors
    print("PASS: dos modos, entradas/salidas, hover y vídeo, navegación de cuatro marcas, bolsa, móvil, teclado y movimiento reducido")
    browser.close()

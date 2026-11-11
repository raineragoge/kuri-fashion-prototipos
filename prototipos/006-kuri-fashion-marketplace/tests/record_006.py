"""Graba la secuencia de entrada y cambio de modos con Playwright."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel="msedge", args=["--mute-audio"])
    context = browser.new_context(
        viewport={"width": 1440, "height": 900},
        record_video_dir=OUT,
        record_video_size={"width": 960, "height": 600},
    )
    page = context.new_page()
    page.goto("http://127.0.0.1:8006/", wait_until="networkidle")
    page.wait_for_timeout(1450)
    page.get_by_role("button", name="Ver una campaña fragmentada").click()
    page.wait_for_timeout(1300)
    page.locator(".feature-slice").nth(2).hover()
    page.wait_for_timeout(850)
    page.mouse.move(3, 80)
    page.wait_for_timeout(550)
    page.get_by_role("button", name="Campaña siguiente: Casa Bies").click()
    page.wait_for_timeout(1250)
    page.get_by_role("button", name="Ver galería de marcas").click()
    page.wait_for_timeout(1400)
    context.close()
    Path(page.video.path()).replace(OUT / "animaciones.webm")
    browser.close()

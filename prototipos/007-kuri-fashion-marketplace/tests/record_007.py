"""Records a short visual walkthrough of the new home and a firm entrance."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge', args=['--mute-audio'])
    context = browser.new_context(
        viewport={'width':1440,'height':900},
        record_video_dir=OUT,
        record_video_size={'width':960,'height':600},
    )
    page = context.new_page()
    page.goto('http://127.0.0.1:8007/', wait_until='networkidle')
    page.wait_for_timeout(1300)
    page.locator('.gallery-strip').nth(4).hover()
    page.wait_for_timeout(700)
    page.mouse.move(5,80)
    page.get_by_role('button',name='Ver una campaña fragmentada').click()
    page.wait_for_timeout(1150)
    page.locator('.feature-arrow.next').click()
    page.wait_for_timeout(1000)
    page.locator('.feature-slice').nth(2).hover()
    page.wait_for_timeout(650)
    page.mouse.move(5,80)
    page.get_by_role('button',name='Ver galería de marcas').click()
    page.wait_for_timeout(1050)
    page.locator('.home-campaign').scroll_into_view_if_needed()
    page.wait_for_timeout(1000)
    page.goto('http://127.0.0.1:8007/#/tienda/vertice',wait_until='networkidle')
    page.wait_for_timeout(1000)
    page.locator('.brand-panorama').scroll_into_view_if_needed()
    page.wait_for_timeout(1000)
    context.close()
    Path(page.video.path()).replace(OUT/'recorrido-007.webm')
    browser.close()

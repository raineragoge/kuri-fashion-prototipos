"""Optional full-page visual review of four contrasting brands."""
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path(__file__).parent
with sync_playwright() as pw:
    browser = pw.chromium.launch(channel='msedge',args=['--mute-audio'])
    page = browser.new_page(viewport={'width':1440,'height':900})
    for brand in ['umbral','bies','vertice','aro']:
        page.goto(f'http://127.0.0.1:8007/#/tienda/{brand}',wait_until='networkidle')
        page.wait_for_timeout(750)
        for item in page.locator('.reveal').all():
            item.evaluate('e=>e.scrollIntoView({behavior:"instant",block:"center"})')
            page.wait_for_timeout(90)
        page.wait_for_timeout(850)
        page.evaluate('scrollTo({top:0,behavior:"instant"})')
        page.wait_for_timeout(150)
        page.screenshot(path=OUT/f'escaparate-completo-{brand}.png',full_page=True)
    browser.close()

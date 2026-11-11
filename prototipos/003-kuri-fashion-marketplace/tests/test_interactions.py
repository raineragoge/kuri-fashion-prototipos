from playwright.sync_api import sync_playwright
from pathlib import Path
out=Path(__file__).parent
out.mkdir(exist_ok=True)
with sync_playwright() as pw:
 browser=pw.chromium.launch(channel='msedge')
 page=browser.new_page(viewport={'width':1440,'height':900},device_scale_factor=1)
 page.goto('http://localhost:8000/')
 page.locator('.store-card img').first.wait_for()
 page.screenshot(path=str(out/'01-portada-escritorio.png'),full_page=True)
 card=page.locator('.store-card.umbral')
 initial=card.locator('.look').bounding_box()
 card.hover()
 page.wait_for_timeout(600)
 expanded=card.locator('.look').bounding_box()
 video=card.locator('video')
 page.wait_for_function("() => document.querySelector('.store-card.umbral video').currentTime > .15")
 assert expanded['width']-initial['width']>35,(initial,expanded)
 assert not video.evaluate('(v)=>v.paused')
 page.screenshot(path=str(out/'02-hover-umbral.png'))
 page.mouse.move(10,700)
 page.wait_for_timeout(600)
 restored=card.locator('.look').bounding_box()
 assert abs(restored['width']-initial['width'])<1,(initial,restored)
 assert video.evaluate('(v)=>v.paused')
 card.click()
 page.wait_for_timeout(400)
 assert page.locator('#store-title').text_content()=='Umbral'
 assert page.locator('.product').count()==3
 page.screenshot(path=str(out/'08-tienda-umbral-revisada.png'),full_page=True)
 umbral_url=page.url
 page.locator('.collection-link').click()
 page.wait_for_timeout(700)
 assert page.url==umbral_url
 assert page.locator('#store-title').text_content()=='Umbral'
 assert page.locator('.collection').bounding_box()['y']<page.viewport_size['height']
 page.locator('.back-link').click()
 page.locator('.store-card.bies').click()
 assert page.locator('#store-title').text_content()=='Casa Bies'
 assert page.locator('.product').count()==3
 page.screenshot(path=str(out/'09-tienda-casa-bies-revisada.png'),full_page=True)
 bies_url=page.url
 page.locator('.collection-link').click()
 page.wait_for_timeout(700)
 assert page.url==bies_url
 assert page.locator('#store-title').text_content()=='Casa Bies'
 assert page.locator('.collection').bounding_box()['y']<page.viewport_size['height']
 page.goto('http://localhost:8000/#/tienda/umbral')
 assert page.locator('#store-title').text_content()=='Umbral'
 mobile=browser.new_page(**pw.devices['iPhone 13'])
 mobile.goto('http://localhost:8000/')
 mobile.screenshot(path=str(out/'05-portada-movil.png'),full_page=True)
 mobile.locator('.store-card.umbral').tap()
 assert mobile.locator('#store-title').text_content()=='Umbral'
 mobile.screenshot(path=str(out/'10-umbral-movil-revisada.png'),full_page=True)
 mobile.locator('.collection-link').tap()
 mobile.wait_for_timeout(700)
 assert mobile.locator('#store-title').text_content()=='Umbral'
 assert mobile.url.endswith('#/tienda/umbral')
 assert mobile.locator('.collection').bounding_box()['y']<mobile.viewport_size['height']
 mobile.locator('.back-link').tap()
 mobile.locator('.store-card.bies').tap()
 assert mobile.locator('#store-title').text_content()=='Casa Bies'
 mobile.screenshot(path=str(out/'11-casa-bies-movil-revisada.png'),full_page=True)
 mobile.locator('.collection-link').tap()
 mobile.wait_for_timeout(700)
 assert mobile.locator('#store-title').text_content()=='Casa Bies'
 assert mobile.url.endswith('#/tienda/bies')
 assert mobile.locator('.collection').bounding_box()['y']<mobile.viewport_size['height']
 mobile.locator('.back-link').tap()
 mobile.wait_for_function("() => document.querySelectorAll('.store-card').length === 4")
 assert mobile.locator('.store-card').count()==4
 print('PASS desktop hover width',round(initial['width']),round(expanded['width']),round(restored['width']))
 print('PASS video play/pause; both stores, 3 products each; back; direct route; mobile taps')
 browser.close()

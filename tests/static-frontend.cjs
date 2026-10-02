const { chromium } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

async function verify(viewport) {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport });
  const root = path.resolve(__dirname, '..');

  await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await page.waitForSelector('.hero-slide.active');
  if (!(await page.locator('.brand').isVisible())) throw new Error('Brand is not visible');
  if (await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) {
    throw new Error(`Horizontal overflow at ${viewport.width}px`);
  }

  if (viewport.width < 980) await page.locator('[data-nav-toggle]').click();
  const localeButtons = await page.locator('button[data-locale]').count();
  if (localeButtons !== 3) throw new Error('Language selector is incomplete');
  if (await page.locator('button[data-market]').count()) throw new Error('Legacy market selector is still present');

  await page.goto(pathToFileURL(path.join(root, 'projects.html')).href);
  await page.waitForSelector('.project-card');
  const text = await page.locator('body').innerText();
  if (!/Haiti|Haïti|Ayiti/.test(text) || !/United States|États-Unis|Etazini/.test(text)) {
    throw new Error('Projects from both regions are not visible');
  }
  if (await page.locator('.project-card').count() < 9) throw new Error('The enriched project collection is incomplete');

  await page.goto(pathToFileURL(path.join(root, 'portfolio.html')).href);
  await page.waitForSelector('.book-page');
  if (await page.locator('.book-gallery-item img').count() < 43) throw new Error('The portfolio book does not expose the full image collection');
  const galleryLayoutsAreGrids = await page.locator('.book-gallery-layout').evaluateAll((layouts) => layouts.every((layout) => {
    const style = getComputedStyle(layout);
    return style.display === 'grid' && style.gridTemplateRows !== 'none';
  }));
  if (!galleryLayoutsAreGrids) throw new Error('Portfolio gallery pages are not using the full-height inner grid');

  await page.goto(pathToFileURL(path.join(root, 'contact.html')).href);
  if (!(await page.locator('a[href="tel:+12038485807"]').isVisible())) throw new Error('Phone contact is missing');
  if (!(await page.locator('a[href="mailto:mariegmentor@gmail.com"]').isVisible())) throw new Error('Email contact is missing');

  const brokenImages = await page.locator('img').evaluateAll((images) => images.filter((image) => !image.complete || !image.naturalWidth).length);
  if (brokenImages) throw new Error(`Found ${brokenImages} broken contact images`);

  await browser.close();
}

(async () => {
  await verify({ width: 1440, height: 1000 });
  await verify({ width: 390, height: 844 });
  console.log('Unified static site smoke tests passed on desktop and mobile.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

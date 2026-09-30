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
  const text = await page.locator('body').innerText();
  if (!/Haiti|Haïti|Ayiti/.test(text) || !/United States|États-Unis|Etazini/.test(text)) {
    throw new Error('Projects from both regions are not visible');
  }

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

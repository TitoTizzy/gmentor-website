const { chromium } = require('@playwright/test');
const path = require('path');
const { pathToFileURL } = require('url');

async function verify(viewport) {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage({ viewport });
  const root = path.resolve(__dirname, '..', 'frontend');

  await page.goto(pathToFileURL(path.join(root, 'index.html')).href);
  await page.waitForSelector('.hero-slide.active');
  if (!(await page.locator('.brand').isVisible())) throw new Error('Brand is not visible');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  if (overflow) throw new Error(`Horizontal overflow at ${viewport.width}px`);

  if (viewport.width < 980) await page.locator('[data-nav-toggle]').click();
  await page.getByRole('button', { name: 'USA' }).click();
  const market = await page.locator('html').getAttribute('data-market');
  if (market !== 'us') throw new Error('Market selector did not update');

  await page.goto(pathToFileURL(path.join(root, 'projects.html')).href);
  if (viewport.width < 980) await page.locator('[data-nav-toggle]').click();
  await page.getByRole('button', { name: 'USA' }).click();
  if (!(await page.getByText('Townhouse', { exact: true }).isVisible())) throw new Error('USA project is not visible');

  await browser.close();
}

(async () => {
  await verify({ width: 1440, height: 1000 });
  await verify({ width: 390, height: 844 });
  console.log('Static frontend smoke tests passed on desktop and mobile.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

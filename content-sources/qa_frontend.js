import { createRequire } from "module";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, "..", "frontend");
const output = path.resolve(__dirname, "qa-screenshots");

(async () => {
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on("console", message => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", error => errors.push(error.message));

  async function inspect(name, file, action) {
    await page.goto(`file:///${path.join(root, file).replace(/\\/g, "/")}`);
    if (action) await action();
    await page.locator("[data-consent]").evaluateAll(elements => elements.forEach(element => { element.hidden = true; }));
    const brokenImages = await page.evaluate(async () => {
      const sources = Array.from(new Set(Array.from(document.images, image => image.src)));
      const results = await Promise.all(sources.map(source => new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(null);
        image.onerror = () => resolve(source);
        image.src = source;
      })));
      return results.filter(Boolean);
    });
    await page.waitForTimeout(350);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    await page.screenshot({ path: path.join(output, `${name}.png`), fullPage: true });
    return { name, brokenImages, horizontalOverflow: overflow, title: await page.title() };
  }

  require("fs").mkdirSync(output, { recursive: true });
  const results = [];
  results.push(await inspect("home-haiti-desktop", "index.html", async () => page.getByRole("button", { name: "Haïti" }).click()));
  results.push(await inspect("home-usa-desktop", "index.html", async () => page.getByRole("button", { name: "USA" }).click()));
  results.push(await inspect("about-usa-desktop", "about.html", async () => page.getByRole("button", { name: "USA" }).click()));
  results.push(await inspect("project-beach-house-desktop", "project.html?slug=beach-house-pierre-payen"));
  results.push(await inspect("portfolio-haiti-desktop", "portfolio.html", async () => {
    await page.getByRole("button", { name: "Haïti" }).click();
    await page.locator("[data-book-next]").click();
    await page.waitForTimeout(950);
    await page.locator("[data-book-next]").click();
    await page.waitForTimeout(950);
  }));

  await page.setViewportSize({ width: 390, height: 844 });
  results.push(await inspect("home-haiti-mobile", "index.html", async () => {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("button", { name: "Haïti" }).click();
  }));
  results.push(await inspect("project-townhouse-mobile", "project.html?slug=townhouse-waterbury"));
  results.push(await inspect("portfolio-usa-mobile", "portfolio.html", async () => {
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page.getByRole("button", { name: "USA" }).click();
    await page.locator("[data-book-next]").click();
    await page.waitForTimeout(950);
    await page.locator("[data-book-next]").click();
    await page.waitForTimeout(950);
  }));

  console.log(JSON.stringify({ results, errors }, null, 2));
  await browser.close();
})();

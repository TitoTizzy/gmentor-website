import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshots = path.join(root, "content-sources", "qa-screenshots");

function fileUrl(variant, file) {
  return `file:///${path.join(root, "dist-sites", variant, file).replace(/\\/g, "/")}`;
}

(async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  async function inspect(variant, file, action, viewport = { width: 1440, height: 1000 }) {
    await page.setViewportSize(viewport);
    await page.goto(fileUrl(variant, file));
    if (action) await action();
    await page.locator("[data-consent]").evaluateAll((items) => items.forEach((item) => { item.hidden = true; }));
    await page.waitForTimeout(250);
    const result = await page.evaluate(async () => {
      const sources = [...new Set([...document.images].map((image) => image.src))];
      const brokenImages = (await Promise.all(sources.map((source) => new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(null);
        image.onerror = () => resolve(source);
        image.src = source;
      })))).filter(Boolean);
      return {
        lang: document.documentElement.lang,
        market: document.documentElement.dataset.market,
        marketButtons: document.querySelectorAll("button[data-market]").length,
        localeButtons: document.querySelectorAll("button[data-locale]").length,
        brokenImages,
        haitiImages: sources.filter((source) => /images\/haiti\//i.test(source)),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        visibleText: document.body.innerText
      };
    });
    const size = viewport.width < 600 ? "mobile" : "desktop";
    await page.screenshot({ path: path.join(screenshots, `variant-${variant}-${path.basename(file, ".html")}-${size}.png`), fullPage: true });
    return { variant, file, size, ...result };
  }

  const results = [];
  results.push(await inspect("usa", "index.html"));
  results.push(await inspect("usa", "about.html"));
  results.push(await inspect("usa", "contact.html"));
  results.push(await inspect("usa", "portfolio.html"));
  results.push(await inspect("haiti", "index.html", async () => page.getByRole("button", { name: "Haïti" }).click()));
  results.push(await inspect("haiti", "about.html", async () => page.getByRole("button", { name: "Haïti" }).click()));
  results.push(await inspect("usa", "index.html", async () => {
    await page.locator("[data-nav-toggle]").click();
  }, { width: 390, height: 844 }));
  results.push(await inspect("usa", "about.html", null, { width: 390, height: 844 }));
  results.push(await inspect("haiti", "index.html", async () => {
    await page.locator("[data-nav-toggle]").click();
    await page.getByRole("button", { name: "Haïti" }).click();
  }, { width: 390, height: 844 }));

  const failures = [];
  for (const result of results) {
    if (result.brokenImages.length) failures.push(`${result.variant}/${result.file}: broken images`);
    if (result.horizontalOverflow) failures.push(`${result.variant}/${result.file}: horizontal overflow`);
    if (result.variant === "usa" && (result.market !== "us" || result.lang !== "en")) failures.push(`${result.file}: USA locale is not locked`);
    if (result.variant === "usa" && (result.marketButtons || result.localeButtons)) failures.push(`${result.file}: USA controls are visible`);
    if (result.variant === "usa" && result.haitiImages.length) failures.push(`${result.file}: Haiti image was loaded`);
    if (result.variant === "usa" && /Haïti|Haiti/.test(result.visibleText)) failures.push(`${result.file}: Haiti content is visible`);
    if (result.variant === "haiti" && result.marketButtons !== 2) failures.push(`${result.file}: dual-market controls are missing`);
  }

  console.log(JSON.stringify({
    results: results.map(({ visibleText, ...result }) => result),
    errors,
    failures
  }, null, 2));
  await browser.close();
  if (errors.length || failures.length) process.exitCode = 1;
})();

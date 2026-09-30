import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshots = path.join(root, "content-sources", "qa-screenshots");

function rootFileUrl(file) {
  return `file:///${path.join(root, file).replace(/\\/g, "/")}`;
}

function fileUrl(variant, file) {
  const directory = variant === "global" ? "haiti" : variant;
  return `file:///${path.join(root, "sites", directory, file).replace(/\\/g, "/")}`;
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

  async function inspect(variant, file, action, viewport = { width: 1440, height: 1000 }, url = fileUrl(variant, file)) {
    await page.setViewportSize(viewport);
    await page.goto(url);
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
        pathname: new URL(location.href).pathname,
        lang: document.documentElement.lang,
        market: document.documentElement.dataset.market,
        marketButtons: document.querySelectorAll("button[data-market]").length,
        localeButtons: document.querySelectorAll("button[data-locale]").length,
        publicAdminLinks: document.querySelectorAll('a[href*="admin/"]').length,
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
  const entrypoints = [];
  for (const [file, expectedPath] of [
    ["index.html", "/sites/usa/index.html"],
    ["indexhaiti.html", "/indexhaiti.html"],
    ["frontend/index.html", "/sites/usa/index.html"]
  ]) {
    await page.goto(rootFileUrl(file));
    await page.waitForTimeout(100);
    entrypoints.push({ file, expectedPath, destination: new URL(page.url()).pathname });
  }
  results.push(await inspect("usa", "index.html"));
  results.push(await inspect("usa", "about.html"));
  results.push(await inspect("usa", "contact.html"));
  results.push(await inspect("usa", "portfolio.html"));
  results.push(await inspect("global", "index.html"));
  results.push(await inspect("global", "about.html"));
  const localeChecks = [];
  for (const locale of ["en", "fr", "kr"]) {
    await page.goto(fileUrl("global", "about.html"));
    await page.locator(`button[data-locale="${locale}"]`).click();
    await page.waitForTimeout(150);
    const check = await page.evaluate(() => {
      const stage = document.querySelector(".portrait-stage");
      const rect = stage && stage.getBoundingClientRect();
      return {
        locale: document.documentElement.dataset.locale,
        lang: document.documentElement.lang,
        text: document.body.innerText,
        portraitRatio: rect ? Number((rect.width / rect.height).toFixed(2)) : null,
        geometryCount: document.querySelectorAll(".portrait-geometry").length
      };
    });
    await page.screenshot({ path: path.join(screenshots, `language-about-${locale}.png`), fullPage: false });
    await page.locator(".about-portrait").first().screenshot({ path: path.join(screenshots, `portrait-about-${locale}.png`) });
    localeChecks.push(check);
  }
  results.push(await inspect("global", "portfolio.html"));
  results.push(await inspect("global-root", "indexhaiti.html", null, { width: 1440, height: 1000 }, rootFileUrl("indexhaiti.html")));
  results.push(await inspect("global-root-nav", "indexhaiti.html", async () => {
    await page.locator('a[href="sites/haiti/about.html"]').click();
  }, { width: 1440, height: 1000 }, rootFileUrl("indexhaiti.html")));
  results.push(await inspect("usa", "index.html", async () => {
    await page.locator("[data-nav-toggle]").click();
  }, { width: 390, height: 844 }));
  results.push(await inspect("usa", "about.html", null, { width: 390, height: 844 }));
  results.push(await inspect("global", "index.html", async () => {
    await page.locator("[data-nav-toggle]").click();
  }, { width: 390, height: 844 }));
  results.push(await inspect("global-root", "indexhaiti.html", null, { width: 390, height: 844 }, rootFileUrl("indexhaiti.html")));

  const failures = [];
  for (const entrypoint of entrypoints) {
    if (!entrypoint.destination.endsWith(entrypoint.expectedPath)) {
      failures.push(`${entrypoint.file}: redirects to ${entrypoint.destination}`);
    }
  }
  for (const result of results) {
    if (result.brokenImages.length) failures.push(`${result.variant}/${result.file}: broken images`);
    if (result.horizontalOverflow) failures.push(`${result.variant}/${result.file}: horizontal overflow`);
    if (result.publicAdminLinks) failures.push(`${result.variant}/${result.file}: administration link is public`);
    if (result.variant === "usa" && (result.market !== "us" || result.lang !== "en")) failures.push(`${result.file}: USA locale is not locked`);
    if (result.variant === "usa" && (result.marketButtons || result.localeButtons)) failures.push(`${result.file}: USA controls are visible`);
    if (result.variant === "usa" && result.haitiImages.length) failures.push(`${result.file}: Haiti image was loaded`);
    if (result.variant === "usa" && /Haïti|Haiti/.test(result.visibleText)) failures.push(`${result.file}: Haiti content is visible`);
    if (result.variant === "usa" && /Architectural Designer|Architectural design|Architectural services|Architectural drawings/i.test(result.visibleText)) failures.push(`${result.file}: restricted professional wording is visible`);
    if (result.variant === "usa" && !/Building Designer/.test(result.visibleText)) failures.push(`${result.file}: Building Designer positioning is missing`);
    if (result.variant === "usa" && !/Not a licensed architect in Connecticut or New York/i.test(result.visibleText)) failures.push(`${result.file}: license disclosure is missing`);
    if (result.variant.indexOf("global") === 0 && (result.market !== "global" || result.marketButtons !== 0 || result.localeButtons !== 3)) failures.push(`${result.file}: global portal controls are incorrect`);
    if (result.variant === "global-root-nav" && !result.pathname.endsWith("/sites/haiti/about.html")) failures.push(`${result.file}: global navigation opened ${result.pathname}`);
  }
  const expectedLocaleText = {
    en: "From architectural studies to project leadership.",
    fr: "Des études d’architecture à la direction de projets.",
    kr: "Soti nan etid achitekti rive nan direksyon pwojè."
  };
  for (const check of localeChecks) {
    if (!check.text.includes(expectedLocaleText[check.locale])) failures.push(`${check.locale}: biography was not translated`);
    if (check.portraitRatio < 0.9) failures.push(`${check.locale}: portrait frame remains too tall (${check.portraitRatio})`);
    if (check.geometryCount !== 3) failures.push(`${check.locale}: portrait geometry is missing`);
  }

  console.log(JSON.stringify({
    entrypoints,
    results: results.map(({ visibleText, ...result }) => result),
    localeChecks: localeChecks.map(({ text, ...check }) => check),
    errors,
    failures
  }, null, 2));
  await browser.close();
  if (errors.length || failures.length) process.exitCode = 1;
})();

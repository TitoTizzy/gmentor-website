import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const screenshots = path.join(root, "content-sources", "qa-screenshots");

function fileUrl(file) {
  return `file:///${path.join(root, file).replace(/\\/g, "/")}`;
}

(async () => {
  fs.mkdirSync(screenshots, { recursive: true });
  const browser = await chromium.launch({ channel: "msedge", headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  const failures = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  async function inspect(file, viewport = { width: 1440, height: 1000 }, action) {
    await page.setViewportSize(viewport);
    await page.goto(fileUrl(file));
    if (action) await action();
    await page.locator("[data-consent]").evaluateAll((items) => items.forEach((item) => { item.hidden = true; }));
    await page.waitForTimeout(200);
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
        site: document.documentElement.dataset.site,
        localeButtons: document.querySelectorAll("button[data-locale]").length,
        marketButtons: document.querySelectorAll("button[data-market]").length,
        publicAdminLinks: document.querySelectorAll('a[href*="admin/"]').length,
        brokenImages,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        visibleText: document.body.innerText
      };
    });
    const size = viewport.width < 600 ? "mobile" : "desktop";
    await page.screenshot({ path: path.join(screenshots, `unified-${path.basename(file, ".html")}-${size}.png`), fullPage: true });
    return { file, size, ...result };
  }

  const results = [];
  for (const file of ["index.html", "about.html", "projects.html", "portfolio.html", "contact.html"]) {
    results.push(await inspect(file));
  }
  results.push(await inspect("index.html", { width: 390, height: 844 }, async () => {
    await page.locator("[data-nav-toggle]").click();
  }));
  results.push(await inspect("about.html", { width: 390, height: 844 }));

  const localeChecks = [];
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const locale of ["en", "fr", "kr"]) {
    await page.goto(fileUrl("about.html"));
    await page.locator(`button[data-locale="${locale}"]`).click();
    await page.waitForTimeout(150);
    localeChecks.push(await page.evaluate(() => {
      const stage = document.querySelector(".portrait-stage");
      const rect = stage && stage.getBoundingClientRect();
      return {
        locale: document.documentElement.dataset.locale,
        lang: document.documentElement.lang,
        text: document.body.innerText,
        portraitRatio: rect ? Number((rect.width / rect.height).toFixed(2)) : null,
        geometryCount: document.querySelectorAll(".portrait-geometry").length
      };
    }));
  }

  const themeChecks = [];
  for (const theme of ["dark", "light"]) {
    await page.goto(fileUrl("index.html"));
    await page.evaluate((value) => localStorage.setItem("mgm-theme", value), theme);
    await page.reload();
    themeChecks.push(await page.evaluate(() => ({
      theme: document.documentElement.dataset.theme,
      logoContent: getComputedStyle(document.querySelector(".theme-logo")).content
    })));
  }

  for (const result of results) {
    if (result.site !== "unified") failures.push(`${result.file}: unified site marker is missing`);
    if (result.localeButtons !== 3 || result.marketButtons !== 0) failures.push(`${result.file}: language controls are incorrect`);
    if (result.publicAdminLinks) failures.push(`${result.file}: administration link is public`);
    if (result.brokenImages.length) failures.push(`${result.file}: broken images`);
    if (result.horizontalOverflow) failures.push(`${result.file}: horizontal overflow`);
  }
  const combinedText = results.filter((result) => result.file === "about.html" || result.file === "projects.html").map((result) => result.visibleText).join(" ");
  if (!/Haïti|Haiti|Ayiti/.test(combinedText) || !/États-Unis|United States|Etazini/.test(combinedText)) failures.push("The unified site does not expose both Haiti and United States content");

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
  if (!themeChecks.find((check) => check.theme === "dark" && /mgm-mark-white\.png/.test(check.logoContent))) failures.push("Dark theme does not use the white logo");
  if (!themeChecks.find((check) => check.theme === "light" && /mgm-mark-black\.png/.test(check.logoContent))) failures.push("Light theme does not use the black logo");

  console.log(JSON.stringify({
    results: results.map(({ visibleText, ...result }) => result),
    localeChecks: localeChecks.map(({ text, ...check }) => check),
    themeChecks,
    errors,
    failures
  }, null, 2));
  await browser.close();
  if (errors.length || failures.length) process.exitCode = 1;
})();

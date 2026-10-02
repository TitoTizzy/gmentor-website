import { expect, test } from '@playwright/test';

async function exposeHeaderTools(page: import('@playwright/test').Page) {
  if ((page.viewportSize()?.width ?? 1200) < 980) {
    await page.getByRole('button', { name: 'Ouvrir le menu' }).click();
  }
}

test('home exposes one portfolio and language preferences', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  await exposeHeaderTools(page);
  await expect(page.getByRole('button', { name: 'EN', exact: true })).toBeVisible();
  await expect(page.locator('[data-market-button]')).toHaveCount(0);
});

test('projects from both countries share one catalogue', async ({ page }) => {
  await page.goto('/projects', { waitUntil: 'domcontentloaded' });
  await expect(page.getByText('Townhouse', { exact: true })).toBeVisible();
  await expect(page.getByText('Beach House', { exact: true })).toBeVisible();
});

test('contact form has required privacy consent', async ({ page }) => {
  await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  await expect(page.getByLabel(/politique de confidentialité/i)).toBeVisible();
});

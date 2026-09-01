import { test, expect } from '@playwright/test';

// Privacy-policy smoke test — a render canary, intentionally minimal.
//
// The /privacy page is required by Meta App Review for the WhatsApp app
// ("Buy Like Local"): reviewers open both the Privacy Policy URL and the
// Data Deletion URL (/privacy#data-deletion), so this proves the page
// serves a 200, renders its <h1>, and carries the #data-deletion anchor.
// Assertions are structural, not copy-based, so legal copy edits do NOT
// break CI.
test('privacy policy page renders with the data-deletion section', async ({ page }) => {
  // 1. Page responds 200.
  const response = await page.goto('/privacy');
  expect(response?.status()).toBe(200);

  // 2. The <h1> renders.
  await expect(page.locator('h1')).toBeVisible({ timeout: 10_000 });

  // 3. The data-deletion anchor target exists and is reachable — Meta's
  //    Data Deletion URL points at /privacy#data-deletion.
  const dataDeletion = page.locator('#data-deletion');
  await expect(dataDeletion).toBeVisible();
  await expect(dataDeletion.locator('h2')).toBeVisible();

  // 4. A deletion-request contact channel renders (asserted by href).
  await expect(page.locator('a[href^="mailto:"]').first()).toBeVisible();
});

test('landing footer links to the privacy policy', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href="/privacy"]')).toBeVisible({ timeout: 10_000 });
});

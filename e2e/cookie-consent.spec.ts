import { test, expect, type Page } from '@playwright/test';

// The cookie banner updates the ChatGPT Ads pixel's consent during the same visit
// (components/cookie-banner.tsx), as https://developers.openai.com/ads/measurement-pixel asks.
//
// CI builds without NEXT_PUBLIC_OPENAI_PIXEL_ID, so the real snippet isn't on the page. Instead
// window.oaiq is the official stub's shape (a function queueing its calls in .q), installed before
// any page script; with a pixel id set, the snippet finds it and doesn't replace it.

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|facebook\.net|concierge-crm\.vercel\.app|openai\.com/, (r) =>
    r.abort(),
  );
  await page.addInitScript(() => {
    const q = function (...args: unknown[]) {
      q.q.push(args);
    } as ((...args: unknown[]) => void) & { q: unknown[][] };
    q.q = [];
    (window as unknown as { oaiq: typeof q }).oaiq = q;
  });
});

const queue = (page: Page) => page.evaluate(() => (window as unknown as { oaiq: { q: unknown[][] } }).oaiq.q);

test('Decline sets the pixel consent to false', async ({ page }) => {
  await page.goto('/en/faq');
  await page.getByRole('button', { name: 'Decline', exact: true }).click();
  await expect.poll(() => queue(page)).toContainEqual(['consent', false]);
  expect(await page.evaluate(() => localStorage.getItem('cookie_consent'))).toBe('denied');
});

test('Accept sets the pixel consent to true', async ({ page }) => {
  await page.goto('/en/faq');
  await page.getByRole('button', { name: 'Accept', exact: true }).click();
  await expect.poll(() => queue(page)).toContainEqual(['consent', true]);
  expect(await page.evaluate(() => localStorage.getItem('cookie_consent'))).toBe('granted');
});

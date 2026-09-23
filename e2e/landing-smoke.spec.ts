import { test, expect } from '@playwright/test';

// Landing-page smoke test — a render canary, intentionally minimal.
//
// Proves the marketing landing page boots, hydrates, and shows its hero with
// both CTAs. Assertions are structural (hero section, <h1>, the WhatsApp link
// by href, the secondary button) rather than copy-based, so routine marketing
// copy edits do NOT break CI. It does not exercise the WhatsApp deep link or
// the chat widget — those leave the page / hit third parties.
test('landing page renders hero with both CTAs', async ({ page }) => {
  // 1. Page responds 200.
  const response = await page.goto('/');
  expect(response?.status()).toBe(200);

  // 2. Hero section + <h1> visible (proves React hydrated the landing page).
  //    page.tsx marks the hero <section> with data-section="hero".
  const hero = page.locator('[data-section="hero"]');
  await expect(hero).toBeVisible({ timeout: 10_000 });
  await expect(hero.locator('h1')).toBeVisible();

  // 3. Dual CTA — both must render.
  //    Primary   = WhatsApp deep link — asserted by href (copy-independent).
  //    Secondary = the "chat here" button that opens the chat widget.
  await expect(hero.locator('a[href*="wa.me"]').first()).toBeVisible();
  await expect(hero.locator('button').first()).toBeVisible();

  // 4. Trust band renders right after the hero.
  await expect(page.locator('[data-section="trust"]')).toBeVisible();
});

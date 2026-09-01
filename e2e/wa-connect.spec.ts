import { test, expect } from '@playwright/test';

// /wa-connect smoke test — a render canary, intentionally minimal.
//
// The page is an internal one-shot tool that launches Meta's WhatsApp
// Embedded Signup. We only assert our own rendering (200, disabled state
// without config_id, enabled button with one) — the FB JS SDK itself is
// Meta's code and is NOT under test, so its request is aborted to keep the
// run hermetic.
test.beforeEach(async ({ page }) => {
  await page.route('**/connect.facebook.net/**', (route) => route.abort());
});

test('wa-connect renders and disables the button without config_id', async ({ page }) => {
  const response = await page.goto('/wa-connect');
  expect(response?.status()).toBe(200);

  // Instruction line for the missing param renders.
  await expect(page.getByText('Missing config_id', { exact: false })).toBeVisible({
    timeout: 10_000,
  });

  // Launch button exists but is disabled.
  await expect(page.getByRole('button', { name: 'Connect WhatsApp' })).toBeDisabled();
});

test('wa-connect enables the button when config_id is present', async ({ page }) => {
  await page.goto('/wa-connect?config_id=test');

  await expect(page.getByRole('button', { name: 'Connect WhatsApp' })).toBeEnabled({
    timeout: 10_000,
  });

  // The configuration id is echoed back so the operator can sanity-check it.
  await expect(page.getByText('test', { exact: true })).toBeVisible();
});

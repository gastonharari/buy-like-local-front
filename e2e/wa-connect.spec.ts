import { test, expect } from '@playwright/test';

// /wa-connect smoke test — a render canary, intentionally minimal.
//
// The page is an internal one-shot tool that launches Meta's WhatsApp
// Embedded Signup (Coexistence) and posts the resulting code to the CRM
// backend. We only assert our own rendering (200, disabled state without
// config_id / token, enabled with both) — the FB JS SDK itself is Meta's
// code and is NOT under test, so its request is aborted to keep the run
// hermetic, and no backend call is ever made here.
test.beforeEach(async ({ page }) => {
  await page.route('**/connect.facebook.net/**', (route) => route.abort());
});

test('wa-connect renders and disables the button without config_id', async ({ page }) => {
  const response = await page.goto('/wa-connect');
  expect(response?.status()).toBe(200);

  // Instruction line for the missing param renders (unless the env pins one).
  if (!process.env.NEXT_PUBLIC_WA_CONFIG_ID) {
    await expect(page.getByText('Missing config_id', { exact: false })).toBeVisible({
      timeout: 10_000,
    });
  }

  // Launch button exists but is disabled (no config id, no token).
  await expect(page.getByRole('button', { name: 'Connect WhatsApp' })).toBeDisabled();
});

test('wa-connect enables the button once config_id and the internal token are present', async ({ page }) => {
  await page.goto('/wa-connect?config_id=test');

  const button = page.getByRole('button', { name: 'Connect WhatsApp' });
  await expect(button).toBeDisabled({ timeout: 10_000 });

  // The configuration id is echoed back so the operator can sanity-check it.
  await expect(page.getByText('test', { exact: true })).toBeVisible();

  await page.getByPlaceholder('X-Internal-Token of the CRM backend').fill('not-a-real-token');
  await expect(button).toBeEnabled();
});

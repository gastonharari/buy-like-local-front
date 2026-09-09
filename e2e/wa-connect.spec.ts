import { test, expect } from '@playwright/test';

// /wa-connect smoke test — a render canary, intentionally minimal.
//
// The page is an internal one-shot tool that launches Meta's WhatsApp
// Embedded Signup (Coexistence) and posts the resulting code, via this
// repo's own /api/wa-onboarding route, to the CRM backend. We only assert
// our own rendering (200, disabled state without config_id, enabled with
// it) — the FB JS SDK itself is Meta's code and is NOT under test, and
// nothing here ever reaches a real backend: both the SDK script and the
// chat widget's iframe (mounted by the root layout on every route, and
// loaded eagerly even while the widget itself is closed) are aborted to
// keep the run hermetic.
test.beforeEach(async ({ page }) => {
  await page.route('**/connect.facebook.net/**', (route) => route.abort());
  await page.route('**/concierge-crm.vercel.app/**', (route) => route.abort());
});

test('wa-connect renders and disables the button without config_id', async ({ page }) => {
  const response = await page.goto('/wa-connect');
  expect(response?.status()).toBe(200);

  // Whether the "missing config_id" instructions render depends on whether
  // NEXT_PUBLIC_WA_CONFIG_ID was baked into this build — read the page's own
  // state instead of re-checking the env var (the test-runner process' env
  // can diverge from what `next build`/`next dev` actually inlined).
  const configured = await page.getByText('Using configuration', { exact: false }).isVisible().catch(() => false);
  if (!configured) {
    await expect(page.getByText('Missing config_id', { exact: false })).toBeVisible({
      timeout: 10_000,
    });
  }

  // Launch button exists but is disabled without a config id.
  await expect(page.getByRole('button', { name: 'Connect WhatsApp' })).toBeDisabled();
});

test('wa-connect enables the button once config_id is present', async ({ page }) => {
  await page.goto('/wa-connect?config_id=test');

  // The configuration id is echoed back so the operator can sanity-check it.
  await expect(page.getByText('test', { exact: true })).toBeVisible();

  // No operator-pasted token anymore — the page posts through this repo's
  // own /api/wa-onboarding route, so config_id alone enables the button.
  await expect(page.getByRole('button', { name: 'Connect WhatsApp' })).toBeEnabled({ timeout: 10_000 });
});

import { test, expect } from '@playwright/test';

// /track/<id> — known tracking number renders its status; unknown id 404s.
test('tracking page shows the current status', async ({ page }) => {
  const id = 'b99bf0af-33c1-4e5f-9405-c9804e0379c2';
  const response = await page.goto(`/track/${id}`);
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId('tracking-number')).toHaveText(id);
  await expect(page.getByTestId('tracking-status')).toHaveText('Received');
  // Every reached step is ticked, the current one included; later steps are not.
  await expect(page.locator('li[data-step-done="true"]')).toHaveCount(3);
  await expect(page.locator('li[data-step-done="false"]')).toHaveCount(1);
});

test('unknown tracking number is a 404', async ({ page }) => {
  const response = await page.goto('/track/00000000-0000-0000-0000-000000000000');
  expect(response?.status()).toBe(404);
});

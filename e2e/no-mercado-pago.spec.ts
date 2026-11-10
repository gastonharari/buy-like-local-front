import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { GUIDE_PAGES } from '../lib/content/guides';
import { FAQ_EN, FAQ_ES, FAQ_PT } from '../lib/content/faq-items';

// Decision 10 (2026-11-10, campaigns/2026-11-08/decisiones.md): Concierge doesn't do Mercado Pago
// for tourists. The three Mercado Pago guides are gone and redirect (308, next.config.mjs) to the
// MercadoLibre guide of the same language; no page may route or link to /*/mercado-pago* again.

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|facebook\.net|concierge-crm\.vercel\.app|openai\.com/, (r) =>
    r.abort(),
  );
});

const REDIRECTS = [
  ['/en/mercado-pago-for-tourists', '/en/buy-on-mercadolibre-as-a-foreigner'],
  ['/pt/mercado-pago-para-turistas', '/pt/comprar-no-mercadolibre-sendo-estrangeiro'],
  ['/es/mercado-pago-para-turistas', '/es/comprar-en-mercadolibre-siendo-extranjero'],
] as const;

const MP_PATH = /\/mercado-?pago/i;

for (const [from, to] of REDIRECTS) {
  test(`${from} redirects permanently to ${to}, query string included`, async ({ page, request }) => {
    const query = '?utm_source=google&utm_campaign=acceso_ml&gclid=old-mp-ad';
    const res = await request.get(`${from}${query}`, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()['location']).toBe(`${to}${query}`);

    // A browser lands on the MercadoLibre guide of the same language.
    const final = await page.goto(from);
    expect(final?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe(to);
    await expect(page.locator('h1')).toHaveText(GUIDE_PAGES.get(to)!.h1);
  });
}

test('no route, content page or content link points at /*/mercado-pago*', () => {
  for (const lang of ['en', 'pt', 'es']) {
    const routes = readdirSync(join(__dirname, '..', 'app', lang));
    expect(routes.filter((r) => MP_PATH.test(`/${r}`)), `app/${lang}`).toEqual([]);
  }
  for (const page of GUIDE_PAGES.values()) {
    expect(page.path).not.toMatch(MP_PATH);
    for (const s of page.sections ?? []) if (s.link) expect(s.link.href, page.path).not.toMatch(MP_PATH);
  }
  for (const pool of [FAQ_EN, FAQ_PT, FAQ_ES]) {
    expect(Object.keys(pool)).not.toContain('mercado-pago-tourist');
    for (const item of Object.values(pool)) if (item.link) expect(item.link.href, item.id).not.toMatch(MP_PATH);
  }
});

test('no page in the sitemap links to /*/mercado-pago*', async ({ page, request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  expect(xml).not.toMatch(MP_PATH);
  const paths = [...xml.matchAll(/<loc>https:\/\/www\.concierge\.com\.ar([^<]*)<\/loc>/g)].map((m) => m[1] || '/');
  expect(paths.length).toBeGreaterThan(10);

  for (const path of paths) {
    await page.goto(path);
    const hrefs = await page.locator('a[href], link[href]').evaluateAll((els) => els.map((e) => e.getAttribute('href') ?? ''));
    expect(hrefs.filter((h) => MP_PATH.test(h)), path).toEqual([]);
  }
});

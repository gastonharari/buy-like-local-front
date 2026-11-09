import { test, expect } from '@playwright/test';
import { GUIDE_LANGS, GUIDE_PAGES, GUIDE_UI } from '../lib/content/guides';
import { SITE_URL } from '../lib/faq';

// Language versions of the guides and FAQ hubs (lib/content/guides.ts): every page declares the
// same, complete hreflang set as the other versions of its topic (Google ignores hreflang that
// isn't reciprocal), a self canonical, the right `lang` on its content, a language switch that
// links to those same URLs, and the sitemap lists them all with the same alternates.
//
// Driven by the content file, so a new page or language is covered without touching this spec.

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|facebook\.net|concierge-crm\.vercel\.app|openai\.com/, (r) =>
    r.abort(),
  );
});

const PAGES = [...GUIDE_PAGES.values()];

/** The other language versions of a page, from the content file: lang → absolute URL. */
function expectedAlternates(path: string): Record<string, string> {
  const page = GUIDE_PAGES.get(path)!;
  const versions = PAGES.filter((p) => p.topic === page.topic);
  const out: Record<string, string> = {};
  for (const v of versions) out[v.lang] = `${SITE_URL}${v.path}`;
  out['x-default'] = out.en;
  return out;
}

for (const guide of PAGES) {
  test(`${guide.path}: canonical, hreflang, lang and language switch`, async ({ page }) => {
    const res = await page.goto(guide.path);
    expect(res?.status()).toBe(200);

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE_URL}${guide.path}`);

    const alternates = await page.locator('link[rel="alternate"][hreflang]').evaluateAll((links) =>
      Object.fromEntries(links.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')])),
    );
    const expected = expectedAlternates(guide.path);
    expect(alternates).toEqual(expected);
    expect(Object.keys(alternates).sort()).toEqual([...GUIDE_LANGS, 'x-default'].sort());

    // The content is marked with the page's language (the root <html> stays "en", see docs/pages.md).
    await expect(page.locator(`div[lang="${GUIDE_UI[guide.lang].htmlLang}"]`).first()).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    expect(await page.locator('main').evaluate((m) => m.closest('[lang]')?.getAttribute('lang'))).toBe(
      GUIDE_UI[guide.lang].htmlLang,
    );

    // Language switch: the current language is marked, the others link to their own version.
    const nav = page.getByRole('navigation', { name: GUIDE_UI[guide.lang].languageNav });
    await expect(nav.locator('[aria-current="page"]')).toHaveText(guide.lang.toUpperCase());
    const links = await nav.locator('a').evaluateAll((as) =>
      as.map((a) => [a.getAttribute('hreflang'), a.getAttribute('href')]),
    );
    expect(Object.fromEntries(links)).toEqual(
      Object.fromEntries(
        Object.entries(expected)
          .filter(([l]) => l !== 'x-default' && l !== guide.lang)
          .map(([l, url]) => [l, url.replace(SITE_URL, '')]),
      ),
    );
  });
}

test('sitemap.xml lists every language version with the same hreflang alternates', async ({ request }) => {
  const res = await request.get('/sitemap.xml');
  expect(res.status()).toBe(200);
  const xml = await res.text();

  const entries = new Map<string, Record<string, string>>();
  for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
    if (!loc) continue;
    const alts: Record<string, string> = {};
    for (const [, lang, href] of block.matchAll(/<xhtml:link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
      alts[lang] = href;
    }
    entries.set(loc, alts);
  }

  for (const guide of PAGES) {
    const url = `${SITE_URL}${guide.path}`;
    expect(entries.has(url), `${url} in the sitemap`).toBe(true);
    const { 'x-default': _default, ...expected } = expectedAlternates(guide.path);
    expect(entries.get(url)).toEqual(expected);
  }
});

import { test, expect, type Page } from '@playwright/test';
import { FAQ_EN, FAQ_ES, FAQ_PT, HUB_FAQ_IDS } from '../lib/content/faq-items';
import { GUIDE_PAGES } from '../lib/content/guides';
import { UNCONFIRMED_CLAIMS } from '../lib/faq';
import { translations } from '../lib/translations';

// FAQPage JSON-LD on the FAQ hubs and the guide pages: valid shape, the right number of
// questions, and text identical to what the page shows (Google and Bing ignore — or penalise —
// structured data that doesn't match the visible page). Also enforces the writing rules of the
// brief: the direct answer is 40–60 words and no visible text carries a "TODO".
//
// The final check against validator.schema.org is manual; this catches regressions in CI.

// Hermetic: third-party tags and the chat iframe (production CRM) never load.
test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|facebook\.net|concierge-crm\.vercel\.app|openai\.com/, (r) =>
    r.abort(),
  );
});

const HUBS = ['/en/faq', '/pt/faq', '/es/faq'];
const GUIDES = [
  '/en/online-shopping-in-argentina',
  '/pt/compras-online-na-argentina',
  '/es/compras-online-en-argentina',
  '/en/buy-on-mercadolibre-as-a-foreigner',
  '/pt/comprar-no-mercadolibre-sendo-estrangeiro',
  '/es/comprar-en-mercadolibre-siendo-extranjero',
  '/en/ticketek-passline-without-dni',
  '/pt/ticketek-passline-sem-dni',
  '/es/ticketek-passline-sin-dni',
];
const POOLS = { en: FAQ_EN, pt: FAQ_PT, es: FAQ_ES };

const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
const stripHtml = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

type Question = { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } };

async function faqPages(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.map((b) => JSON.parse(b)).filter((d) => d['@type'] === 'FAQPage');
}

async function check(page: Page, path: string) {
  const res = await page.goto(path);
  expect(res?.status()).toBe(200);

  const schemas = await faqPages(page);
  expect(schemas, 'exactly one FAQPage per page').toHaveLength(1);
  const schema = schemas[0];
  expect(schema['@context']).toBe('https://schema.org');
  expect(Array.isArray(schema.mainEntity)).toBe(true);

  const questions = schema.mainEntity as Question[];
  for (const q of questions) {
    expect(q['@type']).toBe('Question');
    expect(typeof q.name).toBe('string');
    expect(q.name.length).toBeGreaterThan(0);
    expect(q.acceptedAnswer['@type']).toBe('Answer');
    expect(q.acceptedAnswer.text.length).toBeGreaterThan(0);
  }

  const items = page.locator('[data-faq-item]');
  const visible = await items.evaluateAll((els) =>
    els.map((el) => ({
      q: (el.querySelector('[data-faq-q]') as HTMLElement).innerText,
      a: (el.querySelector('[data-faq-a]') as HTMLElement).innerText,
    })),
  );
  expect(visible).toHaveLength(questions.length);
  questions.forEach((q, i) => {
    expect(norm(q.name)).toBe(norm(visible[i].q));
    expect(norm(stripHtml(q.acceptedAnswer.text))).toBe(norm(visible[i].a));
  });

  const body = await page.locator('main').innerText();
  expect(body).not.toContain('TODO');
  // No unconfirmed claim (PayPal) in the structured data nor on the page.
  expect(JSON.stringify(schema)).not.toMatch(UNCONFIRMED_CLAIMS);
  expect(body).not.toMatch(UNCONFIRMED_CLAIMS);
  return questions.length;
}

// 11 since decision 10 (2026-11-10) took out the Mercado Pago question; never padded back to 12.
test('the hubs have 11 questions', () => {
  expect(HUB_FAQ_IDS).toHaveLength(11);
  expect(HUB_FAQ_IDS as readonly string[]).not.toContain('mercado-pago-tourist');
});

for (const path of HUBS) {
  test(`${path}: FAQPage with ${HUB_FAQ_IDS.length} questions matching the visible text`, async ({ page }) => {
    expect(await check(page, path)).toBe(HUB_FAQ_IDS.length);
  });
}

for (const path of GUIDES) {
  test(`${path}: FAQPage with 4–6 questions matching the visible text`, async ({ page }) => {
    const n = await check(page, path);
    expect(n).toBeGreaterThanOrEqual(4);
    expect(n).toBeLessThanOrEqual(6);
  });
}

test('every direct answer is 40–60 words', () => {
  for (const item of Object.values(POOLS).flatMap((pool) => Object.values(pool))) {
    const words = item.answer.trim().split(/\s+/).length;
    expect(words, `${item.id}: "${item.q}" has ${words} words`).toBeGreaterThanOrEqual(40);
    expect(words, `${item.id}: "${item.q}" has ${words} words`).toBeLessThanOrEqual(60);
  }
});

test('every language has the same questions, and the same ones wait on a TODO(gaston)', () => {
  const ids = Object.keys(FAQ_EN).sort();
  for (const [lang, pool] of Object.entries(POOLS)) {
    expect(Object.keys(pool).sort(), `${lang} ids`).toEqual(ids);
    for (const id of ids) {
      expect(pool[id].id, `${lang}/${id}: id field`).toBe(id);
      expect(Boolean(pool[id].todo), `${lang}/${id}: has a TODO like EN`).toBe(Boolean(FAQ_EN[id].todo));
      if (pool[id].todo) expect(pool[id].todo, `${lang}/${id}: TODO format`).toMatch(/^TODO\(gaston\): /);
      // Links stay within the item's own language.
      if (pool[id].link) expect(pool[id].link!.href, `${lang}/${id}: link`).toMatch(new RegExp(`^/${lang}/`));
    }
  }
});

test('no guide copy claims to be official, MercadoLibre or a partner', () => {
  for (const page of GUIDE_PAGES.values()) {
    const copy = JSON.stringify({ ...page, faq: page.faq.map(({ todo: _todo, ...visible }) => visible) });
    expect(copy, page.path).not.toMatch(/\b(oficial|official|partners?|socios?|parceir[oa]s?)\b/i);
    expect(copy, page.path).not.toMatch(UNCONFIRMED_CLAIMS);
    // Amazon only as a neutral comparison, never "Amazon doesn't deliver / operate here".
    for (const sentence of copy.split(/(?<=[.!?:])\s+|","/)) {
      if (!/amazon/i.test(sentence)) continue;
      expect(sentence, page.path).toMatch(/the way you'd use Amazon at home|como você usaria a Amazon em casa|como vos usarías Amazon en tu país/);
    }
  }
});

// Decision 6 of 2026-11-09 (campaigns/2026-11-08/decisiones.md): the visible FAQ of the landing
// names no payment method, PayPal included, in any language. Checked on the source and on the
// rendered accordion (it mounts an answer only while it's open, so each one is opened).
test('the landing FAQ copy never mentions PayPal, in any language', () => {
  for (const lang of ['en', 'es', 'pt'] as const) {
    for (const item of translations[lang].faq.items) {
      expect(`${item.q} ${item.a}`, `${lang}: "${item.q}"`).not.toMatch(/paypal/i);
    }
  }
});

for (const lang of ['en', 'es', 'pt'] as const) {
  test(`the landing's visible FAQ has no PayPal (${lang})`, async ({ page }) => {
    await page.addInitScript((l) => {
      localStorage.setItem('cookie_consent', 'denied');
      localStorage.setItem('concierge-lang', l);
    }, lang);
    await page.goto('/');
    const faq = page.locator('#faq');
    // The stored language has been applied once the title is the one of that language.
    await expect(faq.locator('h2')).toHaveText(translations[lang].faq.title);

    for (const item of translations[lang].faq.items) {
      const trigger = faq.getByRole('button', { name: item.q, exact: true });
      await trigger.click();
      await expect(trigger).toHaveAttribute('aria-expanded', 'true');
      const contentId = await trigger.getAttribute('aria-controls');
      const answer = await page.locator(`[id="${contentId}"]`).innerText();
      expect(norm(answer)).toBe(norm(item.a));
    }
    expect(await faq.innerText()).not.toMatch(/paypal/i);
  });
}

test('the landing has one FAQPage: its own FAQ minus PayPal, matching the visible text', async ({ page }) => {
  // Keep the cookie banner out of the way of the accordion clicks.
  await page.addInitScript(() => localStorage.setItem('cookie_consent', 'denied'));
  await page.goto('/');
  const schemas = await faqPages(page);
  expect(schemas).toHaveLength(1);

  // No PayPal in structured data until it's confirmed (the visible copy is Gastón's call).
  expect(JSON.stringify(schemas[0])).not.toMatch(/paypal/i);
  const expected = translations.en.faq.items.filter((i) => !/paypal/i.test(`${i.q} ${i.a}`));
  const questions = schemas[0].mainEntity as Question[];
  expect(questions.length).toBeGreaterThan(0);
  expect(questions).toHaveLength(expected.length);

  // Every question left is on the page with the same answer (the accordion mounts an answer only
  // while it's open, so open each one).
  const faq = page.locator('#faq');
  for (const q of questions) {
    const trigger = faq.getByRole('button', { name: q.name, exact: true });
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const contentId = await trigger.getAttribute('aria-controls');
    const answer = await page.locator(`[id="${contentId}"]`).innerText();
    expect(norm(answer)).toBe(norm(stripHtml(q.acceptedAnswer.text)));
  }
});

import { test, expect, type Page } from '@playwright/test';
import { FAQ_EN, FAQ_PT } from '../lib/content/faq-items';
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

const HUBS = ['/en/faq', '/pt/faq'];
const GUIDES = [
  '/en/buy-on-mercadolibre-as-a-foreigner',
  '/pt/comprar-no-mercadolibre-sendo-estrangeiro',
  '/en/mercado-pago-for-tourists',
  '/pt/mercado-pago-para-turistas',
  '/en/ticketek-passline-without-dni',
  '/pt/ticketek-passline-sem-dni',
];

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
  return questions.length;
}

for (const path of HUBS) {
  test(`${path}: FAQPage with 12 questions matching the visible text`, async ({ page }) => {
    expect(await check(page, path)).toBe(12);
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
  for (const item of [...Object.values(FAQ_EN), ...Object.values(FAQ_PT)]) {
    const words = item.answer.trim().split(/\s+/).length;
    expect(words, `${item.id}: "${item.q}" has ${words} words`).toBeGreaterThanOrEqual(40);
    expect(words, `${item.id}: "${item.q}" has ${words} words`).toBeLessThanOrEqual(60);
  }
});

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

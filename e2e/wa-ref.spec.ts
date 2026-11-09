import { test, expect, type Page, type Locator } from '@playwright/test';
import { creatorName, refForSource, resolveRef, whatsappUrl, withRef } from '../lib/wa-ref';

// WhatsApp ref ("(ref GS-7K2Q)", "(ref CO)", …) — contract: campaigns/2026-11-08/contrato-api-clicks.md.
//
// Hermetic: the browser's POST /api/clicks is answered by page.route (no CRM, no env vars), and
// third-party tags plus the chat iframe are aborted. What's under test is our own code: the
// landing capture, the 90-day storage, the retry, and the pre-filled text of the wa.me links.

const GUIDE = '/en/buy-on-mercadolibre-as-a-foreigner';
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com|facebook\.net|concierge-crm\.vercel\.app|openai\.com/, (r) =>
    r.abort(),
  );
});

/** The hero WhatsApp button of a guide page. */
const heroWa = (page: Page) => page.locator('[data-section="guide-hero"] a[href^="https://wa.me/"]');

async function waText(link: Locator): Promise<string> {
  const href = await link.getAttribute('href');
  return href ? new URL(href).searchParams.get('text') ?? '' : '';
}

type ClicksMock = { bodies: Record<string, string>[] };

async function mockClicks(page: Page, respond: (body: Record<string, string>) => { status: number; json: unknown }) {
  const mock: ClicksMock = { bodies: [] };
  await page.route('**/api/clicks', async (route) => {
    const body = route.request().postDataJSON();
    mock.bodies.push(body);
    const { status, json } = respond(body);
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(json) });
  });
  return mock;
}

const ok = (code: string) => (b: Record<string, string>) => ({
  status: 201,
  json: { code, channel: 'google_search', click_id: b.click_id },
});

test('google ad click: POSTs on landing and the button ends in "(ref GS-XXXX)"', async ({ page }) => {
  const mock = await mockClicks(page, ok('GS-7K2Q'));
  await page.goto(`${GUIDE}?utm_source=google&utm_medium=cpc&gclid=test`);

  await expect.poll(() => waText(heroWa(page))).toBe('Hi! I need help buying something on MercadoLibre (ref GS-7K2Q)');

  expect(mock.bodies).toHaveLength(1);
  const body = mock.bodies[0];
  expect(body.click_id).toMatch(UUID_V4);
  expect(body.gclid).toBe('test');
  expect(body.utm_source).toBe('google');
  expect(body.utm_medium).toBe('cpc');
  expect(body.landing_url).toBe(`${GUIDE}?utm_source=google&utm_medium=cpc&gclid=test`);
  expect(Number.isNaN(Date.parse(body.landed_at))).toBe(false);

  // Every WhatsApp button on the page carries the same ref.
  for (const link of await page.locator('a[href^="https://wa.me/"]').all()) {
    expect(await waText(link)).toMatch(/ \(ref GS-7K2Q\)$/);
  }
});

test('CRM down: "(ref GS)", then the next page load retries with the same click_id', async ({ page }) => {
  let up = false;
  const mock = await mockClicks(page, (b) =>
    up ? ok('GS-9WXY')(b) : { status: 502, json: { error: 'service error' } },
  );
  await page.goto(`${GUIDE}?utm_source=google&gclid=down-test`);
  await expect.poll(() => mock.bodies.length).toBe(1);
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref GS\)$/);

  up = true;
  await page.goto('/en/faq'); // no params: the stored click is retried
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref GS-9WXY\)$/);
  expect(mock.bodies).toHaveLength(2);
  expect(mock.bodies[1].click_id).toBe(mock.bodies[0].click_id);

  // Once it has a code it doesn't ask again.
  await page.goto('/pt/faq');
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref GS-9WXY\)$/);
  expect(mock.bodies).toHaveLength(2);
});

test('same gclid keeps the click; a different gclid starts a new one', async ({ page }) => {
  const mock = await mockClicks(page, ok('GS-ABCD'));
  await page.goto(`${GUIDE}?gclid=first`);
  await expect.poll(() => mock.bodies.length).toBe(1);
  await expect.poll(() => waText(heroWa(page))).toMatch(/\(ref GS-ABCD\)$/);
  await page.goto(`/en/faq?gclid=first`);
  await expect.poll(() => waText(heroWa(page))).toMatch(/\(ref GS-ABCD\)$/);
  expect(mock.bodies).toHaveLength(1);

  await page.goto(`/en/faq?gbraid=second`);
  await expect.poll(() => mock.bodies.length).toBe(2);
  expect(mock.bodies[1].click_id).not.toBe(mock.bodies[0].click_id);
  expect(mock.bodies[1].gbraid).toBe('second');
});

test('organic ChatGPT: "(ref CO)" with no POST, kept while navigating', async ({ page }) => {
  const mock = await mockClicks(page, ok('GS-ZZZZ'));
  await page.goto('/pt/faq?utm_source=chatgpt.com');
  await expect.poll(() => waText(heroWa(page))).toBe('Oi! Preciso de ajuda para comprar algo na Argentina (ref CO)');

  // Client-side navigation through the footer, then a full load without params.
  await page.locator('footer a[href="/pt/mercado-pago-para-turistas"]').click();
  await expect(page).toHaveURL(/\/pt\/mercado-pago-para-turistas$/);
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref CO\)$/);
  await page.goto('/en/ticketek-passline-without-dni');
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref CO\)$/);
  expect(mock.bodies).toHaveLength(0);
});

test('a new utm_source replaces the stored channel and the stored Google click', async ({ page }) => {
  await mockClicks(page, ok('GS-QQQQ'));
  await page.goto(`${GUIDE}?utm_source=google&gclid=old`);
  await expect.poll(() => waText(heroWa(page))).toMatch(/\(ref GS-QQQQ\)$/);
  await page.goto(`${GUIDE}?utm_source=instagram`);
  await expect.poll(() => waText(heroWa(page))).toMatch(/ \(ref IG\)$/);
});

test('creator links: "(ref CR-NAME)" from utm_campaign', async ({ page }) => {
  await page.goto('/en/faq?utm_source=creator&utm_campaign=juan_p%C3%A9rez');
  await expect.poll(() => waText(heroWa(page))).toBe('Hi! I need help buying something in Argentina (ref CR-JUANPEREZ)');
});

test('no utm and no click id: no ref', async ({ page }) => {
  await page.goto(GUIDE);
  await expect(heroWa(page)).toBeVisible();
  // Give the capture effect a moment; the text must stay without a ref.
  await page.waitForTimeout(500);
  expect(await waText(heroWa(page))).toBe('Hi! I need help buying something on MercadoLibre');
});

test('the landing\'s own WhatsApp buttons get the ref too', async ({ page }) => {
  await page.goto('/?utm_source=instagram');
  const header = page.locator('header a[href^="https://wa.me/"]');
  await expect.poll(() => waText(header)).toMatch(/ \(ref IG\)$/);
  const hero = page.locator('[data-section="hero"] a[href^="https://wa.me/"]');
  await expect.poll(() => waText(hero)).toMatch(/ \(ref IG\)$/);
});

// Spanish pages (founder decision of 2026-11-09): Google's ML-ES ad group lands on the ES
// MercadoLibre guide with a gclid, and ChatGPT Ads uses the same page with utm_source=chatgpt_ads.
const GUIDE_ES = '/es/comprar-en-mercadolibre-siendo-extranjero';

test('ES: google ad click POSTs on landing and the button ends in "(ref GS-XXXX)"', async ({ page }) => {
  const mock = await mockClicks(page, ok('GS-7K2Q'));
  await page.goto(`${GUIDE_ES}?utm_source=google&utm_medium=cpc&utm_campaign=ml_es&gclid=test-es`);

  await expect
    .poll(() => waText(heroWa(page)))
    .toBe('¡Hola! Necesito ayuda para comprar algo en MercadoLibre (ref GS-7K2Q)');

  expect(mock.bodies).toHaveLength(1);
  expect(mock.bodies[0].gclid).toBe('test-es');
  expect(mock.bodies[0].landing_url).toBe(`${GUIDE_ES}?utm_source=google&utm_medium=cpc&utm_campaign=ml_es&gclid=test-es`);
  for (const link of await page.locator('a[href^="https://wa.me/"]').all()) {
    expect(await waText(link)).toMatch(/ \(ref GS-7K2Q\)$/);
  }
});

test('ES: the ChatGPT Ads landing URL gives "(ref CA)" without a POST', async ({ page }) => {
  const mock = await mockClicks(page, ok('GS-ZZZZ'));
  await page.goto(`${GUIDE_ES}?utm_source=chatgpt_ads&utm_campaign=test1`);
  await expect
    .poll(() => waText(heroWa(page)))
    .toBe('¡Hola! Necesito ayuda para comprar algo en MercadoLibre (ref CA)');

  // The channel survives navigation to the other ES pages.
  await page.locator('footer a[href="/es/ticketek-passline-sin-dni"]').click();
  await expect(page).toHaveURL(/\/es\/ticketek-passline-sin-dni$/);
  await expect
    .poll(() => waText(heroWa(page)))
    .toBe('¡Hola! Necesito ayuda para comprar entradas para un show en Buenos Aires (ref CA)');
  expect(mock.bodies).toHaveLength(0);
});

test('ES: no utm and no click id, no ref', async ({ page }) => {
  await page.goto('/es/faq');
  await expect(heroWa(page)).toBeVisible();
  await page.waitForTimeout(500);
  expect(await waText(heroWa(page))).toBe('¡Hola! Necesito ayuda para comprar algo en Argentina');
});

test('ref rules (pure functions)', () => {
  expect(refForSource('google')).toBe('GS');
  expect(refForSource(' Google ')).toBe('GS');
  expect(refForSource('chatgpt_ads')).toBe('CA');
  expect(refForSource('chatgpt.com')).toBe('CO');
  expect(refForSource('instagram')).toBe('IG');
  expect(refForSource('creator', 'juan_pérez')).toBe('CR-JUANPEREZ');
  expect(refForSource('creator', '')).toBe('CR');
  expect(refForSource('facebook')).toBeNull();
  expect(refForSource(undefined)).toBeNull();

  expect(creatorName('María José Ñandú 2026 extra long name')).toBe('MARIAJOSENANDU2026EX');
  expect(creatorName('juan_pérez')).toBe('JUANPEREZ');

  expect(resolveRef({ code: 'GS-7K2Q' }, { utm_source: 'instagram' })).toBe('GS-7K2Q');
  expect(resolveRef({}, null)).toBe('GS');
  expect(resolveRef({ code: 'bogus' }, null)).toBe('GS');
  expect(resolveRef(null, { utm_source: 'chatgpt.com' })).toBe('CO');
  expect(resolveRef(null, null)).toBeNull();

  const base = 'https://wa.me/5491158637341?text=Hi!%20I%20need%20help';
  expect(withRef(base, null)).toBe(base);
  expect(new URL(withRef(base, 'GS-7K2Q')).searchParams.get('text')).toBe('Hi! I need help (ref GS-7K2Q)');

  // The CRM's parser (contract §7) reads every ref we can produce.
  const crm = /\(ref\s+([a-z]{2})(?:-([a-z0-9]+))?\)/i;
  for (const ref of ['GS-7K2Q', 'GS', 'CA', 'CO', 'IG', 'CR-JUANPEREZ']) {
    expect(`Hi! (ref ${ref})`.match(crm)?.slice(1).filter(Boolean).join('-').toUpperCase()).toBe(ref);
  }
  // Also after a Spanish sentence with "¡" and accents, as the ES pages send it.
  const es = new URL(whatsappUrl('¡Hola! Necesito ayuda para comprar algo en MercadoLibre', 'GS-7K2Q')).searchParams.get('text')!;
  expect(es).toBe('¡Hola! Necesito ayuda para comprar algo en MercadoLibre (ref GS-7K2Q)');
  expect(es.match(crm)?.slice(1)).toEqual(['GS', '7K2Q']);
});

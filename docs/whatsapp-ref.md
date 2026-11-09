# WhatsApp ref — which channel a conversation came from

Every WhatsApp button on the site pre-fills a natural sentence in the page's language and, when the
channel is known, ends it with a reference code:

```
Hi! I need help buying something on MercadoLibre (ref GS-7K2Q)
```

The CRM reads that suffix from the traveler's first message and attributes the conversation (and
later the sale) to the channel. The CRM side, the click table and the parser live in
`concierge-crm`; the shared contract is `campaigns/2026-11-08/contrato-api-clicks.md` in the
umbrella workspace (not in this repo). **Neither side changes it alone.**

## Which ref

| Visitor arrived with | Ref | How |
|---|---|---|
| `gclid`, `gbraid` or `wbraid` (Google Ads) | `GS-XXXX` | code from the CRM via `POST /api/clicks` |
| the same, but the CRM didn't answer (yet) | `GS` | fallback; retried on the next page load |
| `utm_source=google` (no click id) | `GS` | fixed |
| `utm_source=chatgpt_ads` | `CA` | fixed |
| `utm_source=chatgpt.com` (ChatGPT adds it to organic links) | `CO` | fixed |
| `utm_source=instagram` | `IG` | fixed |
| `utm_source=creator&utm_campaign=juan_pérez` | `CR-JUANPEREZ` | `utm_campaign` upper-cased, accents removed, `A-Z0-9` only, max 20 chars |
| anything else, or nothing | no ref | the sentence alone |

Meta click-to-WhatsApp ads (`MB`, `ME`, `MC`) don't go through the site: their ref is in the ad's
own pre-filled message.

## How it works

```
landing (any page)                 components/attribution-capture.tsx (root layout)
  │ captureAttribution(url)        lib/wa-ref.ts
  │   gclid/gbraid/wbraid → localStorage "concierge-click"   {click_id (UUID v4), ids, utm_*,
  │                                                           landing_url, landed_at, code?}  90 days
  │   utm_source          → localStorage "concierge-channel" {utm_source, utm_campaign}       90 days
  │ syncClick()  — only if the stored click has no code yet
  ▼
POST /api/clicks  (app/api/clicks/route.ts, this repo)      ← browser, no auth
  │  forwards the body untouched, adds X-Internal-Token, 3 s timeout
  ▼
POST {CRM_API_URL}/api/internal/ad-clicks                   ← concierge-crm
  └─ 201/200 {code:"GS-7K2Q", channel, click_id} → stored as `code`

WhatsApp buttons  — useWaRef() / useWhatsAppLink() (hooks/use-wa-ref.ts)
  └─ "<sentence> (ref GS-7K2Q)"
```

Rules worth knowing before you change anything:

- **The POST happens on landing, never on the tap.** Opening `wa.me` after awaiting a fetch gets
  blocked as a pop-up. The button only reads what's already stored.
- **Retries reuse the `click_id`.** The CRM is idempotent on it (200 + the original code). A
  `400`/`422` marks the click `rejected` and stops the retries; any other failure (network,
  timeout, `5xx`, `401`) retries on the next page load or client-side navigation.
- **Same click id keeps the stored click; a different one replaces it** (new `click_id`).
- **The channel survives navigation.** Pages without utm keep the stored one; a new `utm_source`
  replaces it. A new non-Google `utm_source` also drops a stored Google click: the newest touch
  wins.
- **Optional fields are cut to the contract's limits** (utm 256, `landing_url` 2048). Click ids go
  as they came: a cut `gclid` is useless for offline conversions, so a too-long one gets the CRM's
  `400` instead.
- **Storage can fail** (Safari private mode, blocked cookies). Every access is wrapped; the worst
  case is a button without a ref.

## The proxy — `app/api/clicks/route.ts`

Same shape as `/api/wa-onboarding`: server-only `CRM_API_URL` + `INTERNAL_API_TOKEN` (already
required by the referral flow — no new variables), status and JSON of the CRM passed through.

| Status | When |
|---|---|
| CRM's own (`201`, `200`, `400`, `401`, `422`, `500`) | passed through untouched |
| `400 {"error":"invalid body"}` | the request body isn't JSON |
| `500 {"error":"server misconfigured"}` | `CRM_API_URL` or `INTERNAL_API_TOKEN` missing |
| `502 {"error":"service error"}` | CRM unreachable or slower than 3 s |

It is **not** `/api/internal/clicks` — that path is the partner-referral click log
([referrals.md](referrals.md)). The route is public and has no rate limit on purpose (contract §8):
validation, length limits and idempotency are enough for now.

The CRM endpoint ships in a `concierge-crm` PR (session 0). Until it is deployed, the proxy gets a
CRM `404`/`5xx` and buttons fall back to `(ref GS)` — nothing breaks.

## Where the buttons are

- Guide and FAQ pages: `components/whatsapp-button.tsx` (`WhatsAppButton`, message per page in
  `lib/content/guides.ts`).
- The landing (`app/page.tsx`): its four hand-written `t.waLink` links go through
  `useWhatsAppLink(t.waLink)`.
- Not touched: `/r/[code]` (the partner referral flow has its own attribution through the CRM) and
  `components/ads/*` (render targets for ad creatives, not live pages).

Every tap fires GA4 `whatsapp_click`; `lib/analytics.ts` also reports it to Google Ads and the
ChatGPT Ads pixel — see [operations.md](operations.md#ad-tags).

## Testing

- `e2e/wa-ref.spec.ts` — hermetic: answers `/api/clicks` with `page.route`, so it needs neither the
  CRM nor env vars. Covers the code, the CRM-down fallback and retry, same/different click ids,
  `CO`/`IG`/`CR-NAME`, persistence across navigation, the landing's buttons, and the pure rules
  (including that the CRM's regex parses every ref we produce).
- Against a real proxy: run any mock that implements the contract's leg B, then
  `CRM_API_URL=http://127.0.0.1:<port> INTERNAL_API_TOKEN=test npx next dev -p <port>` and open a
  page with `?utm_source=google&gclid=test`.

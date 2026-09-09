# Operations

Env vars, analytics, CI, deploy.

## Local dev

```bash
npm install
npm run dev     # port 3001
```

Port 3001, not 3000 — the CRM frontend owns 3000, and both often run at once.

The site works with **no env vars at all**: the chat widget falls back to the production CRM URL,
KV becomes a no-op, and `/r/[code]` renders its generic fallback. Only the referral path needs
configuration.

## Env vars

| Var | Scope | Required | Purpose |
|---|---|---|---|
| `CRM_API_URL` | server | **yes, for referrals** | CRM API Gateway base URL; also used by `/api/wa-onboarding` (`/wa-connect`'s proxy). **No trailing slash.** |
| `INTERNAL_API_TOKEN` | server | **yes, for referrals** | shared secret; must equal SSM `/buy-like-local-prod/INTERNAL_API_TOKEN`; also used by `/api/wa-onboarding` |
| `NEXT_PUBLIC_CHAT_URL` | client | no | chat iframe URL; falls back to `https://concierge-crm.vercel.app/chat` |
| `NEXT_PUBLIC_WA_CONFIG_ID` | client | no | Meta Embedded Signup configuration id used by `/wa-connect` (can also be passed as `?config_id=`) |
| `NEXT_PUBLIC_FB_APP_ID` | client | no | Meta app id `/wa-connect` passes to `FB.init`; falls back to the Concierge app id |
| `KV_REST_API_URL` | server | no | injected by Vercel when the KV integration is connected |
| `KV_REST_API_TOKEN` | server | no | same |

`CRM_API_URL` and `INTERNAL_API_TOKEN` are **server-only on purpose** — no `NEXT_PUBLIC_` prefix.
The token must never reach the browser. They're set in Vercel (Production scope) and are in no
committed `.env`.

If either is missing: `/r/[code]` degrades to the generic page and `/api/r/start-whatsapp` returns
`500`, surfacing as "No pudimos conectar" in the modal. Both paths log to the server console with a
`[r/[code]]` or `[start-whatsapp]` prefix.

To pull them locally, authenticate the Vercel CLI once and use `vercel env pull` rather than
copying values by hand.

## Analytics

Three trackers, all wired in `app/layout.tsx`:

| | ID | Loaded |
|---|---|---|
| Google Analytics 4 | `G-JK2YHFCTCD` | `next/script`, `afterInteractive` |
| Meta Pixel | `1272933548278550` | `afterInteractive`, fires `PageView` on load |
| Vercel Analytics | — | `<Analytics />` from `@vercel/analytics/next` |

> The Meta Pixel block still carries a `{/* replace TODO_PIXEL_ID with actual pixel ID */}`
> comment. The ID **is** set — the comment is stale.

### Consent mode

GA4 runs in consent mode with two `gtag('consent','default',…)` calls:

1. Region-scoped **denied** for 29 EEA/EU countries, with `wait_for_update: 500`.
2. Global **granted** for everyone else.

Order looks wrong but isn't: Google gives region-specific defaults precedence over the
region-less one, so EU visitors stay denied until they accept. Non-EU is opt-out by default.

`components/cookie-banner.tsx` persists the choice in `localStorage("cookie_consent")` and issues
`gtag('consent','update',…)` on accept. Declining stores `"denied"` and does not update — the
defaults already cover it.

### Custom events

`lib/analytics.ts` exports a single helper:

```ts
trackEvent(event: string, params?: Record<string,string>)
```

It's a no-op when `window.gtag` is absent, so it's safe to call before consent or during SSR.

Events currently fired: `section_view` per landing section, scroll-depth thresholds, `faq_expand`
(with the question truncated to 100 chars), `cookie_consent` (`accept`/`decline`), and
`fbq('track','Lead')` on the hero and final-CTA WhatsApp buttons.

## SEO

`app/layout.tsx` sets `metadataBase: https://www.concierge.com.ar`, full OpenGraph and Twitter
cards, and injects **three JSON-LD blocks** in `<head>`: `Organization`, `Service`, and `FAQPage`.

The FAQ schema must stay consistent with the FAQ rendered from `lib/translations.ts` — they're
maintained separately, so changing one and not the other publishes structured data that doesn't
match the page.

## CI — `.github/workflows/ci.yml`

Runs on PRs to `main` and on pushes to `main`.

| Job | Does |
|---|---|
| `build` | `next build` |
| `e2e` | Playwright smoke (`e2e/landing-smoke.spec.ts`) |
| `e2e-coverage` | **warn only** — sticky PR comment when product code changed without an e2e test |
| `docs-coverage` | **warn only** — sticky PR comment when product code changed without a `docs/` update |

The two `*-coverage` jobs always succeed. **Do not add them to Required Status Checks** — that
would turn a nudge into a block. Both are PR-only (`if: github.event_name == 'pull_request'`).

`FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: "true"` is set workflow-wide, ahead of GitHub's Node 20
removal on 2026-09-16.

The `build` job checks out with `fetch-depth: 0` so the deploy-summary step can list the push's
commits; it uses GitHub Models via the built-in `GITHUB_TOKEN` (free, no API key), which is why
the workflow requests `models: read`.

## Deploy

**Vercel**, on push to `main`. No deploy step in Actions — CI only validates.

Domain: `www.concierge.com.ar` (also `concierge.com.ar`). Both are in the CRM backend's
`allowedOrigins`.

### Verification is blocked for automated agents

The deployment sits behind **Vercel SSO + PIN**, and Vercel's Bot Protection returns `403` to
datacenter IPs — including GitHub Actions runners. So:

- An agent cannot open the deployed site to check a visual change.
- The CRM's hourly `health-check.yml` treats the landing check as **informative only** for exactly
  this reason; a `403` there is expected, not an outage.

To verify production, either hand the commands to a human on a residential connection, or add a
Vercel firewall bypass rule (secret header) and send it in the request.

Locally, verify with `npm run dev` on :3001 instead.

# Referrals — the landing side

Hotels and other partners send guests to `concierge.com.ar/r/<CODE>`. The guest gets a co-branded
page and a WhatsApp handoff; the partner gets attribution, and the guest gets the partner's
discount on the Concierge service fee.

This repo owns the **page and the click pipeline**. The CRM owns the data model, the attribution
rules and the discount math — its `docs/referrals.md` is the canonical contract. Read that one
before changing anything that crosses the boundary.

## Two calls into the CRM, plus one from the widget

All server-to-server, authenticated with `X-Internal-Token: $INTERNAL_API_TOKEN`:

| From | To | For |
|---|---|---|
| `app/r/[code]/page.tsx` | `GET /api/internal/partners/by-code/:code` | render the partner's name and headline |
| `app/r/[code]/page.tsx` | `POST /api/internal/clicks` | log the click |
| `app/api/r/start-whatsapp/route.ts` | `POST /api/internal/users/from-referral` | create + attribute the user, get a `wa.me` URL |

`CRM_API_URL` and `INTERNAL_API_TOKEN` are **server-only** (no `NEXT_PUBLIC_` prefix) and
**mandatory**. Without them: the referral page silently degrades to a generic "Concierge" fallback,
and `/api/r/start-whatsapp` returns `500` so the modal shows "No pudimos conectar".

## Rendering `/r/[code]`

```
request
  ├─ fetchPartner(code)
  │    ├─ KV: partner:<code>        ← if the KV integration is configured
  │    └─ fallback: GET /api/internal/partners/by-code/<code>
  ├─ render ReferralLanding(partner ?? genericFallback)
  └─ after(): logClick(...)         ← deferred until the response is streamed
```

KV-first is a latency optimisation at the edge, not a source of truth — a KV miss or error always
falls through to the CRM, so the page works with KV entirely unconfigured.

**The page never fails on a bad code.** An unknown or inactive code renders a generic Concierge
landing rather than a 404. A partner should never be able to break the page by mistyping a code on
a flyer.

Click logging goes through `after()` from `next/server`, so it never blocks the response.

## The click outbox

`logClick` implements a write-ahead pattern:

```
1. kvSet(click:<uuid>, {...record, synced:false, attempts:0}, ttl 30d)
2. POST /api/internal/clicks   (4s AbortSignal timeout)
3. success → kvSet(click:<uuid>, {...record, synced:true, attempts:1, synced_at})
   failure → kvSet(click:<uuid>, {...record, synced:false, attempts:1, last_error})
```

The record `id` is generated here (`crypto.randomUUID()`) and the CRM endpoint **upserts** on it.
That's what makes a retry safe — replaying a click can't double-count. Records are never deleted;
the 30-day TTL cleans up.

Every KV failure is caught and logged, never thrown. A KV outage must not take down the page.

> **⚠️ The outbox has no consumer.** Comments in `app/r/[code]/page.tsx` refer to a "daily
> reconcile-clicks job" and a "reconcile-partners job that could backfill". **Neither exists** —
> there is no cron, no API route, no workflow implementing them. So today the outbox is
> write-only: clicks that fail to reach the CRM sit in KV with `synced:false` until the TTL
> expires, and nothing retries them.
>
> The pattern is sound and the data is there; only the reconciler is missing. Either build it or
> drop the comments — right now they describe intent as if it were behaviour, which is exactly how
> someone ends up trusting click counts they shouldn't.

## KV client — `lib/kv.ts`

A thin wrapper over the Vercel KV REST API. `KV_REST_API_URL` and `KV_REST_API_TOKEN` are injected
automatically once the KV integration is connected to the project.

**`kvEnabled()` is false when either is unset, and every method becomes a no-op.** Local dev works
with no KV at all, and every call site checks `kvEnabled()` before relying on a result.

## The WhatsApp handoff

`ReferralLanding` is a client component with a phone/name modal. On submit:

```
POST /api/r/start-whatsapp  { phone, name?, code }
  └─ POST {CRM}/api/internal/users/from-referral  { phone, name, code, channel:"WHATSAPP" }
       └─ upsert user, attribute to partner, record conversion
       └─ → { user_id, wa_url }
  └─ → { wa_url }        ← only wa_url is returned to the browser
```

`user_id` is deliberately **not** forwarded to the client — the browser has no use for it and it's
an internal identifier.

Validation is `phone` and `code` non-empty. Errors: `400` invalid body / missing fields, `500`
server misconfigured (missing env), `502` anything wrong with the CRM call.

The `wa.me` URL comes back with a prefilled message containing `[REF:CODE]`, so the operator can
see the source even if the phone doesn't match. The template and the fallbacks are chosen
**CRM-side** — see its `docs/referrals.md`.

## Web-chat attribution

The other path: the referral page's chat CTA opens the widget, which creates a session with
`POST /api/chat/sessions {ref_code}`. That lands on `conversations.ref_code` instead of on the
user record. Both converge in the CRM's discount resolver.

## Testing

`e2e/landing-smoke.spec.ts` in this repo. The referral flow's real coverage lives in the CRM's
`frontend/e2e/api/referrals.spec.ts` and `log-clicks.spec.ts`, which exercise the internal
endpoints directly.

There is **no local mock for the CRM** — `/r/[code]` against a local dev server with no
`CRM_API_URL` renders the generic fallback. That's correct behaviour, but it means the partner
path can't be exercised locally without pointing at a real backend.

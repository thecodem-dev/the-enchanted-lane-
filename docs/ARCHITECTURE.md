# Software Architecture — The Enchanted Line

This document describes the software architecture of the Interactive Train Journey Map application, covering the current implementation and the planned full-stack evolution including the payment gateway and security layers.

---

## Architecture Diagram

![Software Architecture Diagram](./architecture.svg)

---

## Tier Overview

The application is designed as a six-layer architecture. The Presentation Tier is fully implemented today. All remaining layers represent the planned full-stack expansion.

```
┌──────────────────────────────────────────────────────┐
│               Presentation Tier                      │  ← Fully implemented
│   React SPA · i18n · IndexedDB · Security Headers   │
└─────────────────────────┬────────────────────────────┘
                          │ HTTPS only
┌─────────────────────────▼────────────────────────────┐
│       Security Layer 1 — Edge & Network              │  ← Cloudflare / Vercel Edge
│   WAF · DDoS · CDN/TLS · Rate Limiting · Bot Guard  │
└─────────────────────────┬────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────┐
│       Security Layer 2 — Identity & Access           │  ← Supabase Auth
│   JWT · OAuth 2.0/PKCE · RLS · MFA · Sessions       │
└──────┬──────────────────┬───────────────────────┬────┘
       │                  │                       │
┌──────▼──────┐  ┌────────▼──────────┐  ┌────────▼──────────┐
│  External   │  │  Payment Gateway  │  │  Application Tier │
│  Services   │  │  Stripe/PayFast   │  │  Supabase         │
└─────────────┘  └────────┬──────────┘  └────────┬──────────┘
                          │ Webhook               │ SQL
                ┌─────────▼───────────────────────▼──────────┐
                │       Security Layer 3 — Data Protection   │
                │   AES-256 · TLS 1.3 · POPIA · Audit Log   │
                └─────────────────────┬──────────────────────┘
                                      │
                ┌─────────────────────▼──────────────────────┐
                │                 Data Tier                   │
                │  PostgreSQL + PostGIS · All tables          │
                └─────────────────────────────────────────────┘
```

---

## Tier 1 — Presentation Tier

**Status: Implemented**

The entire current application lives here — a statically-built React SPA served from a CDN. No server required.

| Component | Description | Status |
|---|---|---|
| React SPA + PWA | Core application shell, state, animation loop | ✅ Implemented |
| Localisation (i18next) | English, isiZulu, Afrikaans, Sesotho | ✅ Implemented |
| IndexedDB / Cache API | Offline support, journey progress persistence | ✅ Partial |
| Security Headers | CSP, HSTS, X-Frame-Options, SRI, CORS | ✅ Configured at CDN |
| Google Maps JS API | Replace custom SVG with live terrain map | 🔲 Planned |
| Weather Widget | Live weather per station | 🔲 Planned |
| Quiz Engine | Per-station knowledge quiz | 🔲 Planned |

### Client-side security headers

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://js.stripe.com; frame-src https://js.stripe.com
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
```

### State architecture (current)

```
App
 ├── phase          'intro' | 'journey'
 ├── lang           'en' | 'zu' | 'af' | 'st'
 ├── stIdx          Current station index (0–8)
 ├── tProg          Animation progress 0→1 between stations
 ├── awoken         Set<string>  — unlocked station IDs
 ├── completed      Set<string>  — departed station IDs
 ├── activeStation  Station | null
 ├── isMoving       boolean  — rAF loop running
 └── newlyAwoken    string | null  — banner trigger
```

---

## Security Layer 1 — Edge & Network

**Status: Planned | Provider: Cloudflare / Vercel Edge**

All traffic passes through this layer before reaching any application code.

| Control | Tool | Purpose |
|---|---|---|
| WAF | Cloudflare WAF | Block SQLi, XSS, OWASP Top 10 at the edge |
| DDoS Protection | Cloudflare Magic Transit | Absorb volumetric attacks before origin |
| CDN / TLS | Cloudflare / Vercel | TLS 1.3 termination, HTTP/3, global PoPs |
| Rate Limiting | Cloudflare Rules | Max 100 req/min per IP on API routes |
| Bot Detection | Cloudflare Turnstile | CAPTCHA-free bot mitigation on auth + payment flows |
| IP Allowlist / GeoBlock | Cloudflare Firewall | Restrict admin endpoints to known IPs |

---

## Security Layer 2 — Identity & Access

**Status: Planned | Provider: Supabase Auth**

Every request that passes the edge layer is validated here before touching data.

| Control | Implementation | Notes |
|---|---|---|
| JWT Auth Tokens | Supabase Auth | Short-lived access tokens (1 hr), refresh rotation |
| OAuth 2.0 / PKCE | Google, GitHub providers | PKCE prevents auth code interception |
| Row-Level Security | PostgreSQL RLS policies | Users can only read/write their own `user_progress` rows |
| MFA Support | TOTP (Google Authenticator) | Optional for users, mandatory for admin accounts |
| Session Management | Supabase session store | Sliding expiry, device fingerprinting |
| API Key Rotation | Supabase secrets + env vars | Service-role key never exposed to client bundle |

### RLS policy example

```sql
-- Users can only access their own progress
CREATE POLICY "user_progress_isolation"
ON user_progress
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Payments: users see only their own transactions
CREATE POLICY "payments_isolation"
ON payments
FOR SELECT
USING (auth.uid() = user_id);
```

---

## Payment Gateway Tier

**Status: Planned | Provider: Stripe (global) + PayFast (South Africa)**

> PayFast is the leading South African payment processor — critical for domestic users paying in ZAR. Stripe handles international cards.

### Architecture

```
User clicks "Upgrade / Purchase"
        │
        ▼
React client calls Supabase Edge Function (server-side only)
        │
        ▼
Edge Function creates Stripe / PayFast Checkout Session
        │  (secret key never leaves server)
        ▼
Client redirected to hosted Checkout page (Stripe/PayFast domain)
        │  (no card data touches app servers — PCI DSS scope minimised)
        ▼
Payment processor handles card capture + 3D Secure
        │
        ▼
Webhook POST to Edge Function (HMAC-SHA256 verified)
        │
        ▼
Edge Function updates subscriptions + payments tables
        │
        ▼
Supabase Realtime notifies client → UI unlocks premium features
```

### Payment components

| Component | Description | Provider |
|---|---|---|
| Checkout Sessions | Hosted payment page, handles 3DS, currency | Stripe / PayFast |
| Stripe Elements | Embedded card UI (if self-hosted flow needed) | Stripe |
| Webhook Verification | HMAC-SHA256 signature on every event | Stripe / PayFast |
| Subscription Billing | Monthly/annual plan management, dunning | Stripe Billing |
| Refund Handling | Edge Function processes refund requests | Stripe API |
| PCI DSS Compliance | SAQ-A (redirect) — minimal scope, no card data stored | Stripe / PayFast |

### Payment security rules

- **Never store raw card data** — tokenisation handled entirely by Stripe/PayFast
- **Webhook secret** stored in Supabase Vault, rotated quarterly
- **Idempotency keys** on all payment API calls to prevent double-charges
- **Payment amounts** always calculated server-side — client sends product ID only, never a price
- **Currency locked** to ZAR for PayFast, multi-currency via Stripe

### Schema additions

```sql
CREATE TABLE subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id),
  plan            text NOT NULL,                    -- 'free' | 'premium' | 'school'
  status          text NOT NULL,                    -- 'active' | 'cancelled' | 'past_due'
  provider        text NOT NULL,                    -- 'stripe' | 'payfast'
  provider_sub_id text,                             -- Stripe subscription ID
  current_period_end timestamptz,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id),
  amount_cents    integer NOT NULL,
  currency        text DEFAULT 'ZAR',
  status          text NOT NULL,                    -- 'succeeded' | 'failed' | 'refunded'
  provider        text NOT NULL,
  provider_txn_id text UNIQUE,                      -- Stripe payment_intent or PayFast pf_payment_id
  metadata        jsonb,
  created_at      timestamptz DEFAULT now()
);
```

---

## Tier 2 — External Services

**Status: Planned**

| Service | Purpose | Security |
|---|---|---|
| Google Maps Platform | Live satellite/terrain map | API key restricted to app domain |
| Google Weather API | Current weather per station | API key restricted to app domain |

API keys are stored in environment variables and proxied through Edge Functions — never bundled into client-side code.

---

## Tier 3 — Application Tier (Supabase)

**Status: Planned**

| Component | Purpose | Protocol |
|---|---|---|
| Supabase Platform | Managed hosting, dashboard, SDK | — |
| Auth (JWT) | User accounts, OAuth, session management | HTTPS |
| PostgREST API | Auto-generated REST API from schema | HTTPS |
| Realtime Subscriptions | Live UI updates on payment + progress events | WebSocket |
| Storage (Media) | Station images, audio clips, video | HTTPS |
| Edge Functions | Payment sessions, webhook handling, quiz scoring | HTTPS |

---

## Security Layer 3 — Data Protection

**Status: Planned | Provider: Supabase / PostgreSQL**

| Control | Implementation |
|---|---|
| Encryption at Rest | AES-256 on all Supabase-managed PostgreSQL volumes |
| Encryption in Transit | TLS 1.3 enforced on all database connections |
| POPIA Compliance | South African Protection of Personal Information Act — data minimisation, consent tracking, right-to-erasure |
| Secrets Manager | Supabase Vault for all API keys and webhook secrets |
| Audit Logging | `audit_log` table captures all write operations with user_id + timestamp |
| Backup + PITR | Supabase daily backups + Point-in-Time Recovery (7-day window) |
| Vulnerability Scanning | Supabase built-in + GitHub Dependabot on the frontend repo |

### Audit log schema

```sql
CREATE TABLE audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid,
  action      text NOT NULL,        -- 'payment.succeeded' | 'progress.updated' | etc.
  table_name  text,
  record_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  inet,
  created_at  timestamptz DEFAULT now()
);
```

---

## Tier 4 — Data Tier

**Status: Planned**

| Table | Description |
|---|---|
| `routes` | Rail route geometry (LineString), name, total distance |
| `stations` | 9 stations: multilingual names, coordinates, terrain type |
| `chapters` | Heritage story per station |
| `hidden_gems` | 3 gems per station |
| `quizzes` | Per-station questions and answers |
| `user_progress` | Journey state per user (station, completed set, language) |
| `subscriptions` | User plan, status, billing provider reference |
| `payments` | Payment transaction log |
| `audit_log` | Full write-operation audit trail |

---

## Full Data Flow — Including Payment

```
User opens app
      │
      ▼
CDN serves React SPA (static, no server)
      │
      ├─► IndexedDB — check cached progress
      │
      ▼
All requests pass through WAF + Rate Limiter (Security Layer 1)
      │
      ▼
Supabase Auth validates JWT (Security Layer 2)
      │
      ├─────────────────────────────────────────────────────┐
      │                                                     │
      ▼                                                     ▼
 Free journey flow                               Premium purchase flow
      │                                                     │
PostgREST API reads stations/chapters          Edge Function creates Checkout Session
      │                                                     │
      ▼                                         User pays on Stripe/PayFast hosted page
React state updates → animation runs                        │
      │                                         Webhook → Edge Function verifies HMAC
PATCH user_progress on station arrival                      │
      │                                         subscriptions table updated
Realtime notifies other sessions                            │
                                                Realtime notifies client → premium unlocked
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| UI framework | React 19 | Hooks + concurrent features |
| Build tool | Vite 8 | Sub-second HMR, Tailwind v4 plugin |
| Styling | Tailwind CSS v4 | Utility-first, no PostCSS config |
| Language | TypeScript 5.7 | Type-safe interfaces for all tiers |
| Backend | Supabase | Eliminates custom API server; PostGIS native |
| Payment (ZA) | PayFast | Leading SA processor, ZAR native, EFT + card |
| Payment (global) | Stripe | PCI DSS SAQ-A, global card coverage, Billing API |
| Edge security | Cloudflare | WAF + DDoS + Bot at global PoPs |
| Deployment | Vercel / Netlify | Zero-config, Git-integrated, edge CDN |

---

## Deployment Targets

See [README.md](../README.md) for step-by-step deployment instructions.

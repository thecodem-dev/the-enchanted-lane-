# Software Architecture — The Enchanted Line

This document describes the software architecture of the Interactive Train Journey Map application, covering the current implementation and the planned full-stack evolution.

---

## Architecture Diagram

![Software Architecture Diagram](./architecture.svg)

---

## Tier Overview

The application is designed as a four-tier architecture. The first tier (Presentation) is fully implemented today. The remaining three tiers represent the planned backend expansion.

```
┌─────────────────────────────┐
│      Presentation Tier      │  ← Fully implemented (React SPA)
└──────────────┬──────────────┘
               │ REST / HTTPS / WebSocket
     ┌─────────┴──────────────────────────┐
     │                                    │
┌────▼──────────┐        ┌───────────────▼──────────────┐
│ External      │        │      Application Tier         │
│ Services      │        │      (Supabase Platform)      │
└───────────────┘        └───────────────┬──────────────┘
                                         │ SQL
                         ┌───────────────▼──────────────┐
                         │         Data Tier             │
                         │  (PostgreSQL + PostGIS)       │
                         └──────────────────────────────┘
```

---

## Tier 1 — Presentation Tier

**Status: Implemented**

The entire current application lives here. It is a statically-built React SPA served from a CDN (Vercel / Netlify / GitHub Pages). No server is required.

| Component | Description | Status |
|---|---|---|
| React SPA + PWA | Core application shell, state management, routing | ✅ Implemented |
| Localisation (i18next) | Four-language support: English, isiZulu, Afrikaans, Sesotho | ✅ Implemented (via `useState` — i18next for scale) |
| IndexedDB / Cache API | Offline support and journey progress persistence | ✅ Partially (browser state; persistence planned) |
| Google Maps JS API | Rich interactive map to replace the custom SVG | 🔲 Future enhancement |
| Weather Widget | Live weather at each station during the journey | 🔲 Future enhancement |
| Quiz Engine | Per-station knowledge quiz unlocked after reading heritage content | 🔲 Future enhancement |

### Key files

```
src/
├── App.tsx        — All components, state, animation loop, SVG map
├── index.css      — Global styles, Tailwind v4, CSS keyframe animations
└── main.tsx       — React entry point
```

### State architecture (current)

All state is managed locally in the root `App` component and passed down via props. No external state library is used.

```
App
 ├── phase          'intro' | 'journey'
 ├── lang           'en' | 'zu' | 'af' | 'st'
 ├── stIdx          Current station index (0–8)
 ├── tProg          Animation progress 0→1 between stations
 ├── awoken         Set<string>  — unlocked station IDs
 ├── completed      Set<string>  — departed station IDs
 ├── activeStation  Station | null  — panel currently open
 ├── isMoving       boolean  — rAF loop running
 └── newlyAwoken    string | null  — triggers "Chapter Unlocked" banner
```

### Animation loop

The train movement uses `requestAnimationFrame`. Each tick increments `tProg` by a fixed speed constant. When `tProg` reaches `1.0`, the train has arrived: `stIdx` increments, the new station is added to `awoken`, and `isMoving` clears.

---

## Tier 2 — External Services

**Status: Planned**

These third-party APIs are consumed directly from the browser via REST, requiring only a public API key (no backend proxy needed for basic usage).

| Service | Purpose | Protocol |
|---|---|---|
| Google Maps Platform | Replace the hand-drawn SVG with a live satellite/terrain map | REST |
| Google Weather API | Show current weather at the active station | REST |

Both services are called from the Presentation Tier. No sensitive keys are exposed because both APIs support browser-origin restrictions.

---

## Tier 3 — Application Tier (Supabase)

**Status: Planned**

[Supabase](https://supabase.com) provides the full backend as a managed service on top of PostgreSQL.

| Component | Purpose | Protocol |
|---|---|---|
| Supabase Platform | Managed hosting, dashboard, and SDK | — |
| Auth (JWT) | User accounts, session tokens, OAuth (Google / GitHub) | HTTPS |
| PostgREST API | Auto-generated REST API over every database table | HTTPS |
| Realtime Subscriptions | Live updates (e.g. multiplayer journeys, leaderboards) | WebSocket |
| Storage (Media) | Station images, audio clips, video assets | HTTPS |
| Edge Functions | Custom server-side logic (e.g. quiz scoring, PDF export) | HTTPS |

### Why Supabase?

- Zero-config REST API automatically generated from the PostgreSQL schema
- Built-in row-level security (RLS) maps directly to the Auth JWT
- Realtime subscriptions enable future collaborative features with no extra infrastructure
- Storage bucket keeps binary assets out of the database and off the CDN origin

---

## Tier 4 — Data Tier

**Status: Planned**

PostgreSQL with the PostGIS extension for geographic data types (station coordinates, route geometries).

| Table | Description |
|---|---|
| `routes` | The full rail route geometry (LineString), name, total distance |
| `stations` | Each of the 9 stations: name (all languages), coordinates, terrain type |
| `chapters` | Heritage story text per station, linked to `stations.id` |
| `hidden_gems` | Three gems per station, linked to `stations.id` |
| `quizzes` | Quiz questions and correct answers per station (future) |
| `user_progress` | Per-user journey state: current station, completed set, language preference |

### Schema sketch

```sql
-- Core geographic data
CREATE TABLE routes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  geometry    geography(LINESTRING, 4326),
  distance_km integer
);

CREATE TABLE stations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id    uuid REFERENCES routes(id),
  sequence    integer NOT NULL,           -- 1–9, journey order
  name_en     text NOT NULL,
  name_zu     text,
  name_af     text,
  name_st     text,
  subtitle    text,
  terrain     text,
  coordinates geography(POINT, 4326)
);

-- Content
CREATE TABLE chapters (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id  uuid REFERENCES stations(id),
  heritage    text NOT NULL
);

CREATE TABLE hidden_gems (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id  uuid REFERENCES stations(id),
  body        text NOT NULL,
  sort_order  integer
);

-- User state (requires Auth)
CREATE TABLE user_progress (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id),
  current_station integer DEFAULT 0,
  completed       integer[] DEFAULT '{}',   -- array of sequence numbers
  language        text DEFAULT 'en',
  updated_at      timestamptz DEFAULT now()
);
```

---

## Data Flow — End to End

```
User opens app
      │
      ▼
React SPA loads (CDN)
      │
      ├─► IndexedDB  ←── check for cached progress
      │
      ▼
[If authenticated]
Supabase Auth (JWT)
      │
      ▼
PostgREST API  ──SQL──►  PostgreSQL
  GET /stations               stations table
  GET /chapters               chapters table
  GET /hidden_gems            hidden_gems table
  GET/PATCH /user_progress    user_progress table
      │
      ▼
React state hydrated from API response
      │
      ▼
User interacts → rAF animation → station unlock
      │
      ▼
PATCH /user_progress  (debounced, on station arrival)
      │
      ▼
Supabase Realtime broadcasts change to other sessions
```

---

## Technology Decisions

| Decision | Choice | Rationale |
|---|---|---|
| UI framework | React 19 | Hooks + concurrent features; familiar to the widest contributor base |
| Build tool | Vite 8 | Sub-second HMR; first-class Tailwind v4 plugin support |
| Styling | Tailwind CSS v4 | Utility-first; no PostCSS config needed with the Vite plugin |
| Language | TypeScript 5.7 | Type-safe station/state interfaces prevent runtime shape mismatches |
| Backend | Supabase | Eliminates custom API server; PostGIS handles route geometries natively |
| Deployment | Vercel / Netlify | Zero-config static deploys from Git; edge CDN |

---

## Deployment Targets

See [README.md](../README.md) for step-by-step deployment instructions covering Vercel, Netlify, GitHub Pages, and custom static hosts.

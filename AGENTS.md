# interactive-train-journey-map

React + Vite + Tailwind CSS project.

## Setup

```bash
npm install
npm run dev
```

## Development Server

The Vite dev server runs on port **8443** by default (configurable via the `PORT` env var).

- Hot reload is enabled — changes to source files are reflected immediately.
- When running inside Figma Make, the server is started automatically.

## Key Files

| Path | Purpose |
|---|---|
| `src/App.tsx` | Root component — phase (landing → intro → journey) and language state |
| `src/lib/navigation.ts` | URLs without a router: `/` landing, `/sign-in`, `/board` intro + journey (signed-in only) |
| `src/lib/auth.ts` | Passenger sign-in — **placeholder**, no backend yet; swap `signIn()` for the real service |
| `src/components/SignInPage.tsx` | Sign-in page (sign-in only, no registration) |
| `src/lib/preferences.ts` | Passenger settings (language, train speed, weather, motion…) saved on the device; `usePreferences()` |
| `src/components/landing/` | Marketing landing page (formerly the separate enchanted-lane-landing project) |
| `src/styles/tokens.ts` | Antique Brass palette and fonts used by app components |
| `src/main.tsx` | React entry point |
| `src/index.css` | Global styles and Tailwind CSS import |
| `src/types/index.ts` | Shared TypeScript types |
| `src/data/stations.ts` | Station data and language constants |
| `src/hooks/useTrainAnimation.ts` | Animation loop and journey state |
| `src/components/` | Feature components |
| `src/components/ui/` | Small reusable UI components |
| `vite.config.ts` | Vite configuration |
| `.env.example` | Environment variable reference |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check then build for production |
| `npm run preview` | Serve the production build locally |
| `npm run typecheck` | TypeScript type-check only |

## Styling

Uses **Tailwind CSS v4** loaded via the Vite plugin — no PostCSS config needed. Custom design tokens are defined in `src/index.css` under `@theme`.

## Environment Variables

Copy `.env.example` to `.env` and fill in values before running:

```
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_publishable_or_anon_key
```

Only `VITE_` variables are client-visible. Keep service-role keys, signing
secrets, and other privileged credentials in server environment variables.

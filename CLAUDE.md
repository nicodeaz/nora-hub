# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Nora Hub is a private, PIN-protected single-page web app (React 19 + TypeScript + Vite) built in AI Studio. It's a personal portal/dashboard for Nora Filmus (actress, clown, teacher, cultural producer) with quick-access link cards, notes, a press kit, and a testimonials wall. UI copy and content are in Spanish (Argentine).

## Commands

- `npm run dev` — start dev server on port 3000 (host 0.0.0.0)
- `npm run build` — production build via Vite (outputs to `dist/`)
- `npm run preview` — preview the production build
- `npm run lint` — type-check only, via `tsc --noEmit` (no separate test runner or ESLint config exists in this repo)

There is no test suite. Validate changes with `npm run lint` and by running the app.

## Architecture

**Single-page, no router, no backend.** Everything lives in `src/`, rendered by `src/main.tsx` → `src/App.tsx`. `App.tsx` is the sole owner of all application state (config, notes, testimonials, UI/modal open-state) and passes data + callbacks down as props — there is no context provider or state library.

**Persistence is entirely `localStorage`**, keyed by:
- `nora_hub_config` — the `AppConfig` object (PIN, cards, external URLs)
- `nora_hub_notes` — `QuickNoteItem[]`
- `nora_hub_testimonials` — `TestimonialItem[]`
- `nora_hub_unlocked` — "remember me" flag for the PIN lock

`App.tsx` syncs each piece of state to `localStorage` via `useEffect`. Defaults for all three collections live in `src/data/initialConfig.ts` (`INITIAL_CONFIG`, `INITIAL_NOTES`, `INITIAL_TESTIMONIALS`, plus `PRESS_BIOS` used by the press kit). "Reset to default" simply restores these constants.

**Shared types** are centralized in `src/types.ts` (`HubCardItem`, `TestimonialItem`, `QuickNoteItem`, `PressBio`, `AppConfig`). When adding a field to any of these, update `initialConfig.ts` defaults and any modal that edits that shape.

**Two top-level "routes", both gated in `App.tsx` before the main render:**
1. Public testimonial submission view (`PublicTestimonialView`) — activated when the URL hash/query contains `testimonio` (e.g. a shareable `#dejar-testimonio` link). Lets anyone submit a testimonial without unlocking the app; new submissions default to `isApproved: false` and must be approved from inside the hub.
2. PIN lock screen (`PinLockScreen`) — shown whenever `nora_hub_unlocked` isn't set; PIN is a 4-digit code stored in `AppConfig.pin` (default `1234`), editable from the settings modal.

**Card actions**: `HubCardItem.actionType` determines what a dashboard card does when clicked — `'link'` opens `url` in a new tab, while `'press-kit'`, `'testimonials'`, and `'notes'` open the corresponding modal instead of navigating. Legacy cards without `actionType` fall back to matching on hash-style `url` values (`#prensa`, `#testimonios`, `#proyectos`).

**Modals** (`QuickNotesModal`, `PressKitModal`, `TestimonialsModal`, `HubConfigModal`, `PWAInstallPrompt`) are all mounted unconditionally at the bottom of `App.tsx` and toggle visibility via `isOpen` props — there's no modal manager. `HubConfigModal` doubles as the card create/edit form and the PIN-change form (tabbed).

**Mobile nav**: `MobileNav` is a sticky bottom bar (mobile-only) with its own `mobileTab` state in `App.tsx`, mapped to the same open/close handlers as the desktop `Header` buttons. Keep both entry points wired to the same handler when adding a new modal/section.

**PWA support**: `public/manifest.json` + `public/sw.js` (cache-first service worker, registered in `App.tsx`). `PWAInstallPrompt` handles the `beforeinstallprompt` flow on Android/desktop and shows manual instructions on iOS (detected via UA sniffing).

**Styling**: Tailwind CSS v4 (`@tailwindcss/vite` plugin, no `tailwind.config.js` — theme tokens are defined inline in `src/index.css` via `@theme`). Custom design tokens: color palette (`crema`, `tinta`, `rojo`, `rosa`, `verde`, `dorado`) and font families (`font-signature`, `font-title`, `font-label`, `font-body`) mapped to Google Fonts loaded in `index.html`. Icons come from `lucide-react`, referenced by string name (e.g. `HubCardItem.icon`) and resolved dynamically in `HubCard.tsx`.

**Path alias**: `@/*` maps to the repo root (see `tsconfig.json` and `vite.config.ts`), matching this being a flat (non-`src`-aliased) AI Studio scaffold — note the alias points to `.`, not `./src`.

**Vite dev server behavior**: HMR/file-watching is conditionally disabled via `DISABLE_HMR=true` (see `vite.config.ts`) — this is intentional for the AI Studio agent-editing environment to prevent flicker; don't "fix" this.

**Unused scaffold dependencies**: `@google/genai`, `express`, and `dotenv` are present in `package.json` (AI Studio template boilerplate / `GEMINI_API_KEY` in `.env`) but are not currently imported anywhere in `src/`. There is no backend/server code in this repo despite the `express` dependency and the `clean` script referencing a `server.js` that doesn't exist.

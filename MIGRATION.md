# Migration Notes — Replit → GitHub / Vercel

This document records everything that was changed to make the project fully independent of Replit.

---

## Removed Replit Dependencies

| Package | Reason removed |
|---|---|
| `@replit/vite-plugin-runtime-error-modal` | Replit-only dev overlay |
| `@replit/vite-plugin-cartographer` | Replit-only code-navigation plugin |
| `@replit/vite-plugin-dev-banner` | Replit-only dev banner |
| `@workspace/api-client-react` | Replit pnpm workspace internal package, unused in source |

---

## Replaced Catalog References

The monorepo used `catalog:` and `workspace:*` version specifiers that only work inside a pnpm workspace. Every dependency now has a pinned npm version.

| Dependency | Old | New |
|---|---|---|
| `vite` | `catalog:` | `^7.3.2` |
| `react` | `catalog:` | `^19.1.0` |
| `react-dom` | `catalog:` | `^19.1.0` |
| `tailwindcss` | `catalog:` | `^4.1.14` |
| `@tailwindcss/vite` | `catalog:` | `^4.1.14` |
| `@vitejs/plugin-react` | `catalog:` | `^5.0.4` |
| `@tanstack/react-query` | `catalog:` | `^5.90.21` |
| `framer-motion` | `catalog:` | `^12.23.24` |
| `lucide-react` | `catalog:` | `^0.545.0` |
| `wouter` | `catalog:` | `^3.3.5` |
| `zod` | `catalog:` | `^3.25.76` |
| `clsx` | `catalog:` | `^2.1.1` |
| `tailwind-merge` | `catalog:` | `^3.3.1` |
| `class-variance-authority` | `catalog:` | `^0.7.1` |
| `@types/react` | `catalog:` | `^19.2.0` |
| `@types/react-dom` | `catalog:` | `^19.2.0` |
| `@types/node` | `catalog:` | `^22.0.0` |

---

## New Dev Dependencies Added

| Package | Version | Reason |
|---|---|---|
| `typescript` | `^5.8.3` | Was a root-level workspace dep, now explicit in the project |

---

## `vite.config.ts` Changes

**Before (Replit version):**
- Threw an error if `PORT` or `BASE_PATH` env vars were absent
- Loaded `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` conditionally
- Used `import.meta.dirname` (Node 20.11+ only)

**After (standalone version):**
- `PORT` defaults to `3000` if not set
- `BASE_PATH` defaults to `/` if not set
- No Replit plugins
- Uses `__dirname` (Vite shims this in config context)
- `outDir` is `dist` (not `dist/public`)

---

## `tsconfig.json` Changes

**Before (Replit version):**
- Extended `../../tsconfig.base.json` (monorepo root, not present outside Replit)
- Had `references` to `../../lib/api-client-react` (internal workspace lib)

**After (standalone version):**
- Fully self-contained — all compiler options inlined
- No `extends` to workspace files
- No `references` to workspace libs
- Standard Vite React TypeScript config

---

## `package.json` Changes

- Name: `@workspace/taco-dashboard` → `taco-dashboard`
- All `catalog:` → real semver versions
- `workspace:*` dependencies removed
- `build` script: `vite build --config vite.config.ts` → `vite build`
- `dev` script: `vite --config vite.config.ts --host 0.0.0.0` → `vite`
- Runtime dependencies moved from `devDependencies` to `dependencies`

---

## Files Added

| File | Purpose |
|---|---|
| `.env.example` | Documents all environment variables |
| `.gitignore` | Standard Node/Vite ignores |
| `vercel.json` | SPA rewrite rule for wouter client-side routing |
| `README.md` | Installation and deployment instructions |
| `MIGRATION.md` | This file |

---

## Files Removed

| File | Reason |
|---|---|
| `src/pages/EngineeringTeam.tsx` | Unused — replaced by `TeamPerformance.tsx` |

---

## Commands

### Install dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### Run development server
```bash
npm run dev
# opens http://localhost:3000
```

### Run production build
```bash
npm run build
# output → dist/
```

### Preview production build locally
```bash
npm run serve
```

---

## Deployment

### Vercel

1. Import repository into Vercel
2. Set **Root Directory** to `artifacts/taco-dashboard` (or repo root if you copied the folder out)
3. **Framework preset**: Vite (auto-detected)
4. **Build command**: `npm run build`
5. **Output directory**: `dist`
6. The included `vercel.json` handles SPA routing — no extra config needed

### Netlify

1. Set **Base directory**: `artifacts/taco-dashboard`
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. Add a `_redirects` file in `public/`:
   ```
   /*  /index.html  200
   ```

### Any static host (S3, GitHub Pages, Cloudflare Pages)

Upload the entire contents of `dist/` and configure the host to serve `index.html` for all 404s (SPA fallback).

---

## Environment Variables

All optional — the app runs fully with mock data if none are set.

| Variable | Default | Description |
|---|---|---|
| `PORT` | `3000` | Dev server port |
| `BASE_PATH` | `/` | URL base path |
| `VITE_GOOGLE_SPREADSHEET_ID` | — | Google Sheet ID for live data |
| `VITE_GOOGLE_CLIENT_EMAIL` | — | Service account email |
| `VITE_GOOGLE_PRIVATE_KEY` | — | Service account private key |

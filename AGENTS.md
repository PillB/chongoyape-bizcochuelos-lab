# AGENTS.md — Build, Deploy & Engineering Guide

> **Read this before making changes.** This document captures the production
> build/deploy pipeline, the recurring pitfalls we have already hit and fixed,
> and the preventive checklist that stops them from coming back.

---

## 1. Project at a Glance

| Aspect | Value |
|---|---|
| **Stack** | Next.js 16 (App Router, Turbopack) · TypeScript 5 · Tailwind CSS 4 · shadcn/ui (New York) · Prisma 6 (SQLite) · Framer Motion |
| **Runtime** | Bun (package manager + script runner) |
| **Deploy target** | GitHub Pages — **static export** (`output: "export"`) |
| **Live URL** | https://pillb.github.io/chongoyape-bizcochuelos-lab/ |
| **Repo** | https://github.com/PillB/chongoyape-bizcochuelos-lab |
| **basePath** | `/chongoyape-bizcochuelos-lab` (production only) |

---

## 2. Build & Deploy Pipeline

### 2.1 Local development

```bash
bun run dev          # dev server on http://localhost:3000 (teed to dev.log)
bun run lint         # ESLint
```

### 2.2 Production build (local)

The static export requires the JSON data file to exist **before** `next build`.
The full pipeline, in order:

```bash
bun run db:generate                    # 1. Prisma Client
bun run db:push                        # 2. Create/migrate SQLite schema
bun run db:seed                        # 3. Seed all lab data
bash .zscripts/generate-static-data.sh # 4. Export DB → public/lab-data.json
bun run build                          # 5. next build → out/
```

**Why this order matters:** `next build` with `output: "export"` copies
`public/*` into `out/` at build time. If `public/lab-data.json` is stale or
missing, the deployed site serves stale/empty data. The seed + generate steps
must run first.

### 2.3 CI/CD (GitHub Actions)

Two workflows live in `.github/workflows/`:

| Workflow | File | Triggers | What it does |
|---|---|---|---|
| **CI** | `ci.yml` | push to `main`, PR to `main` | install → db:generate → db:push → db:seed → generate-static-data → lint → build → verify artifacts → upload artifact |
| **Deploy** | `deploy.yml` | push to `main`, `workflow_dispatch` | same as CI build, then `touch out/.nojekyll` → push `out/` to `gh-pages` branch (force_orphan) → smoke-test live URL |

**Concurrency:** both workflows cancel in-progress runs for the same ref
(`ci-${{ github.ref }}` / `deploy-${{ github.ref }}`) to save Actions minutes.

**Smoke test:** after deploy, the workflow waits 20s for Pages propagation,
then `curl`s the live page + `lab-data.json` and validates the JSON with `jq`.

### 2.4 GitHub Pages configuration

- **Source:** Deploy from branch → `gh-pages` / `/ (root)`
- **Custom domain:** none (uses default `pillb.github.io/chongoyape-bizcochuelos-lab/`)
- **Enforce HTTPS:** enabled (default)
- `.nojekyll` is added by the deploy workflow — **required** because Jekyll
  ignores `_next/` folders and would 404 the JS/CSS assets.

---

## 3. Architecture: Static Export Constraints

This project is a **static export** — there is no Node server in production.
This imposes hard constraints that agents MUST respect:

| ❌ Not allowed | ✅ Use instead |
|---|---|
| API routes (`/api/*`) | Static `public/lab-data.json` fetched client-side |
| Server Actions | Client-side state + `fetch()` to static JSON |
| `revalidate` / ISR | Static JSON regenerated at build time only |
| `cookies()`, `headers()` in server components | Client-side only |
| `next/image` optimizer | `images: { unoptimized: true }` + plain `<img>` |
| Dynamic routes with `generateStaticParams` missing | All routes static |

**Data flow:**
```
prisma/seed.ts → SQLite (db/custom.db) → .zscripts/generate-static-data.sh → public/lab-data.json → out/lab-data.json (static)
                                                                              ↑
                                                                       fetched by client via dataUrl()
```

### basePath handling

`next.config.ts` sets `basePath` + `assetPrefix` **only in production**:

```ts
...(process.env.NODE_ENV === "production" && {
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,
}),
```

All runtime asset/data URLs go through `src/lib/asset-url.ts`:
- `assetUrl(path)` → for `<img src>` (Next doesn't auto-prefix these)
- `dataUrl()` → for `fetch()` calls

**NEVER** hardcode `/chongoyape-bizcochuelos-lab/` in components, and
**NEVER** use `window.location.hostname` checks — the `asset-url.ts` helpers
are the single source of truth.

---

## 4. Known Pitfalls & Preventive Fixes

These are bugs we have already hit and fixed. Read this section before
touching layouts, ScrollAreas, grids, or the build config.

### 4.1 ScrollArea `max-h-*` silently ignored (CRITICAL)

**Symptom:** A `<ScrollArea className="max-h-[400px]">` grows to fit ALL
content, overflowing into the next section instead of scrolling internally.

**Root cause:** The shadcn `ScrollArea` Viewport used `size-full`
(`height:100%`). Per CSS spec, `height:100%` only resolves against a parent's
**explicit height**, not its `max-height`. So when the Root only has
`max-height` (no `height`), the viewport's `height:100%` resolves to `auto`
and grows unbounded.

**Fix applied:** `src/components/ui/scroll-area.tsx` — Viewport now has
`max-h-[inherit]` (inherits the Root's computed `max-height`) and the Root
has `overflow-hidden` as defence-in-depth.

**Preventive rule:** When using `<ScrollArea>`, always pass `max-h-[Npx]`
(or `h-[Npx]`) on the Root. Never rely on a parent's height alone. If you
see content leaking past a card boundary, check the ScrollArea viewport
computed height first.

### 4.2 CSS grid `lg:grid-cols-*` without mobile base (CRITICAL)

**Symptom:** On mobile, a grid's column sizes to its content's `min-content`
width (e.g. an accordion at 428px on a 375px viewport), causing horizontal
page overflow.

**Root cause:** `grid lg:grid-cols-[1fr_320px]` has no mobile columns, so
the grid falls back to implicit `auto` track sizing, which uses `max-content`
— the widest child wins.

**Fix applied:** Every responsive grid now starts with `grid-cols-1`:
`grid grid-cols-1 lg:grid-cols-[1fr_320px]`.

**Preventive rule:** **Every** `grid` with a `lg:`/`md:`/`sm:` breakpoint
MUST have an explicit base (`grid-cols-1`). Run this check:
```bash
rg 'className="grid lg:grid-cols' src/   # should return NOTHING
```

### 4.3 Flex children overflow without `min-w-0`

**Symptom:** Text or buttons inside a flex row get clipped or push siblings
off-screen because flex children default to `min-width: auto`.

**Fix applied:** Every flex row with truncatable text has `min-w-0` on the
text container, and `flex-shrink-0` on fixed-width siblings (icons, badges).

**Preventive rule:** In any `flex` container with text that should truncate:
1. Add `min-w-0` to the text's parent.
2. Add `truncate` (single line) or `line-clamp-N` (multi-line) to the text.
3. Add `flex-shrink-0` to icons/badges that must not compress.
4. Add `overflow-hidden` to the outer card if it wraps a ScrollArea.

### 4.4 NavBar horizontal overflow on desktop

**Symptom:** 11 nav buttons don't fit at 1280px, causing a page-wide
horizontal scrollbar.

**Fix applied:** `src/components/lab/nav-bar.tsx` — nav is now
`flex-1 min-w-0 overflow-x-auto` (scrolls internally), with
`whitespace-nowrap flex-shrink-0` on buttons. The outer container has
`overflow-x-hidden`.

### 4.5 `.nojekyll` missing → CSS/JS 404 on GitHub Pages

**Symptom:** Live site loads HTML but CSS/JS return 404; page renders
unstyled.

**Root cause:** GitHub Pages runs Jekyll by default, which ignores folders
starting with `_` (like `_next/`).

**Fix applied:** Deploy workflow runs `touch out/.nojekyll` before pushing.

### 4.6 basePath baked at build time only

**Symptom:** Local dev works but production assets 404 (or vice versa).

**Root cause:** `basePath` is set only when `NODE_ENV=production`. If you
build without `NODE_ENV=production`, the HTML won't have the `/repo-name/`
prefix and assets 404 on Pages.

**Preventive rule:** The CI/deploy workflows set `NODE_ENV: production` on
the build step. If you build locally to test Pages, always run:
```bash
NODE_ENV=production bun run build
```

### 4.7 Absolute DATABASE_URL breaks CI

**Symptom:** `db:push` fails in GitHub Actions because
`DATABASE_URL=file:/home/z/my-project/db/custom.db` is an absolute sandbox
path.

**Fix applied:** `.env` now uses a relative path:
`DATABASE_URL="file:./db/custom.db"`. Prisma resolves this relative to the
project root in both local dev and CI.

### 4.8 Stale `lab-data.json` after schema/seed changes

**Symptom:** UI shows old data after editing `prisma/seed.ts`.

**Root cause:** `public/lab-data.json` is a build artifact checked into git.
Editing the seed does NOT regenerate it automatically.

**Preventive rule:** After ANY change to `prisma/seed.ts` or the schema:
```bash
bun run db:push && bun run db:seed && bash .zscripts/generate-static-data.sh
```
Then commit the regenerated `public/lab-data.json`.

---

## 5. Pre-Commit Checklist

Run through this before committing. The CI workflow runs the same checks,
but catching locally is faster.

```bash
# 1. Regenerate data if seed/schema changed
bun run db:push && bun run db:seed && bash .zscripts/generate-static-data.sh

# 2. Lint — MUST be 0 errors
bun run lint

# 3. Production build — MUST succeed
NODE_ENV=production bun run build

# 4. Verify artifacts
test -f out/index.html && test -f out/lab-data.json && test -f out/404.html
grep -q '/chongoyape-bizcochuelos-lab/_next/' out/index.html

# 5. Responsive sanity (grep — should return NOTHING)
rg 'className="grid lg:grid-cols' src/                    # missing mobile base
rg 'window\.location\.hostname' src/                      # should use asset-url.ts
rg '/chongoyape-bizcochuelos-lab/' src/components/        # hardcoded basePath

# 6. Dev server smoke test
bun run dev   # then visit / in the Preview Panel
```

---

## 6. Common Commands

| Command | Purpose |
|---|---|
| `bun run dev` | Dev server on :3000 (teed to `dev.log`) |
| `bun run build` | Production static export → `out/` |
| `bun run lint` | ESLint |
| `bun run test` | Playwright E2E (27 tests) |
| `bun run db:generate` | Generate Prisma Client |
| `bun run db:push` | Create/migrate SQLite schema |
| `bun run db:seed` | Seed all lab data from `prisma/seed.ts` |
| `bash .zscripts/generate-static-data.sh` | Export DB → `public/lab-data.json` |

---

## 7. File Map (key files only)

```
.github/workflows/
  ci.yml                     # lint + build on PR/push
  deploy.yml                 # build + deploy to gh-pages + smoke test
.zscripts/
  generate-static-data.sh    # DB → public/lab-data.json
prisma/
  schema.prisma              # SQLite schema
  seed.ts                    # all lab data (624 lines)
src/lib/
  asset-url.ts               # basePath-aware URL helpers (SINGLE source of truth)
  db.ts                      # Prisma client singleton
src/components/ui/
  scroll-area.tsx            # shadcn ScrollArea (has max-h-[inherit] fix)
src/components/lab/          # all lab UI components
next.config.ts               # output:export + basePath (prod only)
public/lab-data.json         # static data (gitignored? NO — checked in, regenerated)
```

---

## 8. When Things Break

### Build fails with "Cannot find module '@prisma/client'"
→ Run `bun run db:generate`. The client is generated into `node_modules`.

### Live site shows old data
→ `public/lab-data.json` is stale. Run
`bash .zscripts/generate-static-data.sh`, commit, push.

### Live site 404s CSS/JS
→ `.nojekyll` missing from `gh-pages` root. The deploy workflow adds it; if
deploying manually, `touch out/.nojekyll` before pushing.

### Horizontal scrollbar on desktop
→ A grid is missing `grid-cols-1` mobile base, or a flex child is missing
`min-w-0`. See §4.2 and §4.3.

### ScrollArea content overflows its card
→ The `max-h-[inherit]` fix in `scroll-area.tsx` was reverted or a consumer
is using a bare `<ScrollArea>` without `max-h-*`. See §4.1.

### Playwright tests fail with hydration errors
→ Usually a duplicate DOM `id`. The `#recipe-lab` id was duplicated between
the page wrapper and the component in a prior bug — ensure ids are unique.

---

## 9. Agent Workflow (for AI assistants)

1. **Read this file** (`AGENTS.md`) and `/home/z/my-project/worklog.md` first.
2. **Run the pre-commit checklist** (§5) before committing.
3. **Update `worklog.md`** with a `---`-delimited section after each task
   (Task ID, Agent, Task, Work Log, Stage Summary).
4. **Never** disable lint or build verification to "make it pass".
5. **Never** hardcode the basePath or use `window.location` for asset URLs.
6. **Always** regenerate `public/lab-data.json` after seed/schema changes.
7. If you hit a new pitfall, add it to §4 and the checklist in §5.

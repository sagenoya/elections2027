# Tilt: notes for contributors and coding agents

Live forecasts for Nigeria's 2027 presidential (16 Jan 2027) and governorship (6 Feb 2027) elections,
built only from public data. Projections, never declarations: only INEC declares results.

## Layout

```
api/     NestJS 12 (ESM, Vitest, oxlint) + Prisma 7 (driver adapter, Neon Postgres)
web/     Next.js 16 static export (Cloudflare Pages), TanStack Query
deploy/  docker compose + Caddy for the Oracle Cloud Always Free VM
docs/    setup, data sources
```

## How data flows

NestJS jobs collect data → Postgres → model run → snapshot JSON published to Cloudflare R2
(`forecast/history/<version>.json`, `forecast/latest.json`, `forecast/version.json` written last).
Browsers poll `version.json` from the CDN and load the new snapshot. The public site never calls the API.

## Conventions

- API: modules in `src/modules/<feature>/` (module, thin controller, service, `dto/`, `*.scheduler.ts`).
  class-validator DTOs on every input, uniform `{ success, statusCode, data, timestamp }` envelope,
  global exception filter, Helmet, explicit CORS, throttling. ESM: relative imports end in `.js`.
- Prisma: snake_case tables via `@@map`, UUID ids, enums for statuses, additive migrations,
  `prisma migrate deploy` as a release step (never on app boot).
- Web: `data/api-url.ts` → `repository/` (FetchFactory, modules, types) → `$api` → `hooks/` (TanStack Query
  key factories). Components never call `fetch`. Tailwind with design tokens from `app/globals.css`, no raw hex.
- The snapshot contract lives in `api/src/modules/forecast/forecast.types.ts` and is mirrored in
  `web/repository/modules/types/forecast.ts`. Change both together.
- Run before committing: `api`: `npx tsc --noEmit && npm run lint && npm test`; `web`: `npx tsc --noEmit && npm run lint && npm run build`.

## Commits

- Author commits as the repo owner. Do **not** add AI co-author or session trailers
  (`Co-Authored-By: Claude…`, `Claude-Session: …`) to commit messages or PR descriptions.

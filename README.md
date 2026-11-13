# Tilt

Live, state-by-state forecasts for Nigeria's 2027 elections, built only from public data.

- **Presidential & National Assembly:** Saturday 16 January 2027
- **Governorship & State Assembly:** Saturday 6 February 2027 (28 states)

Projections, not results. Only INEC declares winners.

## Run locally

Needs Node 22 and a Postgres database (a free Neon project or local Postgres).

```bash
# API
cd api
cp .env.example .env          # set DATABASE_URL
npm install
npx prisma migrate deploy
npm run db:seed
npm run start:dev             # http://localhost:4000/api/v1/health
```

```bash
# Web (second terminal)
cd web
cp .env.example .env.local
npm install
npm run dev                   # http://localhost:3000
```

`npm run dev` only fully works when opened as `localhost` (Next.js 16 blocks dev scripts from other
addresses). To open it from another device, a tunnel or a preview pane, use the production build:

```bash
npm run preview               # builds the static export, serves it on :3000 with live /data
```

In development the API publishes snapshots into `web/public/data`, so the web app shows live updates
without any cloud services. Trigger a run by hand:

```bash
curl -X POST -H "x-admin-key: dev-admin-key" http://localhost:4000/api/v1/forecast/runs
```

## Docs

- [PLAN.md](PLAN.md): phases and status
- [docs/setup-accounts.md](docs/setup-accounts.md): Oracle, Neon, Cloudflare and deploy steps
- [docs/data-sources.md](docs/data-sources.md): every data source and its status
- [AGENTS.md](AGENTS.md): architecture and code conventions

# Tilt plan

Today → presidential election (Sat 16 Jan 2027) → governorship (Sat 6 Feb 2027) → post-mortem.
Critical path: **P0 → P1 → P2 → P3 → P7**. Everything else can slip or shrink.

| Phase | Dates | Goal | Done when | Status |
|---|---|---|---|---|
| **P0 Setup** | 12–15 Nov | Accounts, repo, scaffold, data flowing end to end | A NestJS job publishes a snapshot to R2 and the live site shows it | 🟡 code done, accounts pending |
| **P1 Data** | 13–22 Nov | Clean data for all 37 states and 774 LGAs | Data-quality report lists every gap and its fix | ⬜ |
| **P2 Model** | 23 Nov – 2 Dec | Historical model + simulator with the 25% rule and runoff | 2023 backtest: right winner in ≥30/37 states, state share error <6 pts, 25% count within ±3 | ⬜ |
| **P3 Launch** | 2–7 Dec | Public site that updates itself | Live and correct for 48 h with nobody touching it | ⬜ |
| **P4 Intelligence** | 7–21 Dec | News → events → odds, with explanations | A real event moves the odds within ~2 min, explained on the site | ⬜ |
| **P5 Governorship** | 14–28 Dec | 28 governorship forecasts | All 28 states live | ⬜ |
| **P6 Polish & freeze** | 28 Dec – 9 Jan | Scenario sandbox, alerts, load test, **model freeze 9 Jan** | Load test passes, runbook written, model frozen | ⬜ |
| **P7 Election night** | build 21 Dec – 11 Jan, live 16 Jan | IReV polling-unit results → live projections | 2023 replay converges correctly; runs live until INEC declares | ⬜ |
| **P8 Governorship election** | 17 Jan – 6 Feb | Re-fit governorship with actual presidential results | Results declared | ⬜ |
| **P9 Post-mortem** | 7–28 Feb | Public accuracy report; next: Kogi, Bayelsa, Imo (Nov 2027) | Report published | ⬜ |

Expect a slowdown 24 Dec – 1 Jan; the 7 Dec launch leaves room for it.

## Phase 0 checklist

Code (done in this repo):
- [x] Monorepo: `api/` NestJS 12 + Prisma 7, `web/` Next.js 16 static export
- [x] Prisma schema v1 + initial migration (states, LGAs, parties, elections, candidates, results, turnout, indicators, raw ingest, events, model runs)
- [x] Seed: 36 states + FCT with zones; 28 governorship states flagged; 2027 election dates
- [x] Forecast pipeline: scheduled job (every 5 min + at boot) → snapshot → publish (local folder or R2) → recorded in `model_runs`
- [x] Admin API: `GET/POST /api/v1/forecast/runs` behind `x-admin-key`; `GET /api/v1/health`
- [x] Web: repository → `$api` → TanStack Query hooks; polls `version.json`, swaps snapshot live; countdowns; states by zone
- [x] Tests: 13 unit + 4 e2e (real Postgres); lint and typecheck clean; web builds as static export
- [x] Dockerfile (runtime + migrate targets), docker compose + Caddy (HTTPS) for the Oracle VM
- [x] GitHub Actions CI (api: typecheck, lint, unit, migrate, seed, e2e, build; web: typecheck, lint, build)

Accounts and deploy (you — see docs/setup-accounts.md):
- [ ] Private GitHub repo `tilt` + Claude GitHub App access, then push this code
- [ ] Oracle Cloud Always Free account + ARM VM
- [ ] Neon project (database `tilt`)
- [ ] Cloudflare: R2 bucket `tilt-data` (public domain + CORS), Pages project for `web/`
- [ ] Domain (optional, ~$10–15/yr)
- [ ] Legal check: Electoral Act 2026 rules on publishing projections near election day
- [ ] Deploy: migrate, seed, `docker compose up`, confirm the live site updates from R2

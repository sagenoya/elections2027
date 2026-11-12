# Accounts and deploy (Phase 0)

Everything here is free. Do the steps in order; each ends with a check.

> Never paste passwords, API keys or connection strings into chat or commit them. They go in
> `api/.env` on the server, and in the Cloudflare/GitHub dashboards.

## 1. GitHub (private repo)

1. Create a **private** repo named `tilt` on your account (no README, no .gitignore — the code has them).
2. Give Claude access: <https://claude.ai/connect-github> → make sure the Claude GitHub App can see `tilt`.
3. Tell Claude the repo is ready; it will push the Phase 0 code.

**Check:** the repo shows `api/`, `web/`, `deploy/`, `docs/` and the CI run is green.

## 2. Oracle Cloud Always Free (runs NestJS 24/7)

1. Sign up at <https://signup.cloud.oracle.com> with your own email. A card is needed for identity
   verification; Always Free resources are not charged.
2. **Home region** cannot be changed later and Always Free resources only exist there. Pick one with
   ARM capacity; Johannesburg (`af-johannesburg-1`) is closest to Nigeria, London (`uk-london-1`) is a
   good alternative. Latency doesn't matter much: visitors read the CDN, not this server.
3. Create a VM: *Compute → Instances → Create*:
   - Image: **Ubuntu 24.04** (aarch64)
   - Shape: **VM.Standard.A1.Flex**, 2 OCPU / 12 GB is plenty (Always Free allows up to 4 / 24)
   - Add your SSH public key
   - If you get "Out of capacity", retry later or try another availability domain.
4. Open ports 80 and 443: *Networking → VCN → Security List → Add Ingress Rules* for TCP 80 and 443
   from `0.0.0.0/0`. Then on the VM:
   ```bash
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```
5. Install Docker:
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER && newgrp docker
   ```

**Check:** `docker run --rm hello-world` works on the VM.

## 3. Neon (Postgres)

1. Create a project at <https://neon.tech>, region close to your VM (e.g. AWS Frankfurt or London).
2. Create database `tilt`.
3. Copy two connection strings: **pooled** (for `DATABASE_URL`) and **direct** (for `DIRECT_DATABASE_URL`).

## 4. Cloudflare (R2 + Pages)

**R2 bucket (the live data the site reads):**
1. *R2 → Create bucket* `tilt-data`.
2. *Settings → Public access*: connect a custom domain (e.g. `data.yourdomain.ng`). The `r2.dev` URL is
   rate-limited and only for testing.
3. *Settings → CORS policy*:
   ```json
   [{ "AllowedOrigins": ["https://yourdomain.ng", "https://tilt.pages.dev", "http://localhost:3000"],
      "AllowedMethods": ["GET", "HEAD"], "AllowedHeaders": ["*"], "MaxAgeSeconds": 3600 }]
   ```
4. *R2 → Manage API tokens → Create*: **Object Read & Write** on `tilt-data` only. Note the Account ID,
   Access Key ID and Secret.

**Pages (the website):**
1. *Workers & Pages → Create → Pages → Connect to Git* → repo `tilt`.
2. Root directory `web`, build command `npm run build`, output directory `out`.
3. Environment variable `NEXT_PUBLIC_DATA_URL` = your R2 public URL (e.g. `https://data.yourdomain.ng`).

## 5. Deploy the API on the VM

```bash
git clone git@github.com:<you>/tilt.git && cd tilt
cp api/.env.example api/.env && nano api/.env
```

Set in `api/.env`:

| Key | Value |
|---|---|
| `NODE_ENV` | `production` |
| `DATABASE_URL` / `DIRECT_DATABASE_URL` | Neon pooled / direct strings |
| `CORS_ORIGINS` | your site origin(s) |
| `ADMIN_API_KEY` | output of `openssl rand -hex 32` |
| `STORAGE_DRIVER` | `r2` |
| `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET` | from step 4 |

Point a DNS A record (e.g. `api.yourdomain.ng`) at the VM's public IP, then:

```bash
cd deploy
echo "API_DOMAIN=api.yourdomain.ng" > .env
docker compose run --rm migrate
docker compose run --rm migrate npm run db:seed
docker compose up -d --build api caddy
```

**Check (Phase 0 done):**
- `curl https://api.yourdomain.ng/api/v1/health` → `"status":"ok"`
- `https://data.yourdomain.ng/forecast/version.json` changes every 5 minutes
- The Pages site shows "Live · updated …" and swaps snapshot without a reload

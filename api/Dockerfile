# Built ON the Oracle ARM VM (docker compose build), so no cross-arch builds are needed.
FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# postinstall runs `prisma generate`, which needs the schema copied above.
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

# Release-step image: has the Prisma CLI for `prisma migrate deploy`.
FROM build AS migrate
CMD ["npx", "prisma", "migrate", "deploy"]

FROM build AS prune
RUN npm prune --omit=dev

FROM node:22-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prune /app/node_modules ./node_modules
COPY --from=prune /app/dist ./dist
COPY --from=prune /app/package.json ./
USER node
EXPOSE 4000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:4000/api/v1/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/main.js"]

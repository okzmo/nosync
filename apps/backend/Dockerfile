# Base image
FROM node:22-alpine as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN npm install -g turbo@^2.3.3
WORKDIR /app
COPY pnpm-lock.yaml /app
RUN pnpm fetch

# Builder image
FROM base AS builder
WORKDIR /app
COPY . .
RUN turbo prune backend --docker

# Installer image
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install -r --offline
COPY --from=builder /app/out/full/ .
RUN turbo run build --filter=backend

# Runner image
FROM base
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 adonisjs

COPY --from=installer --chown=adonisjs:nodejs /app/apps/backend/build .
RUN pnpm i --prod

USER adonisjs

ENV NODE_ENV=production
ENV PORT=3333

CMD ["node", "bin/server.js"]

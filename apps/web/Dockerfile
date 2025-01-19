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
RUN turbo prune web --docker

# Installer image
FROM base AS installer
WORKDIR /app
COPY --from=builder /app/out/json/ .
RUN pnpm install -r --offline
COPY --from=builder /app/out/full/ .
RUN turbo run build --filter=web

# Runner image
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=installer /app/apps/web/build .
COPY nginx/nginx-web.conf /etc/nginx/nginx.conf
ENV VITE_API_URL=http://localhost:3333
ENV NODE_ENV=production

# FROM node:22-alpine AS BUILDER
# WORKDIR /app
# copy package*.json ./
# RUN npm ci
# COPY . .
# RUN npm run build
# RUN npm prune --production
#
# FROM node:22-alpine
# WORKDIR /app
# COPY --from=builder /app/build build/
# COPY --from=builder /app/node_modules node_modules/
# COPY package.json .
#
# EXPOSE 3000
# ENV NODE_ENV=production
#
# CMD ["node", "build"]

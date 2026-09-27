# syntax=docker/dockerfile:1

# ---- Dépendances ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci

# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Valeurs factices : le build ne se connecte pas à la base (pages rendues à la demande).
ENV NEXT_TELEMETRY_DISABLED=1 \
    PAYLOAD_SECRET=build-time-placeholder-secret-not-used-at-runtime \
    DATABASE_URI=postgres://build:build@localhost:5432/build
RUN npm run build

# ---- Runtime ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/data/media
RUN addgroup -S -g 1001 app && adduser -S -u 1001 -G app app \
 && mkdir -p /data/media && chown -R app:app /data
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
VOLUME ["/data/media"]
# Les migrations Payload (prodMigrations) s'exécutent au démarrage.
CMD ["node", "server.js"]

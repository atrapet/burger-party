# syntax=docker/dockerfile:1

# --- Stage 1: build the React client ---
FROM node:24-alpine AS web
WORKDIR /web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

# --- Stage 2: runtime — Node server serves the built client + realtime API ---
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY server/ ./
COPY --from=web /web/dist ./public
ENV PORT=3000 \
    WEB_DIR=/app/public \
    DB_PATH=/app/data/orders.sqlite
EXPOSE 3000
CMD ["npm", "start"]

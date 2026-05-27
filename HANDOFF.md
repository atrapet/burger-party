# Handoff — Burger Party 🍔

**Status: feature-complete and verified.** This doc lets a fresh Claude Code session
(on the Ubuntu box) continue without re-reading the whole tree. Pair it with `CLAUDE.md`
(conventions) and `README.md` (full docs).

## What this is

Realtime burger-ordering web app for a private party (~event date: a Saturday, early June).
- Guests open `/` on phones → pick/type name → build burger → live status.
- Cook opens `/kitchen` on a tablet/laptop → New / Cooking / Ready board, tap to advance.
- Reaches guests on cellular **or** WiFi via the owner's existing reverse proxy.

## What's done (all verified)

- ✅ Server: Express + Socket.io + `node:sqlite`. REST (`/api/health|config|orders`),
  socket events (`order:create|advance|status`, broadcasts `orders:sync|order:new|order:update`),
  server-side validation, SQLite persistence, SPA fallback static serving.
- ✅ Client: React + Vite + TS + Tailwind. Order flow (name → categories → note → submit
  → live status) and kitchen board (3 columns, advance/cancel, elapsed time, connection dot).
- ✅ Docker: multi-stage `Dockerfile` + `docker-compose.yml` (DB volume, `config.json`
  bind-mount), `.dockerignore`.
- ✅ Reverse-proxy snippets in `deploy/` (nginx with WS-upgrade headers; Caddy).
- ✅ Verified locally: `npm run build` clean; REST endpoints; SPA fallback; full socket
  round-trip (create → broadcast → advance new→cooking; invalid order rejected).

Lockfiles (`web/package-lock.json`, `server/package-lock.json`) are committed so
`npm ci` (used by the Docker build) is reproducible.

## ⚠️ The one required step before the party

`server/config.json` currently holds **placeholder** ingredients and friend names.
Replace them with the real menu + guest list. Schema per category:
`{ id, label, emoji?, selection: 'single'|'multi', required?, max?, options:[{id,label}] }`.
The bind-mount means: edit on host → `docker compose restart` (no rebuild).

## Suggested next steps (not yet done — pick per owner's ask)

1. **Real data** — fill `server/config.json` (owner will supply the list).
2. **QR code on the kitchen screen** — render a QR of the public guest URL so people scan it
   (lib suggestion: `qrcode` rendered to a canvas in a small `web/src/ui/` component, or a
   static QR printed separately). No dependency added yet.
3. **`git init`** — repo is NOT yet under version control. `git init && git add -A &&
   git commit -m "Initial burger party app"`.
4. **Order sound/toast on the kitchen board** when a new ticket arrives (Web Audio / a flash).
5. **"Served history" view** (currently served/cancelled orders just leave the board).
6. **Basic guard for `/kitchen`** (e.g. a `?key=` query) so guests don't wander in. Low
   priority for a private party.

## Gotchas

- Node **24+** required on the host for `node:sqlite` (the Docker image pins `node:24-alpine`).
- The server start script passes `--disable-warning=ExperimentalWarning`; keep it.
- Socket.io needs the `Upgrade`/`Connection` headers through the proxy (see
  `deploy/nginx.conf.example`) or it silently downgrades to long-polling.
- `web/` dev server proxies `/api` and `/socket.io` to `:3000` (see `vite.config.ts`); in
  production the server serves the built client same-origin, so the same calls work unchanged.

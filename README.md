# 🍔 Burger Party

A tiny self-hosted web app for a burger night: guests compose their burger from their
phone, and the cook watches orders flow across a live kitchen board on a laptop/tablet.

- **Guests** open `/` on their phone → pick their name → build their burger → watch the
  live status (Nouvelle → En cuisine → Prête).
- **Kitchen** opens `/kitchen` on a tablet/laptop → tickets appear instantly, tap to
  advance them through the columns.

Everything is realtime over a WebSocket (Socket.io, with automatic fallback to HTTP
long-polling and auto-reconnect for flaky cellular). Orders are stored in SQLite so a
refresh or a server restart never loses the queue.

## Stack

| Part     | Tech                                              |
| -------- | ------------------------------------------------- |
| Frontend | React + Vite + TypeScript + Tailwind CSS          |
| Backend  | Node + Express + Socket.io + `node:sqlite`        |
| Deploy   | Single Docker image (server serves the built app) |

No native modules, no external database — `node:sqlite` is built into Node 24.

## Project layout

```
burger-party/
├─ web/                 # React client (order flow + kitchen board)
│  └─ src/
│     ├─ pages/         #   OrderPage (/), KitchenPage (/kitchen)
│     ├─ components/    #   feature components (types.ts + helpers/ per project rules)
│     ├─ ui/            #   Tailwind primitives (Button, Card, OptionChip…)
│     ├─ hooks/         #   useMenu, useKitchenOrders, useConnection…
│     ├─ lib/           #   socket client, selection logic, status/time helpers
│     └─ types.ts       #   shared API contract
├─ server/
│  ├─ src/              #   index (Express+Socket.io), orders, db, config
│  ├─ config.json       #   👈 your menu + friends list (edit this!)
│  └─ data/             #   SQLite file (created at runtime, gitignored)
├─ deploy/              # nginx / Caddy reverse-proxy snippets
├─ Dockerfile           # multi-stage build → one runtime image
└─ docker-compose.yml
```

## ✏️ Set up your party — edit `server/config.json`

Everything guests see comes from this one file:

- `eventName` / `subtitle` — header text.
- `friends` — names shown as quick-pick chips (guests can still type a custom name).
- `categories` — your ingredients. Each category has:
  - `selection`: `"single"` (radio) or `"multi"` (checkboxes)
  - `required`: `true` forces a choice (e.g. the bun, the patty)
  - `max` (multi only): cap the number of picks (e.g. 3 sauces)
  - `options`: `{ "id": "unique-id", "label": "Shown to guests" }`

The shipped file is placeholder data — swap in your real ingredients and names.

## 🚀 Run with Docker (recommended for your Ubuntu box)

```bash
docker compose up -d --build
```

- App is served on **http://SERVER:3000** (guests `/`, kitchen `/kitchen`).
- `./data` holds the SQLite DB (persists across restarts).
- `server/config.json` is mounted read-only — edit it on the host then
  `docker compose restart` to reload the menu (no rebuild needed).

### Behind your existing reverse proxy

Point a hostname at the container and copy the matching snippet from `deploy/`:

- **nginx** — `deploy/nginx.conf.example` (note the `Upgrade`/`Connection` headers — they're
  required for the WebSocket transport).
- **Caddy** — `deploy/Caddyfile.example` (handles HTTPS + WebSockets automatically).

Guests then reach it from cellular or WiFi at `https://burger.example.com`.
Tip: print a QR code of that URL and stick it on the table. 📱

## 🧑‍💻 Local development

Two terminals (frontend proxies API + WebSocket to the backend):

```bash
# terminal 1 — backend on :3000
cd server && npm install && npm run dev

# terminal 2 — frontend on :5173
cd web && npm install && npm run dev
```

Open http://localhost:5173 (order) and http://localhost:5173/kitchen (kitchen board).

To test the production build locally:

```bash
cd web && npm install && npm run build      # outputs web/dist
cd ../server && npm install && WEB_DIR=../web/dist npm start
# then open http://localhost:3000
```

## Realtime API contract

REST:

- `GET /api/config` — menu + friends list
- `GET /api/orders` — active orders (kitchen initial load)
- `GET /api/health` — `{ ok: true }`

Socket.io events:

| Direction       | Event           | Payload                       |
| --------------- | --------------- | ----------------------------- |
| client → server | `order:create`  | `{ name, selections, note }`  |
| client → server | `order:advance` | `{ id }`                      |
| client → server | `order:status`  | `{ id, status }`              |
| server → all    | `orders:sync`   | `Order[]` (on connect)        |
| server → all    | `order:new`     | `Order`                       |
| server → all    | `order:update`  | `Order`                       |

Mutations ack the caller with `{ order }` on success or `{ error }` on a validation failure.

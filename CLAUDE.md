# Burger Party — project guide for Claude Code

Self-hosted realtime web app for a burger night. Guests order from their phone (`/`),
the cook drives a live kitchen board (`/kitchen`). Read `HANDOFF.md` for current status
and next steps, and `README.md` for full run/deploy docs.

## Architecture (keep it this shape)

- **`web/`** — React + Vite + TypeScript + Tailwind CSS v4. Two routes: `OrderPage` (`/`)
  and `KitchenPage` (`/kitchen`) via react-router.
- **`server/`** — Node + Express + Socket.io + **`node:sqlite`** (built into Node 24, no
  native modules). Serves the built client from `WEB_DIR` and exposes the realtime API.
- **Realtime contract** lives in `web/src/types.ts` and is documented in `README.md`.
  Server-authoritative: the server validates, persists, then broadcasts `order:new` /
  `order:update`; clients never mutate local state without a server echo.
- **Persistence**: SQLite file at `DB_PATH` (Docker volume). Orders survive restarts.
- **Config-driven**: the entire menu + friends list comes from `server/config.json`.
  No hardcoded ingredients anywhere in the code.

## Coding conventions (match the existing code)

- TypeScript: `type` aliases only, never `interface`. Domain types in a `types.ts`;
  component `Props` stay in the component file as `type Props = {...}`.
- Components: `const X: FC<Props> = ({ a, b }) => ...` — destructure props in the
  signature. No `props.x`.
- Imports: import hooks/components directly (`import { useState } from 'react'`),
  never `import React from 'react'`, never wildcard `import * as`.
- Styling: Tailwind utility classes only. UI primitives live in `web/src/ui/`.
- Helpers: extract non-trivial logic to a `helpers/` dir next to the component, or to
  `web/src/lib/` for app-wide utilities. Keep functions' cognitive complexity low.
- Numbers: `Number.parseInt` / `Number.parseFloat` / `Number.isNaN`; prefer
  `length !== 0` over `length > 0`.
- Dates: `date-fns` with the `fr` locale (see `web/src/lib/time.ts`).
- Tests (if added): no `describe`; `it('should …')`; use `userEvent`, not `fireEvent`.

## Run / verify

```bash
# local dev (two terminals)
cd server && npm install && npm run dev      # :3000
cd web    && npm install && npm run dev      # :5173 (proxies API+ws to :3000)

# production-style
cd web && npm run build && cd ../server && WEB_DIR=../web/dist npm start

# docker
docker compose up -d --build                 # :3000
```

Server runs with `--disable-warning=ExperimentalWarning` (node:sqlite is experimental).

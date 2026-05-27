import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync } from 'node:fs';
import { config } from './config.js';
import { listOrders, getOrder } from './db.js';
import { createOrder, advanceOrder, setOrderStatus } from './orders.js';

const here = dirname(fileURLToPath(import.meta.url));
const port = Number.parseInt(process.env.PORT ?? '3000', 10);
const webDir = process.env.WEB_DIR ?? join(here, '..', 'public');

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/config', (_req, res) => res.json(config));
app.get('/api/orders', (_req, res) => res.json(listOrders(true)));
app.get('/api/orders/:id', (req, res) => {
  const order = getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(order);
});

// Serve the built React app (and SPA-fallback so /kitchen survives a refresh).
if (existsSync(webDir)) {
  app.use(express.static(webDir));
  app.get('*', (_req, res) => res.sendFile(join(webDir, 'index.html')));
}

const server = createServer(app);
const io = new Server(server, { cors: { origin: true } });

// In-memory set of option IDs marked out-of-stock by the kitchen. Resets on server restart.
const disabledOptions = new Set();

// Broadcast a successful mutation to everyone (kitchen board + ordering phones),
// or send the validation error back to just the caller via the ack callback.
const broadcast = (event, result, ack) => {
  if (result.error) {
    ack?.({ error: result.error });
    return;
  }
  io.emit(event, result.order);
  ack?.({ order: result.order });
};

io.on('connection', (socket) => {
  socket.emit('orders:sync', listOrders(true));
  socket.emit('stock:sync', [...disabledOptions]);

  socket.on('order:create', (payload, ack) => broadcast('order:new', createOrder(payload ?? {}), ack));
  socket.on('order:advance', ({ id } = {}, ack) => broadcast('order:update', advanceOrder(id), ack));
  socket.on('order:status', ({ id, status } = {}, ack) =>
    broadcast('order:update', setOrderStatus(id, status), ack),
  );

  socket.on('stock:toggle', ({ optionId } = {}) => {
    if (typeof optionId !== 'string') return;
    if (disabledOptions.has(optionId)) {
      disabledOptions.delete(optionId);
    } else {
      disabledOptions.add(optionId);
    }
    io.emit('stock:sync', [...disabledOptions]);
  });
});

server.listen(port, () => console.log(`🍔 Burger party server on :${port}`));

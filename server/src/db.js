import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));

// DB_PATH lets Docker mount the SQLite file on a volume so orders survive restarts.
const dbPath = process.env.DB_PATH ?? join(here, '..', 'data', 'orders.sqlite');
mkdirSync(dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    seq        INTEGER PRIMARY KEY AUTOINCREMENT,
    id         TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    items      TEXT NOT NULL,
    note       TEXT,
    status     TEXT NOT NULL DEFAULT 'new',
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
  );
`);

const rowToOrder = (row) => ({
  id: row.id,
  number: row.seq,
  name: row.name,
  items: JSON.parse(row.items),
  note: row.note ?? '',
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const insertStmt = db.prepare(
  `INSERT INTO orders (id, name, items, note, status, created_at, updated_at)
   VALUES (@id, @name, @items, @note, @status, @createdAt, @updatedAt)`,
);
const getStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
const updateStatusStmt = db.prepare(
  'UPDATE orders SET status = @status, updated_at = @updatedAt WHERE id = @id',
);
const listAllStmt = db.prepare('SELECT * FROM orders ORDER BY seq ASC');
const listActiveStmt = db.prepare(
  "SELECT * FROM orders WHERE status NOT IN ('served', 'cancelled') ORDER BY seq ASC",
);

export const insertOrder = ({ id, name, items, note, status, createdAt, updatedAt }) => {
  insertStmt.run({ id, name, items: JSON.stringify(items), note, status, createdAt, updatedAt });
  return rowToOrder(getStmt.get(id));
};

export const getOrder = (id) => {
  const row = getStmt.get(id);
  return row ? rowToOrder(row) : null;
};

export const updateOrderStatus = (id, status, updatedAt) => {
  updateStatusStmt.run({ id, status, updatedAt });
  return getOrder(id);
};

// activeOnly keeps the kitchen board focused on orders that still need work.
export const listOrders = (activeOnly = true) =>
  (activeOnly ? listActiveStmt : listAllStmt).all().map(rowToOrder);

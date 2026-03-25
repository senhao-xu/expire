import { Hono } from "hono";
import { and, asc, desc, eq, like, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { assets, renewalRecords } from "../db/schema.js";

const router = new Hono();

const today = () => new Date().toISOString().slice(0, 10);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function statusFilter(status: string, t: string) {
  switch (status) {
    case "expired":  return sql`${assets.expireDate} < ${t}`;
    case "urgent":   return sql`${assets.expireDate} >= ${t} and ${assets.expireDate} <= date(${t}, '+7 day')`;
    case "upcoming": return sql`${assets.expireDate} >= date(${t}, '+8 day') and ${assets.expireDate} <= date(${t}, '+30 day')`;
    case "normal":   return sql`${assets.expireDate} > date(${t}, '+30 day')`;
    default: return null;
  }
}

// GET /api/v1/assets
router.get("/", async (c) => {
  const search = c.req.query("search")?.trim();
  const type   = c.req.query("type")?.trim();
  const status = c.req.query("status")?.trim();
  const t = today();
  const conditions = [];

  if (search) conditions.push(like(assets.name, `%${search}%`));
  if (type)   conditions.push(eq(assets.type, type));
  if (status) {
    const cond = statusFilter(status, t);
    if (!cond) return c.json({ error: "Invalid status" }, 400);
    conditions.push(cond);
  }

  const where = conditions.length === 0 ? undefined
    : conditions.length === 1 ? conditions[0]
    : and(...conditions);

  const rows = await db.select().from(assets).where(where).orderBy(asc(assets.expireDate));
  return c.json(rows);
});

// POST /api/v1/assets
router.post("/", async (c) => {
  const body = await c.req.json();
  const { name, type, provider, expire_date, price, currency, cycle, cycle_days, notes } = body;

  if (!name || !type || !provider || !expire_date) {
    return c.json({ error: "name, type, provider, expire_date are required" }, 400);
  }
  if (!DATE_RE.test(expire_date)) {
    return c.json({ error: "expire_date must be YYYY-MM-DD" }, 400);
  }

  const now = new Date().toISOString();
  const [created] = await db.insert(assets).values({
    id: nanoid(12),
    name, type, provider,
    expireDate: expire_date,
    price: price ?? null,
    currency: currency ?? "CNY",
    cycle: cycle ?? null,
    cycleDays: cycle_days ?? null,
    notes: notes ?? null,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return c.json(created, 201);
});

// GET /api/v1/assets/:id
router.get("/:id", async (c) => {
  const id = c.req.param("id");
  const [asset] = await db.select().from(assets).where(eq(assets.id, id)).limit(1);
  if (!asset) return c.json({ error: "Not found" }, 404);

  const records = await db.select().from(renewalRecords)
    .where(eq(renewalRecords.assetId, id))
    .orderBy(desc(renewalRecords.renewedAt));

  return c.json({ ...asset, renewalRecords: records });
});

// PUT /api/v1/assets/:id
router.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const { name, type, provider, expire_date, price, currency, cycle, cycle_days, notes } = body;

  const updates: Record<string, unknown> = { updatedAt: new Date().toISOString() };
  if (name !== undefined)       updates.name = name;
  if (type !== undefined)       updates.type = type;
  if (provider !== undefined)   updates.provider = provider;
  if (expire_date !== undefined) {
    if (!DATE_RE.test(expire_date)) return c.json({ error: "expire_date must be YYYY-MM-DD" }, 400);
    updates.expireDate = expire_date;
  }
  if (price !== undefined)      updates.price = price;
  if (currency !== undefined)   updates.currency = currency;
  if (cycle !== undefined)      updates.cycle = cycle;
  if (cycle_days !== undefined) updates.cycleDays = cycle_days;
  if (notes !== undefined)      updates.notes = notes;

  const [updated] = await db.update(assets).set(updates).where(eq(assets.id, id)).returning();
  if (!updated) return c.json({ error: "Not found" }, 404);
  return c.json(updated);
});

// DELETE /api/v1/assets/:id
router.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const [deleted] = await db.delete(assets).where(eq(assets.id, id)).returning();
  if (!deleted) return c.json({ error: "Not found" }, 404);
  return c.json({ success: true });
});

export default router;

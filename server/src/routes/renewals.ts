import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { assets, renewalRecords } from "../db/schema.js";

const router = new Hono();

// POST /api/v1/assets/:id/renew
router.post("/assets/:id/renew", async (c) => {
  const assetId = c.req.param("id");
  const [asset] = await db.select().from(assets).where(eq(assets.id, assetId)).limit(1);
  if (!asset) return c.json({ error: "Asset not found" }, 404);

  const body = await c.req.json();
  const { amount, currency, notes } = body;

  if (typeof amount !== "number" || amount <= 0) {
    return c.json({ error: "amount must be a positive number" }, 400);
  }

  const now = new Date().toISOString();
  const [record] = await db.insert(renewalRecords).values({
    id: nanoid(12),
    assetId,
    amount,
    currency: currency ?? asset.currency,
    notes: notes ?? null,
    renewedAt: now,
    createdAt: now,
  }).returning();

  return c.json(record, 201);
});

export default router;

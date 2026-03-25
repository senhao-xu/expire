import { Hono } from "hono";
import { nanoid } from "nanoid";
import { db } from "../db/index.js";
import { assets, renewalRecords } from "../db/schema.js";

const router = new Hono();

// GET /api/v1/export
router.get("/export", async (c) => {
  const allAssets = await db.select().from(assets);
  const allRecords = await db.select().from(renewalRecords);
  const payload = JSON.stringify({ assets: allAssets, renewalRecords: allRecords }, null, 2);
  const date = new Date().toISOString().slice(0, 10);

  return new Response(payload, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="expire-backup-${date}.json"`,
    },
  });
});

// POST /api/v1/import
router.post("/import", async (c) => {
  const body = await c.req.json();
  if (!body?.assets || !Array.isArray(body.assets)) {
    return c.json({ error: "Invalid format: assets array required" }, 400);
  }

  const now = new Date().toISOString();

  db.transaction((tx) => {
    tx.delete(renewalRecords).run();
    tx.delete(assets).run();

    for (const a of body.assets) {
      tx.insert(assets).values({
        id: a.id ?? nanoid(12),
        name: a.name,
        type: a.type,
        provider: a.provider,
        expireDate: a.expireDate ?? a.expire_date,
        price: a.price ?? null,
        currency: a.currency ?? "CNY",
        cycle: a.cycle ?? null,
        cycleDays: a.cycleDays ?? a.cycle_days ?? null,
        notes: a.notes ?? null,
        createdAt: a.createdAt ?? now,
        updatedAt: a.updatedAt ?? now,
      }).run();
    }

    if (Array.isArray(body.renewalRecords)) {
      for (const r of body.renewalRecords) {
        tx.insert(renewalRecords).values({
          id: r.id ?? nanoid(12),
          assetId: r.assetId ?? r.asset_id,
          amount: r.amount,
          currency: r.currency,
          notes: r.notes ?? null,
          renewedAt: r.renewedAt ?? r.renewed_at ?? now,
          createdAt: r.createdAt ?? now,
        }).run();
      }
    }
  });

  return c.json({ imported: body.assets.length });
});

export default router;

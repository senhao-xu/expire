import { Hono } from "hono";
import { sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { assets } from "../db/schema.js";

const router = new Hono();

// GET /api/v1/stats
router.get("/stats", async (c) => {
  const t = new Date().toISOString().slice(0, 10);

  const [row] = await db.select({
    total:    sql<number>`count(*)`,
    expired:  sql<number>`sum(case when ${assets.expireDate} < ${t} then 1 else 0 end)`,
    urgent:   sql<number>`sum(case when ${assets.expireDate} >= ${t} and ${assets.expireDate} <= date(${t}, '+7 day') then 1 else 0 end)`,
    upcoming: sql<number>`sum(case when ${assets.expireDate} >= date(${t}, '+8 day') and ${assets.expireDate} <= date(${t}, '+30 day') then 1 else 0 end)`,
    normal:   sql<number>`sum(case when ${assets.expireDate} > date(${t}, '+30 day') then 1 else 0 end)`,
  }).from(assets);

  return c.json({
    total:    row.total    ?? 0,
    expired:  row.expired  ?? 0,
    urgent:   row.urgent   ?? 0,
    upcoming: row.upcoming ?? 0,
    normal:   row.normal   ?? 0,
  });
});

export default router;

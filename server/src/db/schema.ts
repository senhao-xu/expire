import { nanoid } from "nanoid";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

const now = () => new Date().toISOString();

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey().$defaultFn(() => nanoid(12)),
  name: text("name").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  expireDate: text("expire_date").notNull(),
  price: real("price"),
  currency: text("currency").notNull().default("CNY"),
  cycle: text("cycle"),
  cycleDays: integer("cycle_days"),
  notes: text("notes"),
  createdAt: text("created_at").notNull().$defaultFn(now),
  updatedAt: text("updated_at").notNull().$defaultFn(now),
});

export const renewalRecords = sqliteTable("renewal_records", {
  id: text("id").primaryKey().$defaultFn(() => nanoid(12)),
  assetId: text("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  currency: text("currency").notNull(),
  notes: text("notes"),
  renewedAt: text("renewed_at").notNull(),
  createdAt: text("created_at").notNull().$defaultFn(now),
});

export type Asset = typeof assets.$inferSelect;
export type NewAsset = typeof assets.$inferInsert;
export type RenewalRecord = typeof renewalRecords.$inferSelect;
export type NewRenewalRecord = typeof renewalRecords.$inferInsert;

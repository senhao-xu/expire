import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema.js";

const serverDir = path.resolve(import.meta.dirname, "..", "..");
const dataDir = path.join(serverDir, "data");
const dbPath = path.join(dataDir, "expire.db");
const migrationsFolder = path.join(serverDir, "drizzle");

mkdirSync(dataDir, { recursive: true });

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder });

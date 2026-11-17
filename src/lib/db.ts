import { DatabaseSync } from "node:sqlite";
import { initDB } from "./schema";
import path from "path";

const dbPath = path.resolve(process.cwd(), "tabibcare.db");

const globalForDb = global as unknown as { db?: DatabaseSync };

export const db: DatabaseSync = globalForDb.db ?? new DatabaseSync(dbPath);

if (!globalForDb.db) {
  initDB(db);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
  }
}

export default db;

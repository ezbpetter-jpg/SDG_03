import Database, { Database as DatabaseType } from "better-sqlite3";
import { initDB } from "./schema";
import path from "path";

const dbPath = path.resolve(process.cwd(), "tabibcare.db");

const globalForDb = global as unknown as { db?: DatabaseType };

export const db: DatabaseType = globalForDb.db ?? new Database(dbPath);

if (!globalForDb.db) {
  initDB(db);
  if (process.env.NODE_ENV !== "production") {
    globalForDb.db = db;
  }
}

export default db;

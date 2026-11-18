import { createClient, type Client } from "@libsql/client";
import path from "path";
import { initDB } from "./schema";

export class DatabaseConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConfigError";
  }
}

const globalForDb = globalThis as unknown as {
  __tabeebcareDb?: Client;
  __tabeebcareDbInit?: Promise<Client>;
};

function createDatabaseClient(): Client {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (tursoUrl) {
    const isRemote =
      tursoUrl.startsWith("libsql://") ||
      tursoUrl.startsWith("https://") ||
      tursoUrl.startsWith("http://");

    if (isRemote && !tursoAuthToken) {
      throw new DatabaseConfigError(
        "Database configuration incomplete: TURSO_AUTH_TOKEN is required when using a remote TURSO_DATABASE_URL."
      );
    }

    return createClient({
      url: tursoUrl,
      authToken: tursoAuthToken || undefined,
    });
  }

  // Never silently use ephemeral /tmp SQLite on Vercel — require Turso for persistent multi-user storage.
  if (process.env.VERCEL) {
    throw new DatabaseConfigError(
      "Persistent database is not configured for this deployment. Set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in Vercel Environment Variables."
    );
  }

  // Local development SQLite file
  const localPath = path.resolve(process.cwd(), "tabibcare.db");
  return createClient({
    url: `file:${localPath}`,
  });
}

export function isPersistentDatabaseConfigured(): boolean {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  if (tursoUrl) {
    const isRemote =
      tursoUrl.startsWith("libsql://") ||
      tursoUrl.startsWith("https://") ||
      tursoUrl.startsWith("http://");
    return isRemote ? Boolean(process.env.TURSO_AUTH_TOKEN?.trim()) : true;
  }
  return !process.env.VERCEL;
}

export async function getDb(): Promise<Client> {
  if (!globalForDb.__tabeebcareDb) {
    globalForDb.__tabeebcareDb = createDatabaseClient();
  }

  if (!globalForDb.__tabeebcareDbInit) {
    const client = globalForDb.__tabeebcareDb;
    globalForDb.__tabeebcareDbInit = initDB(client)
      .then(() => client)
      .catch((err) => {
        globalForDb.__tabeebcareDbInit = undefined;
        throw err;
      });
  }

  return globalForDb.__tabeebcareDbInit;
}

export default getDb;

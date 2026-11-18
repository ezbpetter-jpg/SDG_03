import { createClient, type Client } from "@libsql/client";
import fs from "fs";
import path from "path";
import { initDB } from "./schema";

const globalForDb = globalThis as unknown as {
  __tabeebcareDb?: Client;
  __tabeebcareDbInit?: Promise<Client>;
  __tabeebcareWarnedEphemeral?: boolean;
};

function createDatabaseClient(): Client {
  const tursoUrl = process.env.TURSO_DATABASE_URL?.trim();
  const tursoAuthToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (tursoUrl) {
    return createClient({
      url: tursoUrl,
      authToken: tursoAuthToken || undefined,
    });
  }

  const isVercel = Boolean(process.env.VERCEL);
  if (isVercel) {
    if (!fs.existsSync("/tmp")) {
      fs.mkdirSync("/tmp", { recursive: true });
    }
    if (!globalForDb.__tabeebcareWarnedEphemeral) {
      globalForDb.__tabeebcareWarnedEphemeral = true;
      console.warn(
        "[TabeebCare DB] TURSO_DATABASE_URL is not configured on Vercel. " +
          "Falling back to ephemeral file:/tmp/tabibcare.db. Configure TURSO_DATABASE_URL " +
          "and TURSO_AUTH_TOKEN in Vercel Environment Variables for persistent multi-user accounts."
      );
    }
    return createClient({
      url: "file:/tmp/tabibcare.db",
    });
  }

  const localPath = path.resolve(process.cwd(), "tabibcare.db");
  return createClient({
    url: `file:${localPath}`,
  });
}

export function isPersistentDatabaseConfigured(): boolean {
  return Boolean(process.env.TURSO_DATABASE_URL?.trim()) || !process.env.VERCEL;
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

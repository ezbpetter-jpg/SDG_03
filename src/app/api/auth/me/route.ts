import { NextRequest, NextResponse } from "next/server";
import { getDb, isPersistentDatabaseConfigured } from "@/lib/db";
import {
  clearSessionCookie,
  DEMO_PROFILE,
  DEMO_USER,
  getSessionFromRequest,
  parseJsonArray,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, user: null, profile: null },
        { status: 401 }
      );
    }

    if (session.isDemo || session.sub === DEMO_USER.id) {
      return NextResponse.json({
        authenticated: true,
        user: DEMO_USER,
        profile: DEMO_PROFILE,
      });
    }

    const db = await getDb();
    const result = await db.execute({
      sql: `
        SELECT u.id, u.name, u.email,
               p.age, p.gender, p.conditions, p.allergies, p.current_medications, p.updated_at
        FROM users u
        LEFT JOIN health_profiles p ON u.id = p.user_id
        WHERE u.id = ?
        LIMIT 1
      `,
      args: [session.sub],
    });

    const row = result.rows[0];
    if (!row) {
      // If running on Vercel without Turso yet, allow client-side localStorage hydration to keep working
      if (!isPersistentDatabaseConfigured()) {
        return NextResponse.json({
          authenticated: true,
          user: {
            id: session.sub,
            name: session.name,
            email: session.email,
          },
          profile: null,
          ephemeralFallback: true,
        });
      }

      const response = NextResponse.json(
        { authenticated: false, user: null, profile: null },
        { status: 401 }
      );
      clearSessionCookie(response);
      return response;
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: Number(row.id),
        name: String(row.name),
        email: String(row.email),
      },
      profile: {
        age: row.age !== null && row.age !== undefined ? Number(row.age) : null,
        gender: row.gender ? String(row.gender) : null,
        conditions: parseJsonArray(row.conditions),
        allergies: parseJsonArray(row.allergies),
        current_medications: parseJsonArray(row.current_medications),
        updated_at: row.updated_at ? String(row.updated_at) : null,
      },
    });
  } catch (error) {
    console.error("Auth session check error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Failed to verify session" },
      { status: 500 }
    );
  }
}

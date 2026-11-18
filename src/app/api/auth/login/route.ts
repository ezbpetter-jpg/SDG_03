import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  hashPassword,
  isValidEmail,
  parseJsonArray,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const cleanEmail =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const rawPassword = typeof body?.password === "string" ? body.password : "";

    if (!cleanEmail || !rawPassword) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const result = await db.execute({
      sql: `
        SELECT u.id, u.name, u.email, u.password,
               p.age, p.gender, p.conditions, p.allergies, p.current_medications, p.updated_at
        FROM users u
        LEFT JOIN health_profiles p ON u.id = p.user_id
        WHERE u.email = ?
        LIMIT 1
      `,
      args: [cleanEmail],
    });

    const row = result.rows[0];
    if (!row) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const storedPassword = String(row.password || "");
    const { valid, needsRehash } = verifyPassword(rawPassword, storedPassword);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const userId = Number(row.id);

    // Transparently upgrade any legacy plaintext password to scrypt
    if (needsRehash) {
      try {
        await db.execute({
          sql: "UPDATE users SET password = ? WHERE id = ?",
          args: [hashPassword(rawPassword), userId],
        });
      } catch (rehashErr) {
        console.warn("Non-fatal password rehash failure:", rehashErr);
      }
    }

    const user = {
      id: userId,
      name: String(row.name),
      email: String(row.email),
    };

    const profile = {
      age: row.age !== null && row.age !== undefined ? Number(row.age) : null,
      gender: row.gender ? String(row.gender) : null,
      conditions: parseJsonArray(row.conditions),
      allergies: parseJsonArray(row.allergies),
      current_medications: parseJsonArray(row.current_medications),
      updated_at: row.updated_at ? String(row.updated_at) : null,
    };

    const response = NextResponse.json({
      success: true,
      user,
      profile,
    });

    setSessionCookie(response, user);
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during login." },
      { status: 500 }
    );
  }
}

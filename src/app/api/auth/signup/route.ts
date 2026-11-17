import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      age,
      gender,
      conditions = [],
      allergies = [],
      current_medications = [],
    } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const existing = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in." },
        { status: 400 }
      );
    }

    const insertUser = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    const userResult = insertUser.run(name.trim(), cleanEmail, password);
    const userId = Number(userResult.lastInsertRowid);

    const formatJson = (val: unknown) => {
      if (Array.isArray(val)) return JSON.stringify(val);
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed)) return JSON.stringify(parsed);
        } catch {
          // split comma separated if string
          const list = val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
          return JSON.stringify(list);
        }
      }
      return JSON.stringify([]);
    };

    const insertProfile = db.prepare(`
      INSERT INTO health_profiles (user_id, age, gender, conditions, allergies, current_medications)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    insertProfile.run(
      userId,
      age ? Number(age) : null,
      gender || null,
      formatJson(conditions),
      formatJson(allergies),
      formatJson(current_medications)
    );

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        name: name.trim(),
        email: cleanEmail,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

const parseJsonSafely = (val: unknown): string[] => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    if (userId === "999") {
      return NextResponse.json({
        success: true,
        user: {
          id: 999,
          name: "Ahmad Khan (احمد خان)",
          email: "ahmad.demo@tabeebcare.pk",
          isDemo: true,
        },
        profile: {
          age: 54,
          gender: "Male",
          conditions: ["Type 2 Diabetes", "Hypertension"],
          allergies: ["Sulfa", "Penicillin"],
          current_medications: ["Metformin 500mg", "Amlodipine 5mg"],
        },
      });
    }

    const row = db
      .prepare(`
        SELECT u.id, u.name, u.email,
               p.age, p.gender, p.conditions, p.allergies, p.current_medications, p.updated_at
        FROM users u
        LEFT JOIN health_profiles p ON u.id = p.user_id
        WHERE u.id = ?
      `)
      .get(userId) as Record<string, unknown> | undefined;

    if (!row) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: row.id,
        name: row.name,
        email: row.email,
      },
      profile: {
        age: row.age || null,
        gender: row.gender || null,
        conditions: parseJsonSafely(row.conditions),
        allergies: parseJsonSafely(row.allergies),
        current_medications: parseJsonSafely(row.current_medications),
        updated_at: row.updated_at || null,
      },
    });
  } catch (error) {
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      age,
      gender,
      conditions = [],
      allergies = [],
      current_medications = [],
    } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const conditionsJson = JSON.stringify(conditions);
    const allergiesJson = JSON.stringify(allergies);
    const medsJson = JSON.stringify(current_medications);

    if (String(userId) === "999") {
      return NextResponse.json({
        success: true,
        profile: {
          age: Number(age) || null,
          gender: gender || null,
          conditions,
          allergies,
          current_medications,
        },
      });
    }

    const updateStmt = db.prepare(`
      UPDATE health_profiles
      SET age = ?, gender = ?, conditions = ?, allergies = ?, current_medications = ?, updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `);

    updateStmt.run(
      age ? Number(age) : null,
      gender || null,
      conditionsJson,
      allergiesJson,
      medsJson,
      userId
    );

    return NextResponse.json({
      success: true,
      profile: {
        age: Number(age) || null,
        gender: gender || null,
        conditions,
        allergies,
        current_medications,
      },
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

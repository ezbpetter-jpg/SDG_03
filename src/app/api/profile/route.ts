import { NextRequest, NextResponse } from "next/server";
import { getDb, isPersistentDatabaseConfigured } from "@/lib/db";
import {
  DEMO_PROFILE,
  DEMO_USER,
  getSessionFromRequest,
  parseJsonArray,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");

    if (!session) {
      if (requestedUserId === String(DEMO_USER.id)) {
        return NextResponse.json({
          success: true,
          user: DEMO_USER,
          profile: DEMO_PROFILE,
        });
      }
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (session.isDemo || session.sub === DEMO_USER.id) {
      return NextResponse.json({
        success: true,
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
    console.error("Profile GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in again." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      age,
      gender,
      conditions = [],
      allergies = [],
      current_medications = [],
    } = body ?? {};

    let parsedAge: number | null = null;
    if (age !== undefined && age !== null && String(age).trim() !== "") {
      const numAge = Number(age);
      if (!Number.isInteger(numAge) || numAge < 1 || numAge > 120) {
        return NextResponse.json(
          { error: "Age must be a whole number between 1 and 120." },
          { status: 400 }
        );
      }
      parsedAge = numAge;
    }

    const cleanGender =
      typeof gender === "string" && ["Male", "Female", "Other"].includes(gender)
        ? gender
        : null;

    const conditionsList = parseJsonArray(conditions);
    const allergiesList = parseJsonArray(allergies);
    const medsList = parseJsonArray(current_medications);

    const updatedProfile = {
      age: parsedAge,
      gender: cleanGender,
      conditions: conditionsList,
      allergies: allergiesList,
      current_medications: medsList,
      updated_at: new Date().toISOString(),
    };

    if (session.isDemo || session.sub === DEMO_USER.id) {
      return NextResponse.json({
        success: true,
        profile: updatedProfile,
      });
    }

    const db = await getDb();

    // Ensure user exists in current DB before upserting profile
    const userExists = await db.execute({
      sql: "SELECT id FROM users WHERE id = ? LIMIT 1",
      args: [session.sub],
    });

    if (userExists.rows.length === 0) {
      if (!isPersistentDatabaseConfigured()) {
        return NextResponse.json({
          success: true,
          profile: updatedProfile,
          ephemeralFallback: true,
        });
      }
      return NextResponse.json(
        { error: "User account not found. Please sign in again." },
        { status: 404 }
      );
    }

    await db.execute({
      sql: `
        INSERT INTO health_profiles (user_id, age, gender, conditions, allergies, current_medications, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id) DO UPDATE SET
          age = excluded.age,
          gender = excluded.gender,
          conditions = excluded.conditions,
          allergies = excluded.allergies,
          current_medications = excluded.current_medications,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        session.sub,
        parsedAge,
        cleanGender,
        JSON.stringify(conditionsList),
        JSON.stringify(allergiesList),
        JSON.stringify(medsList),
      ],
    });

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Profile PUT error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

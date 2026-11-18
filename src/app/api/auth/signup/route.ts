import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  hashPassword,
  isValidEmail,
  parseJsonArray,
  setSessionCookie,
} from "@/lib/auth";

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
    } = body ?? {};

    const cleanName = typeof name === "string" ? name.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
    const rawPassword = typeof password === "string" ? password : "";

    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { error: "Please enter your full name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!cleanEmail || !isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (cleanEmail === "ahmad.demo@tabeebcare.pk") {
      return NextResponse.json(
        { error: "This email is reserved for the demo account. Please use your own email or click Quick Demo Login." },
        { status: 400 }
      );
    }

    if (rawPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

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
    const medicationsList = parseJsonArray(current_medications);

    const db = await getDb();

    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [cleanEmail],
    });

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(rawPassword);

    const userResult = await db.execute({
      sql: "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      args: [cleanName, cleanEmail, passwordHash],
    });

    const userId = Number(userResult.lastInsertRowid);

    await db.execute({
      sql: `
        INSERT INTO health_profiles (user_id, age, gender, conditions, allergies, current_medications)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
          age = excluded.age,
          gender = excluded.gender,
          conditions = excluded.conditions,
          allergies = excluded.allergies,
          current_medications = excluded.current_medications,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        userId,
        parsedAge,
        cleanGender,
        JSON.stringify(conditionsList),
        JSON.stringify(allergiesList),
        JSON.stringify(medicationsList),
      ],
    });

    const user = {
      id: userId,
      name: cleanName,
      email: cleanEmail,
    };

    const profile = {
      age: parsedAge,
      gender: cleanGender,
      conditions: conditionsList,
      allergies: allergiesList,
      current_medications: medicationsList,
    };

    const response = NextResponse.json(
      {
        success: true,
        user,
        profile,
      },
      { status: 201 }
    );

    setSessionCookie(response, user);
    return response;
  } catch (error: unknown) {
    console.error("Signup error:", error);
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE") || message.includes("SQLITE_CONSTRAINT")) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}

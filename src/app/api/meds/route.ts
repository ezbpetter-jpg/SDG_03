import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { MEDS_SYSTEM_PROMPT } from "@/lib/prompts/meds_prompt";
import { getDb } from "@/lib/db";
import {
  DEMO_PROFILE,
  DEMO_USER,
  getSessionFromRequest,
  parseJsonArray,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medications, userId, profile: clientProfile = null } = body ?? {};

    if (!medications || typeof medications !== "string" || !medications.trim()) {
      return NextResponse.json(
        { error: "Please provide one or more medication names" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "AI service is not configured (missing GROQ_API_KEY)." },
        { status: 503 }
      );
    }

    const session = getSessionFromRequest(req);
    const isDemoUser =
      Boolean(session?.isDemo) ||
      session?.sub === DEMO_USER.id ||
      (!session && String(userId) === String(DEMO_USER.id));
    const effectiveUserId = session?.sub ?? null;

    // Retrieve user allergies and conditions for cross-checking
    let userContextString = "No specific patient profile provided.";
    let activeUserId: number | null = null;

    if (isDemoUser) {
      const conditions = parseJsonArray(
        clientProfile?.conditions ?? DEMO_PROFILE.conditions
      );
      const allergies = parseJsonArray(
        clientProfile?.allergies ?? DEMO_PROFILE.allergies
      );
      const currentMeds = parseJsonArray(
        clientProfile?.current_medications ?? DEMO_PROFILE.current_medications
      );
      userContextString = `Patient: ${DEMO_USER.name} (Age ${clientProfile?.age ?? DEMO_PROFILE.age}, ${clientProfile?.gender ?? DEMO_PROFILE.gender}).
Known Chronic Conditions: ${conditions.join(", ") || "None"}.
Recorded Allergies: ${allergies.join(", ") || "None"}.
Current Medications: ${currentMeds.join(", ") || "None"}.`;
    } else if (effectiveUserId) {
      let loadedFromDb = false;
      try {
        const db = await getDb();
        const result = await db.execute({
          sql: `
            SELECT u.name, p.age, p.gender, p.conditions, p.allergies, p.current_medications
            FROM users u
            LEFT JOIN health_profiles p ON u.id = p.user_id
            WHERE u.id = ?
            LIMIT 1
          `,
          args: [effectiveUserId],
        });

        const row = result.rows[0];
        if (row) {
          loadedFromDb = true;
          activeUserId = effectiveUserId;
          const conditions = parseJsonArray(row.conditions);
          const allergies = parseJsonArray(row.allergies);
          const currentMeds = parseJsonArray(row.current_medications);
          userContextString = `Patient: ${row.name || session?.name || "Patient"}.
Age: ${row.age || "Unknown"}.
Gender: ${row.gender || "Unknown"}.
Known Chronic Conditions: ${conditions.join(", ") || "None"}.
Recorded Allergies: ${allergies.join(", ") || "None"}.
Current Medications: ${currentMeds.join(", ") || "None"}.`;
        }
      } catch (err) {
        console.error("Failed to fetch user profile for meds:", err);
      }

      if (!loadedFromDb && clientProfile) {
        const conditions = parseJsonArray(clientProfile.conditions);
        const allergies = parseJsonArray(clientProfile.allergies);
        const currentMeds = parseJsonArray(clientProfile.current_medications);
        userContextString = `Patient: ${session?.name || "Patient"}.
Age: ${clientProfile.age || "Unknown"}.
Gender: ${clientProfile.gender || "Unknown"}.
Known Chronic Conditions: ${conditions.join(", ") || "None"}.
Recorded Allergies: ${allergies.join(", ") || "None"}.
Current Medications: ${currentMeds.join(", ") || "None"}.`;
      }
    }

    const userPrompt = `Patient Profile Information:
${userContextString}

Prescription / Medication Names to Analyze:
"${medications.trim()}"

Analyze these medications, create a daily morning/afternoon/evening/night dosage schedule, explain their purpose in plain English and Urdu, detail critical food/drink precautions, and flag any conflicts with the patient's recorded allergies or existing conditions.`;

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: MEDS_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 1200,
    });

    const rawResponse = completion.choices[0]?.message?.content || "{}";
    let parsedResult;
    try {
      parsedResult = JSON.parse(rawResponse);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse structured medication data" },
        { status: 500 }
      );
    }

    // Save medication check to database if persistent authenticated user
    if (activeUserId) {
      try {
        const db = await getDb();
        await db.execute({
          sql: `
            INSERT INTO medication_checks (user_id, medications_input, schedule_result)
            VALUES (?, ?, ?)
          `,
          args: [activeUserId, medications.trim(), rawResponse],
        });
      } catch (err) {
        console.error("Failed to save medication_check history:", err);
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
    });
  } catch (error: unknown) {
    console.error("Meds API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process medications";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

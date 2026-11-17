import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { MEDS_SYSTEM_PROMPT } from "@/lib/prompts/meds_prompt";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medications, userId } = body;

    if (!medications || typeof medications !== "string" || !medications.trim()) {
      return NextResponse.json(
        { error: "Please provide one or more medication names" },
        { status: 400 }
      );
    }

    // Retrieve user allergies and conditions for cross-checking
    let userContextString = "No specific patient profile provided.";
    let activeUserId: number | null = null;

    if (userId) {
      if (String(userId) === "999") {
        userContextString = `Patient: Ahmad Khan (Age 54, Male).
Known Chronic Conditions: Type 2 Diabetes, Hypertension.
Recorded Allergies: Sulfa, Penicillin.
Current Medications: Metformin 500mg, Amlodipine 5mg.`;
      } else {
        const row = db
          .prepare(`
            SELECT u.name, p.age, p.gender, p.conditions, p.allergies, p.current_medications
            FROM users u
            LEFT JOIN health_profiles p ON u.id = p.user_id
            WHERE u.id = ?
          `)
          .get(userId) as Record<string, unknown> | undefined;

        if (row) {
          activeUserId = Number(userId);
          userContextString = `Patient: ${row.name || "Patient"}.
Age: ${row.age || "Unknown"}.
Known Chronic Conditions: ${row.conditions || "None"}.
Recorded Allergies: ${row.allergies || "None"}.
Current Medications: ${row.current_medications || "None"}.`;
        }
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

    // Save medication check to SQLite if persistent user
    if (activeUserId) {
      try {
        db.prepare(`
          INSERT INTO medication_checks (user_id, medications_input, schedule_result)
          VALUES (?, ?, ?)
        `).run(activeUserId, medications.trim(), rawResponse);
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
    const errorMessage = error instanceof Error ? error.message : "Failed to process medications";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

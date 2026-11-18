import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { buildSystemPrompt, PatientProfileContext } from "@/lib/memory/context_builder";
import { retrieveDetailedContext } from "@/lib/rag/retriever";
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
    const {
      messages,
      userId,
      profile: clientProfile = null,
      saveSession = false,
      triageLevel = null,
    } = body ?? {};

    const session = getSessionFromRequest(req);
    const isDemoUser =
      Boolean(session?.isDemo) ||
      session?.sub === DEMO_USER.id ||
      (!session && String(userId) === String(DEMO_USER.id));
    const effectiveUserId = session?.sub ?? null;

    // Handle session saving request for authenticated non-demo users
    if (saveSession && messages && Array.isArray(messages)) {
      if (effectiveUserId && !isDemoUser) {
        try {
          const db = await getDb();
          const lastAssistant = [...messages]
            .reverse()
            .find((m) => m.role === "assistant");
          const summary =
            lastAssistant?.content?.slice(0, 150) || "Triage consultation";
          await db.execute({
            sql: `
              INSERT INTO triage_sessions (user_id, messages, triage_level, summary)
              VALUES (?, ?, ?, ?)
            `,
            args: [effectiveUserId, JSON.stringify(messages), triageLevel, summary],
          });
        } catch (err) {
          console.error("Failed to save triage session:", err);
        }
      }
      return NextResponse.json({ success: true, saved: true });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Conversation messages array is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY?.trim()) {
      return NextResponse.json(
        { error: "AI service is not configured (missing GROQ_API_KEY)." },
        { status: 503 }
      );
    }

    // Find last user message for RAG retrieval
    const lastUserMsg =
      [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // Retrieve patient profile for long-term memory
    let profile: PatientProfileContext | null = null;
    if (isDemoUser) {
      profile = {
        name: DEMO_USER.name,
        age: clientProfile?.age ?? DEMO_PROFILE.age,
        gender: clientProfile?.gender ?? DEMO_PROFILE.gender,
        conditions: clientProfile?.conditions ?? DEMO_PROFILE.conditions,
        allergies: clientProfile?.allergies ?? DEMO_PROFILE.allergies,
        current_medications:
          clientProfile?.current_medications ?? DEMO_PROFILE.current_medications,
      };
    } else if (effectiveUserId) {
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
          profile = {
            name: String(row.name || session?.name || "Patient"),
            age: row.age !== null && row.age !== undefined ? Number(row.age) : null,
            gender: row.gender ? String(row.gender) : null,
            conditions: parseJsonArray(row.conditions),
            allergies: parseJsonArray(row.allergies),
            current_medications: parseJsonArray(row.current_medications),
          };
        }
      } catch (err) {
        console.error("Failed to fetch user profile for triage:", err);
      }

      // Fallback to client-provided profile if serverless container missed ephemeral DB
      if (!profile && clientProfile) {
        profile = {
          name: session?.name || "Patient",
          age: clientProfile.age ?? null,
          gender: clientProfile.gender ?? null,
          conditions: parseJsonArray(clientProfile.conditions),
          allergies: parseJsonArray(clientProfile.allergies),
          current_medications: parseJsonArray(clientProfile.current_medications),
        };
      }
    }

    // Retrieve real RAG context & protocol metadata
    const ragResult = retrieveDetailedContext(lastUserMsg);
    const normalizedUserMsg = lastUserMsg.toLowerCase();

    // Extract exact matched keywords from the matched protocols
    const matchedKeywords: string[] = [];
    for (const protocol of ragResult.matchedProtocols) {
      for (const keyword of protocol.keywords) {
        if (
          normalizedUserMsg.includes(keyword.toLowerCase()) &&
          !matchedKeywords.includes(keyword)
        ) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // First SSE Event: Retrieval Metadata
    const retrievalMetadata = {
      type: "meta",
      protocols: ragResult.matchedProtocols.map((p) => ({
        id: p.id,
        title: p.title,
      })),
      matchedKeywords,
      severity: ragResult.highestSeverity || "routine",
      profileUsed: {
        conditions: profile ? parseJsonArray(profile.conditions) : [],
        allergies: profile ? parseJsonArray(profile.allergies) : [],
      },
    };

    // Assemble system prompt with RAG context and safety rules
    const { systemPrompt } = buildSystemPrompt(profile, lastUserMsg);

    // Sanitize and filter out any empty messages to prevent API errors
    const sanitizedMessages = messages
      .filter(
        (m: { role?: string; content?: string }) =>
          m && typeof m.content === "string" && m.content.trim().length > 0
      )
      .map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content.trim(),
      }));

    if (sanitizedMessages.length === 0) {
      sanitizedMessages.push({
        role: "user",
        content: lastUserMsg || "Hello",
      });
    }

    // Call Groq API with streaming
    const groqStream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        ...sanitizedMessages,
      ],
      stream: true,
      max_tokens: 800,
      temperature: 0.3,
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          // Send retrieval metadata as the FIRST SSE event before any tokens
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(retrievalMetadata)}\n\n`)
          );

          for await (const chunk of groqStream) {
            const text = chunk.choices[0]?.delta?.content || "";
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Groq stream iteration error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: unknown) {
    console.error("Triage API error:", error);
    const msg =
      error instanceof Error
        ? error.message
        : "Failed to process triage consultation";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

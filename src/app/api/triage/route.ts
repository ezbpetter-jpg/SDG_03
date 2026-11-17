import { NextRequest, NextResponse } from "next/server";
import groq, { GROQ_MODEL } from "@/lib/groq";
import { buildSystemPrompt, PatientProfileContext } from "@/lib/memory/context_builder";
import { retrieveDetailedContext } from "@/lib/rag/retriever";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, userId, saveSession = false, triageLevel = null } = body;

    // Handle session saving request
    if (saveSession && userId && messages && Array.isArray(messages)) {
      if (String(userId) !== "999") {
        try {
          const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
          const summary = lastAssistant?.content?.slice(0, 150) || "Triage consultation";
          db.prepare(`
            INSERT INTO triage_sessions (user_id, messages, triage_level, summary)
            VALUES (?, ?, ?, ?)
          `).run(Number(userId), JSON.stringify(messages), triageLevel, summary);
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

    // Find last user message for RAG retrieval
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // Retrieve patient profile for long-term memory
    let profile: PatientProfileContext | null = null;
    if (userId) {
      if (String(userId) === "999") {
        profile = {
          name: "Ahmad Khan (احمد خان)",
          age: 54,
          gender: "Male",
          conditions: ["Type 2 Diabetes", "Hypertension"],
          allergies: ["Sulfa", "Penicillin"],
          current_medications: ["Metformin 500mg", "Amlodipine 5mg"],
        };
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
          profile = {
            name: String(row.name || "Patient"),
            age: row.age ? Number(row.age) : null,
            gender: row.gender ? String(row.gender) : null,
            conditions: row.conditions as string,
            allergies: row.allergies as string,
            current_medications: row.current_medications as string,
          };
        }
      }
    }

    // Retrieve real RAG context & protocol metadata
    const ragResult = retrieveDetailedContext(lastUserMsg);
    const normalizedUserMsg = lastUserMsg.toLowerCase();

    // Extract exact matched keywords from the matched protocols
    const matchedKeywords: string[] = [];
    for (const protocol of ragResult.matchedProtocols) {
      for (const keyword of protocol.keywords) {
        if (normalizedUserMsg.includes(keyword.toLowerCase()) && !matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

    const parseList = (item: string[] | string | undefined | null): string[] => {
      if (!item) return [];
      if (Array.isArray(item)) return item;
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) return parsed;
      } catch {}
      return String(item)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    };

    // First SSE Event: Retrieval Metadata (All values from real retriever & context_builder)
    const retrievalMetadata = {
      type: "meta",
      protocols: ragResult.matchedProtocols.map((p) => ({
        id: p.id,
        title: p.title,
      })),
      matchedKeywords,
      severity: ragResult.highestSeverity || "routine",
      profileUsed: {
        conditions: profile ? parseList(profile.conditions) : [],
        allergies: profile ? parseList(profile.allergies) : [],
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
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(retrievalMetadata)}\n\n`));

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
    const msg = error instanceof Error ? error.message : "Failed to process triage consultation";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

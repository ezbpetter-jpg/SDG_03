import { TRIAGE_BASE_SYSTEM_PROMPT } from "../prompts/triage_prompt";
import { retrieveDetailedContext } from "../rag/retriever";

export interface PatientProfileContext {
  name?: string;
  age?: number | null;
  gender?: string | null;
  conditions?: string[] | string;
  allergies?: string[] | string;
  current_medications?: string[] | string;
}

export function buildSystemPrompt(
  profile?: PatientProfileContext | null,
  userLastMessage?: string
): {
  systemPrompt: string;
  ragContext: string;
  highestSeverity?: "emergency" | "urgent" | "routine" | "home";
} {
  const parts: string[] = [];

  // 1. Role definition
  parts.push(TRIAGE_BASE_SYSTEM_PROMPT);

  // 2. Patient Profile (Long-Term Memory)
  if (profile) {
    const parseList = (item: string[] | string | undefined | null): string => {
      if (!item) return "None recorded";
      if (Array.isArray(item)) return item.length > 0 ? item.join(", ") : "None recorded";
      try {
        const parsed = JSON.parse(item);
        if (Array.isArray(parsed)) return parsed.length > 0 ? parsed.join(", ") : "None recorded";
      } catch {
        // Raw string
      }
      return String(item) || "None recorded";
    };

    const profileText = `[PATIENT PROFILE - LONG-TERM HEALTH MEMORY]
Name: ${profile.name || "Patient"}
Age: ${profile.age ? `${profile.age} years old` : "Not specified"}
Gender: ${profile.gender || "Not specified"}
Chronic Medical Conditions: ${parseList(profile.conditions)}
Known Drug / Food Allergies: ${parseList(profile.allergies)}
Current Active Prescriptions: ${parseList(profile.current_medications)}
Instruction: Incorporate this patient profile into your reasoning. Check for dangerous interactions with existing conditions (e.g. hypertension, diabetes) and flag any known allergies immediately.`;

    parts.push(profileText);
  }

  // 3. Clinical Protocol Context from RAG
  let ragContext = "";
  let highestSeverity: "emergency" | "urgent" | "routine" | "home" | undefined = undefined;

  if (userLastMessage) {
    const ragResult = retrieveDetailedContext(userLastMessage);
    if (ragResult.contextText) {
      ragContext = ragResult.contextText;
      highestSeverity = ragResult.highestSeverity;

      parts.push(`[CLINICAL PROTOCOL CONTEXT - EVIDENCE-BASED RAG GUIDELINES]
Use the following clinical triaging protocol to guide your urgency evaluation:
${ragResult.contextText}`);
    }
  }

  // 4. Strict Safety Enforcement
  parts.push(`[SAFETY RULES - NON-NEGOTIABLE]
- Never override emergency safety: If symptoms match emergency red flags, ALWAYS designate TRIAGE_LEVEL: emergency and instruct immediate 1122 contact.
- Do not make unsupported diagnostic claims. Present recommendations as educational triage.
- Maintain a calm, empathetic, and culturally supportive tone at all times.`);

  return {
    systemPrompt: parts.join("\n\n"),
    ragContext,
    highestSeverity,
  };
}

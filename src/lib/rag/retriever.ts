import { CLINICAL_PROTOCOLS, ClinicalProtocol } from "./clinical_protocols";

export interface RetrievedContextResult {
  contextText: string;
  matchedProtocols: ClinicalProtocol[];
  highestSeverity?: "emergency" | "urgent" | "routine" | "home";
}

export function retrieveContext(userMessage: string): string {
  const result = retrieveDetailedContext(userMessage);
  return result.contextText;
}

export function retrieveDetailedContext(userMessage: string): RetrievedContextResult {
  if (!userMessage || typeof userMessage !== "string") {
    return { contextText: "", matchedProtocols: [] };
  }

  const normalized = userMessage.toLowerCase();

  const scored = CLINICAL_PROTOCOLS.map((protocol) => {
    let score = 0;
    for (const keyword of protocol.keywords) {
      const lowerKeyword = keyword.toLowerCase();
      if (normalized.includes(lowerKeyword)) {
        score += lowerKeyword.includes(" ") ? 2 : 1; // Give extra weight to multi-word phrases
      }
    }
    return { protocol, score };
  });

  const matched = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => item.protocol);

  if (matched.length === 0) {
    return { contextText: "", matchedProtocols: [] };
  }

  const severityOrder: Record<string, number> = {
    emergency: 4,
    urgent: 3,
    routine: 2,
    home: 1,
  };

  let highestSeverity: "emergency" | "urgent" | "routine" | "home" = "home";
  for (const m of matched) {
    if (severityOrder[m.severity] > severityOrder[highestSeverity]) {
      highestSeverity = m.severity;
    }
  }

  const contextText = matched
    .map(
      (m, idx) =>
        `[PROTOCOL ${idx + 1}: ${m.title} (Severity: ${m.severity.toUpperCase()})]\n${m.protocol}`
    )
    .join("\n\n");

  return {
    contextText,
    matchedProtocols: matched,
    highestSeverity,
  };
}

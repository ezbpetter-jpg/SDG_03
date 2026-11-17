"use client";

import React from "react";
import { User as UserIcon, Bot } from "lucide-react";
import { TriageBadge, TriageLevel } from "./TriageBadge";
import { MarkdownRenderer } from "../ui/MarkdownRenderer";
import clsx from "clsx";

interface ChatBubbleProps {
  role: "user" | "assistant" | "system";
  content: string;
  lang?: "en" | "ur";
}

export function ChatBubble({ role, content, lang = "en" }: ChatBubbleProps) {
  const isUser = role === "user";
  const isUrdu = lang === "ur";

  // Check if content begins with TRIAGE_LEVEL: ...
  let triageLevel: TriageLevel | null = null;
  let cleanContent = content;

  const match = content.match(/^TRIAGE_LEVEL:\s*(\w+)/i);
  if (match) {
    const rawLevel = match[1].toLowerCase();
    if (["emergency", "urgent", "routine", "home"].includes(rawLevel)) {
      triageLevel = rawLevel as TriageLevel;
      cleanContent = content.replace(/^TRIAGE_LEVEL:\s*\w+\s*/i, "").trim();
    }
  }

  return (
    <div
      className={clsx(
        "flex gap-3 w-full transition-all",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "flex gap-2.5 sm:gap-3 max-w-[92%] sm:max-w-[82%]",
          isUser ? "flex-row-reverse" : "flex-row"
        )}
      >
        {/* Avatar */}
        <div
          className={clsx(
            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-xs",
            isUser
              ? "bg-teal-100 text-teal-800 border border-teal-200"
              : "bg-teal-600 text-white shadow-teal-700/20"
          )}
        >
          {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>

        {/* Bubble */}
        <div className="flex flex-col space-y-1.5 flex-1 min-w-0">
          {triageLevel && !isUser && (
            <div className="mb-1">
              <TriageBadge level={triageLevel} lang={lang} />
            </div>
          )}

          <div
            className={clsx(
              "p-4 rounded-2xl text-sm leading-relaxed shadow-xs transition-colors",
              isUser
                ? "bg-teal-600 text-white rounded-tr-xs"
                : "bg-white text-slate-800 border border-slate-200 rounded-tl-xs"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap break-words">{cleanContent}</p>
            ) : (
              <MarkdownRenderer content={cleanContent} isUrdu={isUrdu} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { ChatBubble } from "@/components/triage/ChatBubble";
import { EmergencyBanner } from "@/components/triage/EmergencyBanner";
import { SbarCard } from "@/components/triage/SbarCard";
import { MedicalDisclaimerModal } from "@/components/layout/MedicalDisclaimer";
import { Button } from "@/components/ui/Button";
import { MessageSquareHeart, Send, Sparkles, FileText, RotateCcw, AlertOctagon } from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function TriagePage() {
  const router = useRouter();
  const { user, profile, isLoading: isUserLoading, lang } = useUser();

  const isUrdu = lang === "ur";

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentTriageLevel, setCurrentTriageLevel] = useState<string | null>(null);
  const [isMentalHealth, setIsMentalHealth] = useState(false);
  const [isSbarOpen, setIsSbarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Starter prompt chips
  const starterChips = [
    {
      label: "Tez Bukhar (2 days)",
      value: "Mujhe 2 din se tez bukhar hai aur thand lag rahi hai.",
    },
    {
      label: "Chest Pain & Breathing",
      value: "I have sudden crushing chest pain radiating to left arm and shortness of breath.",
    },
    {
      label: "Pediatric Vomiting",
      value: "Mere bacha ko 2 din se ulti aur dast ho rahe hain aur wo sust hai.",
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isStreaming) return;

    // Check mental health keywords for helpline escalation
    const lower = text.toLowerCase();
    if (
      lower.includes("suicide") ||
      lower.includes("self harm") ||
      lower.includes("khatam karna") ||
      lower.includes("marna chahta")
    ) {
      setIsMentalHealth(true);
    }

    const newMessages: Message[] = [...messages, { role: "user", content: text.trim() }];
    setMessages(newMessages);
    setInputMessage("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          userId: user?.id,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to connect to triage service");
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullAssistantResponse = "";

      // Add placeholder assistant message
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullAssistantResponse += chunk;

        // Extract triage level if detected in the stream
        const levelMatch = fullAssistantResponse.match(/^TRIAGE_LEVEL:\s*(\w+)/i);
        if (levelMatch) {
          const detected = levelMatch[1].toLowerCase();
          setCurrentTriageLevel(detected);
        }

        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;
          if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
            updated[lastIndex] = {
              role: "assistant",
              content: fullAssistantResponse,
            };
          }
          return updated;
        });
      }

      // Auto-save session to SQLite
      if (user?.id) {
        fetch("/api/triage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [...newMessages, { role: "assistant", content: fullAssistantResponse }],
            userId: user.id,
            saveSession: true,
            triageLevel: currentTriageLevel,
          }),
        }).catch((err) => console.error("Session auto-save err:", err));
      }
    } catch (err: unknown) {
      console.error("Triage stream error:", err);
      const errMsg = err instanceof Error ? err.message : "Error streaming triage advice";
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ System Notice: Unable to complete message stream. ${errMsg}. Please consult emergency services 1122 if experiencing critical symptoms.`,
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentTriageLevel(null);
    setIsMentalHealth(false);
  };

  if (isUserLoading || !user) {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading triage...</div>;
  }

  // Derive situation and assessment for SBAR
  const lastUserQuestion = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const lastAssistantAnswer = [...messages].reverse().find((m) => m.role === "assistant")?.content || "";

  return (
    <div className="space-y-4 py-2">
      <MedicalDisclaimerModal featureKey="triage" />

      {/* SBAR Doctor Handover Modal */}
      <SbarCard
        isOpen={isSbarOpen}
        onClose={() => setIsSbarOpen(false)}
        patientName={user.name}
        patientAge={profile?.age}
        patientGender={profile?.gender}
        conditions={profile?.conditions}
        allergies={profile?.allergies}
        medications={profile?.current_medications}
        situation={lastUserQuestion || "Patient entered clinical consultation chat."}
        assessment={lastAssistantAnswer.replace(/^TRIAGE_LEVEL:\s*\w+\s*/i, "").slice(0, 400)}
        triageLevel={currentTriageLevel || "Clinical Evaluation"}
      />

      {/* Emergency Alert Banner (Shown at top when emergency level detected) */}
      {currentTriageLevel === "emergency" && (
        <EmergencyBanner isMentalHealth={isMentalHealth} />
      )}

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <MessageSquareHeart className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
              {isUrdu ? "علامات ٹریآج و ایمرجنسی چیکر" : "Clinical Symptom Triage & Red-Flag Checker"}
            </h1>
            <p className="text-xs text-slate-500">
              {isUrdu
                ? "عالمی ادارہ صحت (WHO) کے پروٹوکولز کے ساتھ فوری رہنمائی"
                : "Multilingual WHO & Emergency Severity Index (ESI) protocol-guided intake"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSbarOpen(true)}
                className="text-sky-700 bg-sky-50/60 border-sky-200 hover:bg-sky-100"
              >
                <FileText className="w-3.5 h-3.5 mr-1" />
                {isUrdu ? "ڈاکٹر کارڈ (SBAR)" : "Doctor Card"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleReset} title="Reset Chat">
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Starter Prompt Chips (Shown when no messages yet) */}
      {messages.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Click to test sample clinical scenarios:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {starterChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.value)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50 transition-all text-xs space-y-1 shadow-2xs group"
              >
                <strong className="block text-slate-800 font-semibold group-hover:text-teal-700">
                  {chip.label}
                </strong>
                <p className="text-slate-500 text-[11px] line-clamp-2">
                  &ldquo;{chip.value}&rdquo;
                </p>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            💡 Or type freely in Urdu (اردو), Roman Urdu (&ldquo;Mujhe dard ho raha hai&rdquo;), or English below.
          </p>
        </div>
      )}

      {/* Chat Messages Box */}
      <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-4 sm:p-5 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble
            key={index}
            role={msg.role}
            content={msg.content}
            lang={lang}
          />
        ))}

        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pl-11">
            <div className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
            <span>TabeebCare AI is reviewing clinical protocols...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex gap-2">
        <textarea
          rows={2}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder={
            isUrdu
              ? "اپنی علامات یہاں لکھیں (اردو، رومن اردو یا انگریزی)..."
              : "Describe your symptoms (e.g. fever duration, pain location, onset)..."
          }
          className="flex-1 rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 resize-none bg-white shadow-xs"
        />
        <Button
          onClick={() => handleSendMessage()}
          isLoading={isStreaming}
          disabled={!inputMessage.trim() || isStreaming}
          variant="primary"
          className="px-5 shrink-0 self-end h-[52px]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

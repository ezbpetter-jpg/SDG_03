"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { ChatBubble } from "@/components/triage/ChatBubble";
import { EmergencyBanner } from "@/components/triage/EmergencyBanner";
import { SbarCard } from "@/components/triage/SbarCard";
import { MedicalDisclaimerModal } from "@/components/layout/MedicalDisclaimer";
import { Button } from "@/components/ui/Button";
import {
  MessageSquareHeart,
  Send,
  Sparkles,
  FileText,
  RotateCcw,
  AlertOctagon,
  Bot,
  Activity,
} from "lucide-react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function TriagePage() {
  const router = useRouter();
  const { user, profile, isLoading: isUserLoading, lang, t } = useUser();
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

  // Hackathon starter scenario prompt chips
  const starterChips = [
    {
      label: isUrdu ? "تیز بخار اور سردی" : "Tez Bukhar (2 days)",
      value: "Mujhe 2 din se tez bukhar hai aur thand lag rahi hai.",
    },
    {
      label: isUrdu ? "سینے میں شدید درد" : "Chest Pain & Breathing (Emergency)",
      value: "I have sudden crushing chest pain radiating to left arm and shortness of breath.",
      isEmergency: true,
    },
    {
      label: isUrdu ? "بچے کو الٹی اور دست" : "Pediatric Vomiting & Diarrhea",
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
      const decoder = new TextDecoder();
      let assistantResponse = "";

      // Add placeholder assistant message
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      let done = false;
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          assistantResponse += chunk;

          // Detect TRIAGE_LEVEL: emergency from stream
          const match = assistantResponse.match(/TRIAGE_LEVEL:\s*(\w+)/i);
          if (match) {
            const lvl = match[1].toLowerCase();
            setCurrentTriageLevel(lvl);
          }

          setMessages([...newMessages, { role: "assistant", content: assistantResponse }]);
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isUrdu
            ? "⚠️ نیٹ ورک میں رکاوٹ آئی ہے۔ اگر یہ ہنگامی صورتحال ہے تو براہ کرم فوری طور پر 1122 پر کال کریں۔"
            : "⚠️ Network connectivity issue. If this is an emergency, please dial 1122 immediately.",
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
    setInputMessage("");
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>{isUrdu ? "ٹریآج سروس لوڈ ہو رہی ہے..." : "Loading triage session..."}</span>
        </div>
      </div>
    );
  }

  const isEmergency = currentTriageLevel === "emergency";

  return (
    <div className="space-y-6 py-2 max-w-5xl mx-auto">
      <MedicalDisclaimerModal featureKey="triage" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {t("triage_title")}
              </h1>
              <span className="text-xs text-teal-700 font-semibold">
                WHO Clinical Protocol Context • RAG Evaluator
              </span>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            {t("triage_subtitle")}
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {messages.length > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSbarOpen(true)}
                className="gap-1.5 text-xs font-semibold shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? "ڈاکٹر کارڈ (SBAR)" : "SBAR Summary"}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1 text-xs text-slate-500 hover:text-slate-800"
                title={t("triage_btn_reset")}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t("triage_btn_reset")}</span>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Emergency Alert Banner (Critical Escalation) */}
      {isEmergency && (
        <div className="animate-in fade-in slide-in-from-top-3 duration-300">
          <EmergencyBanner isMentalHealth={isMentalHealth} />
        </div>
      )}

      {/* Chat Container Box */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[65vh] min-h-[480px] max-h-[750px] overflow-hidden">
        {/* Messages Stream Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-4 max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs">
                <Bot className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-slate-800">
                  {isUrdu ? "طبیب کیئر سے اپنی علامات شیئر کریں" : "Describe Your Symptoms"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {isUrdu
                    ? "اردو، انگریزی یا رومن اردو میں اپنی علامات بتائیں۔ سسٹم ڈبلیو ایچ او پروٹوکول کے مطابق خطرے کا فوری تعین کرے گا۔"
                    : "Type in Urdu, English, or Roman Urdu. The AI cross-references WHO triage protocols with your health profile to assess urgency."}
                </p>
              </div>

              {/* Starter Chips */}
              <div className="w-full space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  {t("triage_starter_label")}
                </span>
                <div className="flex flex-col gap-2">
                  {starterChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip.value)}
                      className="text-left p-3 rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-xs text-slate-700 hover:text-teal-900 transition-all shadow-2xs flex items-center justify-between group active:scale-98"
                    >
                      <span className="font-semibold">{chip.label}</span>
                      <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => (
                <ChatBubble key={i} role={msg.role} content={msg.content} lang={lang} />
              ))}

              {isStreaming && (
                <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold p-2">
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
                  <span>{isUrdu ? "طبیب کیئر تجزیہ کر رہا ہے..." : "TabeebCare is analyzing symptoms..."}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isStreaming}
              placeholder={t("triage_input_placeholder")}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isStreaming}
              isLoading={isStreaming}
              className="px-4 sm:px-6 py-3 font-bold gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t("triage_btn_send")}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* SBAR Card Modal */}
      <SbarCard
        isOpen={isSbarOpen}
        onClose={() => setIsSbarOpen(false)}
        patientName={user.name}
        patientAge={profile?.age}
        patientGender={profile?.gender}
        conditions={profile?.conditions}
        allergies={profile?.allergies}
        medications={profile?.current_medications}
        situation={messages.find((m) => m.role === "user")?.content || "Acute patient symptom report"}
        assessment={messages.filter((m) => m.role === "assistant").pop()?.content || "Triage evaluation"}
        triageLevel={currentTriageLevel || "Clinical Evaluation"}
      />
    </div>
  );
}

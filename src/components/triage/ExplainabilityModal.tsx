"use client";

import React from "react";
import { X, ShieldCheck, Tag, AlertTriangle, UserCheck, BookOpen, CheckCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useUser } from "@/context/UserContext";

export interface RetrievalMeta {
  type: "meta";
  protocols: { id: string; title: string }[];
  matchedKeywords: string[];
  severity: "emergency" | "urgent" | "routine" | "home" | string;
  profileUsed: {
    conditions: string[];
    allergies: string[];
  };
}

interface ExplainabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: RetrievalMeta | null;
}

export function ExplainabilityModal({
  isOpen,
  onClose,
  metadata,
}: ExplainabilityModalProps) {
  const { lang } = useUser();
  const isUrdu = lang === "ur";

  if (!isOpen) return null;

  const hasProtocols = metadata && metadata.protocols && metadata.protocols.length > 0;
  const severity = metadata?.severity?.toLowerCase() || "routine";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {isUrdu ? "طبیب کیئر تشخیصی شفافیت (Why this level?)" : "Why This Result? Clinical RAG Explainability"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {isUrdu ? "ڈبلیو ایچ او کلینیکل پروٹوکولز پر مبنی شفاف فیصلہ سازی" : "Transparent grounding in WHO-inspired clinical triage protocols"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          {/* Severity Classification */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {isUrdu ? "تعین کردہ خطرے کی سطح" : "Calculated Severity Level"}
            </span>
            <div className="flex items-center gap-2 pt-0.5">
              <Badge
                variant={
                  severity === "emergency"
                    ? "emergency"
                    : severity === "urgent"
                    ? "warning"
                    : severity === "routine"
                    ? "info"
                    : "safe"
                }
                size="md"
              >
                {severity.toUpperCase()}
              </Badge>
              <span className="text-xs text-slate-500">
                {severity === "emergency"
                  ? isUrdu
                    ? "فوری طبی خطرہ یا ایمرجنسی"
                    : "Immediate life-safety or acute concern"
                  : severity === "urgent"
                  ? isUrdu
                    ? "جلد طبی معائنے کی ضرورت"
                    : "Prompt evaluation required within 24 hours"
                  : isUrdu
                  ? "معمول کا معائنہ یا گھریلو نگہداشت"
                  : "Routine outpatient or home observation"}
              </span>
            </div>
          </div>

          {/* Matched WHO-inspired Clinical Protocol */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? "ڈبلیو ایچ او کلینیکل پروٹوکول" : "WHO-inspired clinical protocol"}</span>
            </h4>

            {hasProtocols ? (
              <div className="space-y-2">
                {metadata.protocols.map((proto, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-teal-50/70 border border-teal-200/80 space-y-1 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-teal-900">
                      <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{proto.title}</span>
                    </div>
                    <p className="text-[11px] text-teal-800 font-mono">
                      Protocol ID: {proto.id} • WHO-inspired clinical protocol
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                {isUrdu
                  ? "کوئی مخصوص پروٹوکول میچ نہیں ہوا؛ عمومی حفاظتی اصول لاگو کیے گئے۔"
                  : "No specific protocol matched; general safety rules applied."}
              </div>
            )}
          </div>

          {/* Matched Keywords */}
          {metadata && metadata.matchedKeywords && metadata.matchedKeywords.length > 0 && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? "مماثل کلیدی الفاظ" : "Matched Symptom Keywords"}</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {metadata.matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Patient Context Considered */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? "شامل کردہ مریض کا پس منظر" : "Patient Profile Factors Considered"}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-700 block">
                  {isUrdu ? "دائمی بیماریاں:" : "Chronic Conditions:"}
                </strong>
                <span className="text-slate-600">
                  {metadata?.profileUsed?.conditions && metadata.profileUsed.conditions.length > 0
                    ? metadata.profileUsed.conditions.join(", ")
                    : "None recorded"}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-700 block">
                  {isUrdu ? "الرجیز:" : "Known Allergies:"}
                </strong>
                <span className="text-slate-600">
                  {metadata?.profileUsed?.allergies && metadata.profileUsed.allergies.length > 0
                    ? metadata.profileUsed.allergies.join(", ")
                    : "None recorded"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            {isUrdu ? "بند کریں" : "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

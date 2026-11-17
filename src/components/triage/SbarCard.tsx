"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  X,
  HeartPulse,
  Download,
  Languages,
  Check,
  Copy,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useUser } from "@/context/UserContext";

interface SbarCardProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number | null;
  patientGender?: string | null;
  conditions?: string[];
  allergies?: string[];
  medications?: string[];
  situation: string;
  assessment: string;
  triageLevel?: string;
}

export function SbarCard({
  isOpen,
  onClose,
  patientName = "Patient",
  patientAge,
  patientGender,
  conditions = [],
  allergies = [],
  medications = [],
  situation,
  assessment,
  triageLevel = "Clinical Evaluation",
}: SbarCardProps) {
  const { lang } = useUser();
  const [cardLang, setCardLang] = useState<"en" | "ur">(lang === "ur" ? "ur" : "en");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const isUrdu = cardLang === "ur";

  // Translate triage level into Urdu
  const getUrduTriageLevel = (lvl: string) => {
    const lower = lvl.toLowerCase();
    if (lower.includes("emergency")) return "🚨 ہنگامی صورتحال (Emergency)";
    if (lower.includes("urgent")) return "⚠️ فوری طبی توجہ (Urgent Care)";
    if (lower.includes("routine")) return "ℹ️ معمول کا چیک اپ (Routine Care)";
    if (lower.includes("home")) return "🟢 گھریلو دیکھ بھال (Home Care)";
    return lvl;
  };

  // Strip technical prompt tags from assessment
  const cleanAssessment = assessment
    .replace(/^TRIAGE_LEVEL:\s*\w+\s*/i, "")
    .replace(/^---\s*/, "")
    .trim();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const dateStr = new Date().toLocaleDateString("en-GB");
    const timeStr = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

    const fileContent = isUrdu
      ? `============================================================
طبیب کیئر — ڈاکٹر کلینیکل ہینڈ اوور کارڈ (SBAR خلاصہ)
تاریخ: ${dateStr} ${timeStr}
طبی نظام: TabeebCare SDG 3 Primary Healthcare Assistant
============================================================

[مریض کی تفصیلات]
- نام: ${patientName}
- عمر و جنس: ${patientAge ? `${patientAge} سال` : "معلوم نہیں"} • ${patientGender || "معلوم نہیں"}
- ہنگامی ترجیح: ${getUrduTriageLevel(triageLevel)}
- معلوم الرجی: ${allergies.length > 0 ? allergies.join(", ") : "کوئی معلوم الرجی درج نہیں"}

------------------------------------------------------------
[S] صورتحال (SITUATION):
${situation || "مریض نے ابتدائی سوالنامے کے دوران علامات رپورٹ کیں۔"}

------------------------------------------------------------
[B] پس منظر (BACKGROUND):
- دائمی امراض: ${conditions.length > 0 ? conditions.join(", ") : "کوئی نہیں"}
- موجودہ ادویات: ${medications.length > 0 ? medications.join(", ") : "کوئی نہیں"}

------------------------------------------------------------
[A] کلینیکل جائزہ (ASSESSMENT):
${cleanAssessment || "ڈبلیو ایچ او کلینیکل ٹریآج پروٹوکول کے تحت تیار کردہ جائزہ۔"}

------------------------------------------------------------
[R] ڈاکٹر کے لیے سفارشات (RECOMMENDATION):
فزیکل معائنہ، اہم علامات کی تصدیق (بلڈ پریشر، دل کی دھڑکن، آکسیجن، شوگر لیول) اور معالج ڈاکٹر کی صوابدید کے مطابق تشخیصی ورک اپ۔

============================================================
نوٹ: یہ خلاصہ طبیب کیئر تعلیمی و ٹریآج سسٹم نے تیار کیا ہے۔
یہ حتمی طبی تشخیص کا نعم البدل نہیں ہے۔
============================================================`
      : `============================================================
TABEEBCARE CLINICAL HANDOVER CARD (SBAR SUMMARY)
Date: ${dateStr} ${timeStr}
System: TabeebCare SDG 3 Primary Healthcare Assistant
============================================================

[PATIENT OVERVIEW]
- Name: ${patientName}
- Demographics: ${patientAge ? `${patientAge} yrs` : "N/A"} • ${patientGender || "N/A"}
- Triage Urgency: ${triageLevel}
- Known Allergies: ${allergies.length > 0 ? allergies.join(", ") : "None reported"}

------------------------------------------------------------
[S] SITUATION (Presenting Complaint):
${situation || "Patient reported acute symptoms during conversational intake."}

------------------------------------------------------------
[B] BACKGROUND (Medical History & Current Medications):
- Chronic Conditions: ${conditions.length > 0 ? conditions.join(", ") : "None recorded"}
- Current Medications: ${medications.length > 0 ? medications.join(", ") : "None reported"}

------------------------------------------------------------
[A] ASSESSMENT (Clinical Symptoms & Observations):
${cleanAssessment || "Clinical assessment generated through WHO Triage protocols."}

------------------------------------------------------------
[R] RECOMMENDATION (Suggested Clinical Focus):
Physical examination, vital signs verification (BP, Heart Rate, SpO2, Blood Sugar), and clinical diagnostic workup as indicated by physician.

============================================================
DISCLAIMER: Prepared via TabeebCare for educational triage navigation.
It does not replace professional medical diagnosis or treatment.
============================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `TabeebCare_SBAR_${patientName.replace(/\s+/g, "_")}_${dateStr.replace(/\//g, "-")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    const textToCopy = `TabeebCare SBAR Report (${patientName}):\nSituation: ${situation}\nAssessment: ${cleanAssessment}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                {isUrdu
                  ? "ڈاکٹر کلینیکل کارڈ (SBAR رپورٹ)"
                  : "Doctor Handover Card (SBAR Clinical Summary)"}
              </h3>
              <p className="text-xs text-slate-500">
                {isUrdu
                  ? "ڈاکٹر کے معائنے کے لیے فوری کلینیکل خلاصہ"
                  : "Standardized clinical intake summary for your consulting physician"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Language Toggle */}
            <div className="inline-flex items-center bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/70 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCardLang("en")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  !isUrdu
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setCardLang("ur")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  isUrdu
                    ? "bg-teal-600 text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900"
                }`}
              >
                اردو
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Card Body */}
        <div
          dir={isUrdu ? "rtl" : "ltr"}
          className={`p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-700 print:p-0 ${
            isUrdu ? "font-sans leading-relaxed" : ""
          }`}
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block">
                  {isUrdu ? "طبیب کیئر کلینیکل ہینڈ اوور" : "TabeebCare Clinical Handover"}
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">
                  {isUrdu
                    ? "طبیب کیئر ایس ڈی جی 3 ہیلتھ نیویگیشن سسٹم"
                    : "TabeebCare Clinical SBAR Card • UN SDG 3"}
                </span>
              </div>
            </div>
            <div className={`${isUrdu ? "text-left" : "text-right"} text-xs text-slate-500 font-mono`}>
              <p>{isUrdu ? "تاریخ" : "Date"}: {new Date().toLocaleDateString("en-GB")}</p>
              <p className="text-[11px] text-slate-400">
                {isUrdu ? "پروٹوکول: ڈبلیو ایچ او گائیڈ لائنز" : "Protocol: WHO Guidelines RAG"}
              </p>
            </div>
          </div>

          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "مریض کا نام" : "Patient Name"}
              </span>
              <strong className="text-slate-900 text-sm block mt-0.5">{patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "عمر و جنس" : "Demographics"}
              </span>
              <strong className="text-slate-900 block mt-0.5">
                {patientAge ? `${patientAge} ${isUrdu ? "سال" : "yrs"}` : "N/A"} • {patientGender || "N/A"}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "ہنگامی ترجیح" : "Triage Urgency"}
              </span>
              <span className="font-extrabold text-teal-700 text-xs block mt-0.5">
                {isUrdu ? getUrduTriageLevel(triageLevel) : triageLevel.toUpperCase()}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                {isUrdu ? "معلوم الرجی" : "Known Allergies"}
              </span>
              <span className="font-bold text-red-600 block mt-0.5">
                {allergies.length > 0
                  ? allergies.join(", ")
                  : isUrdu
                  ? "کوئی الرجی درج نہیں"
                  : "None reported"}
              </span>
            </div>
          </div>

          {/* SBAR Clinical Sections */}
          <div className="space-y-4">
            {/* Situation */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "S — Situation (مریض کی فوری صورتحال اور شکایت)"
                  : "S — Situation (Presenting Complaint)"}
              </h4>
              <p
                className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200`}
              >
                {situation || (isUrdu ? "مریض نے علامات رپورٹ کیں۔" : "Patient reported acute symptoms during intake.")}
              </p>
            </div>

            {/* Background */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "B — Background (طبی پس منظر اور موجودہ ادویات)"
                  : "B — Background (Medical History & Medications)"}
              </h4>
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200`}
              >
                <div>
                  <strong className="text-slate-700 block mb-0.5">
                    {isUrdu ? "دائمی امراض:" : "Chronic Conditions:"}
                  </strong>
                  <span className="text-slate-600">
                    {conditions.length > 0
                      ? conditions.join(", ")
                      : isUrdu
                      ? "کوئی دائمی مرض درج نہیں"
                      : "None recorded"}
                  </span>
                </div>
                <div>
                  <strong className="text-slate-700 block mb-0.5">
                    {isUrdu ? "موجودہ ادویات:" : "Current Medications:"}
                  </strong>
                  <span className="text-slate-600">
                    {medications.length > 0
                      ? medications.join(", ")
                      : isUrdu
                      ? "کوئی دوا درج نہیں"
                      : "None reported"}
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "A — Assessment (کلینیکل جائزہ اور علامات کا تجزیہ)"
                  : "A — Assessment (Clinical Symptoms & Observations)"}
              </h4>
              <div
                className={`text-xs sm:text-sm text-slate-800 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2" : "pl-3.5 border-l-2"
                } border-teal-200 whitespace-pre-wrap max-h-48 overflow-y-auto`}
              >
                {cleanAssessment ||
                  (isUrdu
                    ? "کلینیکل پروٹوکول کے تحت تجزیہ تیار کیا گیا۔"
                    : "Clinical assessment generated through WHO Triage protocols.")}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0" />
                {isUrdu
                  ? "R — Recommendation (ڈاکٹر کے معائنے کے لیے تجاویز)"
                  : "R — Recommendation (Suggested Clinical Focus)"}
              </h4>
              <p
                className={`text-xs sm:text-sm text-teal-950 leading-relaxed ${
                  isUrdu ? "pr-3.5 border-r-2 border-teal-400" : "pl-3.5 border-l-2 border-teal-400"
                }`}
              >
                {isUrdu
                  ? "فزیکل معائنہ، اہم علامات کی تصدیق (بلڈ پریشر، نبض/دل کی دھڑکن، آکسیجن، بلڈ شوگر لیول) اور معالج ڈاکٹر کے فیصلے کے مطابق تشخیصی ورک اپ۔"
                  : "Physical examination, vital signs verification (BP, Heart Rate, SpO2, Blood Sugar), and clinical diagnostic workup as indicated by physician."}
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              {isUrdu
                ? "طبیب کیئر ایس ڈی جی 3 سسٹم کے تحت تیار کردہ"
                : "Prepared via TabeebCare SDG 3 Outreach System"}
            </span>
            <span>
              {isUrdu
                ? "تعلیمی و ترجیحی رہنمائی • حتمی تشخیص نہیں"
                : "Educational Support Only • Not a Final Diagnosis"}
            </span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">{isUrdu ? "کاپی ہو گیا" : "Copied"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isUrdu ? "خلاصہ کاپی کریں" : "Copy Summary"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal-600" />
              <span>{isUrdu ? "فائل ڈاؤن لوڈ کریں (.txt)" : "Download (.txt)"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              {isUrdu ? "بند کریں" : "Close"}
            </Button>
            <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 shadow-sm">
              <Printer className="w-4 h-4" />
              <span>{isUrdu ? "پرنٹ / PDF محفوظ کریں" : "Print / Save PDF"}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

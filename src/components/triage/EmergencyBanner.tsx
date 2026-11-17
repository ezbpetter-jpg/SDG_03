"use client";

import React from "react";
import { PhoneCall, AlertOctagon, HeartHandshake, MapPin } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface EmergencyBannerProps {
  level?: "emergency" | "urgent" | "routine" | "home" | string | null;
  isMentalHealth?: boolean;
}

export function EmergencyBanner({
  level = "emergency",
  isMentalHealth = false,
}: EmergencyBannerProps) {
  const { lang, t } = useUser();
  const isUrdu = lang === "ur";

  // Show ONLY when triage level is emergency or urgent. Never on routine/home care.
  const normalizedLevel = (level || "").toLowerCase();
  if (normalizedLevel !== "emergency" && normalizedLevel !== "urgent") {
    return null;
  }

  const isUrgentOnly = normalizedLevel === "urgent";

  return (
    <div
      className={
        isUrgentOnly
          ? "w-full bg-amber-50 border-2 border-amber-500 rounded-2xl p-4 sm:p-5 shadow-sm text-amber-950 animate-in slide-in-from-top-2 duration-300"
          : "w-full bg-red-50 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-sm text-red-900 animate-in slide-in-from-top-2 duration-300"
      }
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 ${
              isUrgentOnly ? "bg-amber-600" : "bg-red-600"
            }`}
          >
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4
              className={`text-sm sm:text-base font-extrabold flex flex-wrap items-center gap-2 ${
                isUrgentOnly ? "text-amber-950" : "text-red-900"
              }`}
            >
              <span>
                🚨{" "}
                {isUrgentOnly
                  ? isUrdu
                    ? "فوری نگہداشت کا انتباہ (Urgent Care)"
                    : "Urgent Medical Care Required"
                  : t("triage_emergency_banner_title")}
              </span>
              <span
                className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  isUrgentOnly
                    ? "text-amber-800 bg-amber-100 border-amber-300"
                    : "text-red-700 bg-red-100/90 border-red-200"
                }`}
              >
                {isUrdu ? "فوری طبی امداد" : "Prompt Evaluation"}
              </span>
            </h4>
            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-3xl ${
                isUrgentOnly ? "text-amber-900" : "text-red-800"
              }`}
            >
              {isUrgentOnly
                ? isUrdu
                  ? "یہ علامات فوری طبی جائزے کی متقاضی ہیں۔ براہ کرم قریبی کلینک یا ہسپتال کے ایمرجنسی ڈیپارٹمنٹ سے رجوع کریں۔"
                  : "These symptoms require prompt clinical attention. Please visit an urgent care clinic or emergency facility without unnecessary delay."
                : t("triage_emergency_banner_desc")}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          {/* Call 1122 Button */}
          <a
            href="tel:1122"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md active:bg-red-800 transition-all hover:scale-[1.02]"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>{isUrdu ? "1122 پر کال کریں" : "Call 1122"}</span>
          </a>

          {/* Nearest Emergency Hospital Button */}
          <a
            href="https://www.google.com/maps/search/emergency+hospital+near+me"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-100/60 font-bold text-xs shadow-xs transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-red-600" />
            <span>{isUrdu ? "قریبی ہسپتال" : "Nearest Emergency Hospital"}</span>
          </a>

          {/* Mental Health Mode Buttons */}
          {isMentalHealth && (
            <>
              <a
                href="tel:03174288665"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-100/60 font-bold text-xs shadow-xs transition-colors"
              >
                <HeartHandshake className="w-4 h-4 text-red-600" />
                <span>Umang: 0317-4288665</span>
              </a>
              <a
                href="https://www.google.com/maps/search/psychiatrist+near+me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs shadow-xs transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                <span>{isUrdu ? "ماہر نفسیات" : "Find Psychiatrist"}</span>
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

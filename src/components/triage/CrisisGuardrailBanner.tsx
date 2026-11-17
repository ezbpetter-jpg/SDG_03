"use client";

import React from "react";
import { PhoneCall, HeartHandshake, ShieldAlert, Heart } from "lucide-react";
import { useUser } from "@/context/UserContext";

export function CrisisGuardrailBanner() {
  const { lang } = useUser();
  const isUrdu = lang === "ur";

  return (
    <div className="w-full bg-gradient-to-r from-red-50 via-rose-50 to-pink-50 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-md text-red-950 animate-in slide-in-from-top-3 duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Heart className="w-6 h-6 animate-pulse text-rose-100" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-red-950 text-sm sm:text-base tracking-tight">
                🚨 {isUrdu ? "حفاظتی انتباہ: آپ اکیلے نہیں ہیں" : "Crisis Safety Guardrail: You Are Not Alone"}
              </span>
              <span className="text-[11px] font-bold text-red-800 bg-red-100/90 border border-red-300 px-2 py-0.5 rounded-full">
                24/7 فوری مدد
              </span>
            </div>
            <p className="text-xs sm:text-sm text-red-900 leading-relaxed max-w-2xl">
              {isUrdu
                ? "اگر آپ شدید ذہنی دباؤ کا شکار ہیں یا خود کو نقصان پہنچانے کا سوچ رہے ہیں، تو براہ کرم ابھی کسی سے بات کریں۔ آپ کی زندگی انتہائی قیمتی ہے۔ فوراً نیچے دی گئی ہیلپ لائنز پر رابطہ کریں۔"
                : "If you are experiencing severe emotional distress or thoughts of self-harm, please connect with a compassionate professional right now. Your life is deeply valuable. Immediate help is available."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <a
            href="tel:03174288665"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95"
          >
            <HeartHandshake className="w-4 h-4 text-white" />
            <span>{isUrdu ? "امنگ ہیلپ لائن: 0317-4288665" : "Umang Crisis Line: 0317-4288665"}</span>
          </a>

          <a
            href="tel:1122"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white border border-red-300 text-red-800 hover:bg-red-100 font-bold text-xs shadow-xs transition-colors"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            <span>Call 1122</span>
          </a>
        </div>
      </div>
    </div>
  );
}

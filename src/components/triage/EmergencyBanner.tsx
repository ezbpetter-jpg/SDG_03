"use client";

import React from "react";
import { PhoneCall, AlertOctagon, HeartHandshake } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface EmergencyBannerProps {
  isMentalHealth?: boolean;
}

export function EmergencyBanner({ isMentalHealth = false }: EmergencyBannerProps) {
  const { lang, t } = useUser();
  const isUrdu = lang === "ur";

  return (
    <div className="w-full bg-red-50 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-sm text-red-900 animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm sm:text-base font-extrabold text-red-900 flex flex-wrap items-center gap-2">
              <span>🚨 {t("triage_emergency_banner_title")}</span>
              <span className="text-[11px] font-bold text-red-700 bg-red-100/90 border border-red-200 px-2 py-0.5 rounded-full">
                فوری طبی امداد
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed max-w-3xl">
              {t("triage_emergency_banner_desc")}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0 pt-1 md:pt-0">
          <a
            href="tel:1122"
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-md active:bg-red-800 transition-all hover:scale-[1.02]"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>{isUrdu ? "1122 پر کال کریں (ریسکیو)" : "Call 1122 (Rescue)"}</span>
          </a>

          {isMentalHealth && (
            <a
              href="tel:03174288665"
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-100/60 font-bold text-xs shadow-xs transition-colors"
            >
              <HeartHandshake className="w-4 h-4 text-red-600" />
              <span>Umang Helpline: 0317-4288665</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

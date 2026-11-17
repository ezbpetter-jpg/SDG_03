import React from "react";
import { PhoneCall, AlertOctagon, HeartHandshake } from "lucide-react";

interface EmergencyBannerProps {
  isMentalHealth?: boolean;
}

export function EmergencyBanner({ isMentalHealth = false }: EmergencyBannerProps) {
  return (
    <div className="w-full bg-red-50 border-2 border-red-500 rounded-2xl p-4 sm:p-5 shadow-sm text-red-900 animate-in slide-in-from-top-2 duration-300">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm sm:text-base font-bold text-red-900 flex items-center gap-1.5">
              <span>🚨 Critical Emergency Alert</span>
              <span className="text-xs font-semibold text-red-700 bg-red-100/80 px-2 py-0.5 rounded-full">
                فوری طبی امداد
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-red-800 leading-relaxed">
              These symptoms may represent a time-sensitive medical emergency. Do not wait. Please contact emergency medical services or proceed immediately to the nearest hospital emergency room.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto shrink-0">
          <a
            href="tel:1122"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md active:bg-red-800 transition-colors"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1122 (Rescue)</span>
          </a>

          {isMentalHealth && (
            <a
              href="tel:03174288665"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-red-300 text-red-700 hover:bg-red-100/50 font-semibold text-xs shadow-xs transition-colors"
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

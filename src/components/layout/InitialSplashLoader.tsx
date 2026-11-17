"use client";

import React, { useEffect, useState } from "react";
import { HeartPulse } from "lucide-react";

export function InitialSplashLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState("Initializing Clinical Protocols • SDG 3");

  useEffect(() => {
    // Stage 1: ~600ms
    const t1 = setTimeout(() => {
      setProgress(48);
      setStatusText("Connecting to Groq AI Health Intelligence...");
    }, 600);

    // Stage 2: ~1300ms
    const t2 = setTimeout(() => {
      setProgress(78);
      setStatusText("Loading 15 Primary Care Guidelines (WHO)...");
    }, 1300);

    // Stage 3: ~1900ms
    const t3 = setTimeout(() => {
      setProgress(96);
      setStatusText("TabeebCare Ready • طبیب کیئر تیار ہے");
    }, 1900);

    // Stage 4: ~2400ms (Start smooth 500ms fade-out)
    const t4 = setTimeout(() => {
      setProgress(100);
      setFading(true);
    }, 2400);

    // Stage 5: ~2900ms (Remove from DOM completely)
    const t5 = setTimeout(() => {
      setVisible(false);
    }, 2950);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      id="tabeebcare-splash-loader"
      aria-hidden={fading}
      className={`fixed inset-0 z-[9999] bg-slate-50 flex flex-col items-center justify-center p-4 select-none transition-opacity duration-500 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-teal-100/60 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Pulsing Medical Heartbeat Emblem */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-24 h-24 rounded-3xl bg-teal-500/20 animate-ping duration-1000" />
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xl shadow-teal-700/25 relative z-10">
            <HeartPulse className="w-10 h-10 sm:w-11 sm:h-11 text-white animate-pulse" />
          </div>
        </div>

        {/* Bilingual Brand Identity */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              TabeebCare
            </h1>
            <span className="text-2xl sm:text-3xl font-bold text-teal-700 font-sans">
              طبیب کیئر
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            AI Health Literacy & Clinical Triage Companion
          </p>
        </div>

        {/* Animated ECG Lifeline Vector */}
        <div className="w-56 sm:w-64 h-12 mb-5 flex items-center justify-center text-teal-600">
          <svg
            viewBox="0 0 200 40"
            className="w-full h-full stroke-current fill-none stroke-[2.5]"
          >
            <path
              d="M 0,20 L 55,20 L 65,10 L 73,32 L 85,4 L 95,30 L 105,18 L 115,20 L 200,20"
              className="stroke-teal-600 opacity-90 animate-pulse"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Dynamic Micro-Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs mb-6">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-ping shrink-0" />
          <span className="transition-all duration-300">{statusText}</span>
        </div>

        {/* Smooth Loading Progress Bar */}
        <div className="w-52 sm:w-60 h-2 bg-slate-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

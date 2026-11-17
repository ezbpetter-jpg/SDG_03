"use client";

import React, { useEffect, useState } from "react";
import { HeartPulse, Activity } from "lucide-react";

export function InitialSplashLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    setMounted(true);

    // Check if splash was already shown in this browser session
    try {
      const seen = sessionStorage.getItem("tabibcare_splash_seen");
      if (seen) {
        return;
      }
    } catch {
      // In case sessionStorage is disabled or throws
    }

    // Display splash on first load
    setVisible(true);

    // Smooth progress simulation over 700ms
    const p1 = setTimeout(() => setProgress(55), 180);
    const p2 = setTimeout(() => setProgress(88), 400);
    const p3 = setTimeout(() => setProgress(100), 620);

    // Start fade-out at 780ms
    const fadeTimer = setTimeout(() => {
      setFading(true);
      // Remove from DOM after fade completes
      setTimeout(() => {
        setVisible(false);
        try {
          sessionStorage.setItem("tabibcare_splash_seen", "true");
        } catch {
          // Ignore storage quota/security errors
        }
      }, 350);
    }, 780);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
    };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      aria-hidden={fading}
      className={`fixed inset-0 z-[100] bg-slate-50 flex flex-col items-center justify-center p-4 transition-opacity duration-350 ease-out select-none ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-teal-100/50 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-sm w-full text-center">
        {/* Pulsing Medical Heartbeat Emblem */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-500/15 animate-ping duration-1000" />
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-700/20 relative z-10">
            <HeartPulse className="w-9 h-9 sm:w-10 sm:h-10 text-white animate-pulse" />
          </div>
        </div>

        {/* Bilingual Brand Identity */}
        <div className="space-y-1 mb-4">
          <div className="flex items-center justify-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              TabeebCare
            </h1>
            <span className="text-xl sm:text-2xl font-bold text-teal-700 font-sans">
              طبیب کیئر
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            AI Health Literacy & Clinical Triage Companion
          </p>
        </div>

        {/* Animated ECG Lifeline Vector */}
        <div className="w-48 sm:w-56 h-10 mb-4 flex items-center justify-center text-teal-600">
          <svg
            viewBox="0 0 200 40"
            className="w-full h-full stroke-current fill-none stroke-[2.5]"
          >
            <path
              d="M 0,20 L 55,20 L 65,10 L 73,32 L 85,4 L 95,30 L 105,18 L 115,20 L 200,20"
              className="stroke-teal-600 opacity-90"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Dynamic Micro-Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs mb-5">
          <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
          <span>Initializing Clinical Protocols • SDG 3</span>
        </div>

        {/* Smooth Loading Progress Bar */}
        <div className="w-44 sm:w-52 h-1.5 bg-slate-200/90 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

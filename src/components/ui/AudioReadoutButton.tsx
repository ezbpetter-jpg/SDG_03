"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import clsx from "clsx";

interface AudioReadoutButtonProps {
  text: string;
  className?: string;
}

export function AudioReadoutButton({ text, className }: AudioReadoutButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setIsSupported(true);
    }
  }, []);

  // Stop speaking when unmounted
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanTextForSpeech = (raw: string): string => {
    return raw
      .replace(/^TRIAGE_LEVEL:\s*\w+\s*/i, "") // Strip TRIAGE_LEVEL tag
      .replace(/###\s*/g, "")
      .replace(/##\s*/g, "")
      .replace(/#\s*/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/[-_]/g, " ")
      .trim();
  };

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const cleaned = cleanTextForSpeech(text);
    if (!cleaned) return;

    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleaned);

    // Detect if text contains Arabic/Urdu unicode characters
    const hasUrdu = /[\u0600-\u06FF]/.test(cleaned);

    const voices = window.speechSynthesis.getVoices();
    if (hasUrdu) {
      // Pick ur-PK or ur voice if available, else fallback silently
      const urduVoice = voices.find(
        (v) => v.lang.startsWith("ur") || v.lang.startsWith("ar")
      );
      if (urduVoice) {
        utterance.voice = urduVoice;
      }
      utterance.lang = "ur-PK";
    } else {
      const enVoice = voices.find(
        (v) => v.lang.startsWith("en-") || v.lang === "en"
      );
      if (enVoice) {
        utterance.voice = enVoice;
      }
      utterance.lang = "en-US";
    }

    utterance.rate = 0.95; // Clear natural rate for healthcare comprehension

    utterance.onstart = () => {
      setIsPlaying(true);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (err) => {
      console.warn("Speech synthesis error:", err);
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported || !text.trim()) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      title={isPlaying ? "Stop Audio Readout" : "Listen (Audio Readout)"}
      aria-label={isPlaying ? "Stop Audio Readout" : "Listen to advice"}
      className={clsx(
        "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors shadow-2xs",
        isPlaying
          ? "bg-teal-600 text-white animate-pulse"
          : "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/80",
        className
      )}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-white" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-teal-600" />
          <span>Listen</span>
        </>
      )}
    </button>
  );
}

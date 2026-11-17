"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Globe } from "lucide-react";
import clsx from "clsx";

interface VoiceButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
  defaultLang?: "ur-PK" | "en-US";
}

// Declare SpeechRecognition interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export function VoiceButton({
  onTranscript,
  className,
  defaultLang = "ur-PK",
}: VoiceButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voiceLang, setVoiceLang] = useState<"ur-PK" | "en-US">(defaultLang);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!isSupported) return;

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLang;
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onTranscript(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition initialization failed:", err);
      setIsListening(false);
    }
  };

  const toggleVoiceLang = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextLang = voiceLang === "ur-PK" ? "en-US" : "ur-PK";
    setVoiceLang(nextLang);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // If the browser does not support Web Speech Recognition, hide the button gracefully
  if (!isSupported) {
    return null;
  }

  return (
    <div className={clsx("inline-flex items-center gap-1", className)}>
      {/* Language Switcher for Mic */}
      <button
        type="button"
        onClick={toggleVoiceLang}
        title={`Dictation Language: ${voiceLang === "ur-PK" ? "Urdu (ur-PK)" : "English (en-US)"}`}
        className="text-[10px] font-bold px-1.5 py-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
      >
        {voiceLang === "ur-PK" ? "اردو" : "EN"}
      </button>

      {/* Mic Button */}
      <button
        type="button"
        onClick={toggleListening}
        title={isListening ? "Listening... Click to stop" : "Speak (Voice input)"}
        className={clsx(
          "p-2.5 rounded-xl transition-all flex items-center justify-center shrink-0 shadow-2xs",
          isListening
            ? "bg-red-500 text-white animate-pulse ring-4 ring-red-100"
            : "bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200"
        )}
      >
        {isListening ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

import React from "react";
import { AlertCircle, AlertTriangle, Clock, Home } from "lucide-react";
import clsx from "clsx";

export type TriageLevel = "emergency" | "urgent" | "routine" | "home";

interface TriageBadgeProps {
  level: TriageLevel | string;
  lang?: "en" | "ur";
  className?: string;
}

export function TriageBadge({ level, lang = "en", className }: TriageBadgeProps) {
  const normalizedLevel = (level || "routine").toLowerCase() as TriageLevel;

  const config = {
    emergency: {
      label: "EMERGENCY CARE",
      labelUrdu: "فوری ایمرجنسی",
      subtext: "Immediate ER or call 1122",
      subtextUrdu: "فوری ہسپتال یا 1122 پر کال کریں",
      icon: AlertCircle,
      bg: "bg-red-50 border-red-200 text-red-700",
      iconColor: "text-red-600",
    },
    urgent: {
      label: "URGENT CLINIC VISIT",
      labelUrdu: "ارجنٹ کلینک چیک اپ",
      subtext: "See a doctor today",
      subtextUrdu: "آج ہی ڈاکٹر سے رجوع کریں",
      icon: AlertTriangle,
      bg: "bg-amber-50 border-amber-200 text-amber-700",
      iconColor: "text-amber-600",
    },
    routine: {
      label: "ROUTINE APPOINTMENT",
      labelUrdu: "معمول کا معائنہ",
      subtext: "Schedule within 2-3 days",
      subtextUrdu: "2-3 دن کے اندر ڈاکٹر سے ملیں",
      icon: Clock,
      bg: "bg-sky-50 border-sky-200 text-sky-700",
      iconColor: "text-sky-600",
    },
    home: {
      label: "HOME CARE & MONITORING",
      labelUrdu: "گھریلو دیکھ بھال",
      subtext: "Rest, hydrate & monitor signs",
      subtextUrdu: "آرام، پانی کا استعمال اور علامات دیکھیں",
      icon: Home,
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      iconColor: "text-emerald-600",
    },
  }[normalizedLevel] || {
    label: "CLINICAL EVALUATION",
    labelUrdu: "طبی جائزہ",
    subtext: "Consult healthcare provider",
    subtextUrdu: "طبی ماہر سے رابطہ کریں",
    icon: Clock,
    bg: "bg-slate-100 border-slate-200 text-slate-700",
    iconColor: "text-slate-500",
  };

  const Icon = config.icon;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-2xs font-sans",
        config.bg,
        className
      )}
    >
      <Icon className={clsx("w-4 h-4 shrink-0 animate-pulse", config.iconColor)} />
      <div className="flex flex-col">
        <span className="text-xs font-bold tracking-wide uppercase leading-tight">
          {lang === "ur" ? config.labelUrdu : config.label}
        </span>
        <span className="text-[11px] opacity-80 leading-tight">
          {lang === "ur" ? config.subtextUrdu : config.subtext}
        </span>
      </div>
    </div>
  );
}

import React from "react";
import { Pill, Sun, Sunrise, Sunset, Moon, AlertTriangle, CheckCircle, Info } from "lucide-react";
import clsx from "clsx";

export interface MedicineData {
  name: string;
  generic: string;
  purpose: string;
  purpose_urdu: string;
  schedule: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  food_instruction: string;
  food_instruction_urdu: string;
  warnings?: string[];
  allergy_conflict?: boolean;
  allergy_message?: string | null;
}

interface MedicineCardProps {
  med: MedicineData;
  lang?: "en" | "ur";
}

export function MedicineCard({ med, lang = "en" }: MedicineCardProps) {
  const scheduleSlots = [
    { key: "morning", label: "Morning", labelUrdu: "صبح", icon: Sunrise, active: med.schedule?.morning },
    { key: "afternoon", label: "Afternoon", labelUrdu: "دوپہر", icon: Sun, active: med.schedule?.afternoon },
    { key: "evening", label: "Evening", labelUrdu: "شام", icon: Sunset, active: med.schedule?.evening },
    { key: "night", label: "Night", labelUrdu: "رات", icon: Moon, active: med.schedule?.night },
  ];

  return (
    <div
      className={clsx(
        "bg-white rounded-2xl border shadow-sm p-5 space-y-4 transition-all font-sans",
        med.allergy_conflict ? "border-red-300 ring-2 ring-red-100" : "border-slate-200 hover:border-teal-200"
      )}
    >
      {/* Allergy Conflict Warning Banner */}
      {med.allergy_conflict && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-red-800 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold text-red-900 block">
              🚨 ALLERGY CONFLICT WARNING (الرجی کا خطرہ)
            </strong>
            <p className="leading-relaxed">
              {med.allergy_message || "This medication conflicts with your recorded health profile allergies. Do not take without consulting your physician."}
            </p>
          </div>
        </div>
      )}

      {/* Header: Name, Generic & Purpose */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800 leading-tight">
              {med.name}
            </h4>
            <span className="text-xs text-slate-400 font-medium">
              Generic: {med.generic || "Active Pharmaceutical Ingredient"}
            </span>
          </div>
        </div>

        {/* Purpose badge */}
        <div className="text-left sm:text-right">
          <span className="inline-block text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-lg">
            {lang === "ur" && med.purpose_urdu ? med.purpose_urdu : med.purpose}
          </span>
        </div>
      </div>

      {/* 24-Hour Routine Schedule */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
          Daily Schedule (روزانہ کی خوراک)
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {scheduleSlots.map(({ key, label, labelUrdu, icon: Icon, active }) => (
            <div
              key={key}
              className={clsx(
                "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-colors",
                active
                  ? "bg-teal-50 border-teal-300 text-teal-800 shadow-2xs font-semibold"
                  : "bg-slate-50/70 border-slate-200 text-slate-400 opacity-60"
              )}
            >
              <Icon className={clsx("w-4 h-4", active ? "text-teal-600" : "text-slate-400")} />
              <div className="flex flex-col leading-tight">
                <span>{lang === "ur" ? labelUrdu : label}</span>
                <span className="text-[10px] font-normal">
                  {active ? (lang === "ur" ? "ضروری خوراک" : "1 Dose") : (lang === "ur" ? "نہیں لینی" : "Skip")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Food Instructions */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-700">
        <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="text-slate-800 font-semibold block">
            Food & Timing Instructions (کھانے کے متعلق ہدایات):
          </strong>
          <p className="text-slate-600">
            {lang === "ur" && med.food_instruction_urdu ? med.food_instruction_urdu : med.food_instruction}
          </p>
        </div>
      </div>

      {/* Precautions / Warnings list */}
      {med.warnings && med.warnings.length > 0 && (
        <div className="space-y-1 text-xs">
          <span className="font-semibold text-slate-600 block">Key Precautions:</span>
          <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
            {med.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

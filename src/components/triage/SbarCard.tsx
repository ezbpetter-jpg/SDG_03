"use client";

import React from "react";
import { FileText, Printer, X, HeartPulse, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

interface SbarCardProps {
  isOpen: boolean;
  onClose: () => void;
  patientName?: string;
  patientAge?: number | null;
  patientGender?: string | null;
  conditions?: string[];
  allergies?: string[];
  medications?: string[];
  situation: string;
  assessment: string;
  triageLevel?: string;
}

export function SbarCard({
  isOpen,
  onClose,
  patientName = "Patient",
  patientAge,
  patientGender,
  conditions = [],
  allergies = [],
  medications = [],
  situation,
  assessment,
  triageLevel = "Clinical Evaluation",
}: SbarCardProps) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between no-print">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Doctor Handover Card (SBAR Clinical Summary)
              </h3>
              <p className="text-xs text-slate-500">
                Standardized clinical intake summary for your consulting physician (طبی خلاصہ)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 text-sm text-slate-700 print:p-0">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b-2 border-slate-200 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg block">
                  TabeebCare Clinical Handover
                </span>
                <span className="text-[11px] text-teal-700 font-semibold">
                  طبیب کیئر کلینیکل ہینڈ اوور کارڈ • SDG 3
                </span>
              </div>
            </div>
            <div className="text-right text-xs text-slate-500 font-mono">
              <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
              <p className="text-[11px] text-slate-400">Intake System: WHO Protocol RAG</p>
            </div>
          </div>

          {/* Patient Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Patient Name</span>
              <strong className="text-slate-900 text-sm">{patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Demographics</span>
              <strong className="text-slate-900">
                {patientAge ? `${patientAge} yrs` : "N/A"} • {patientGender || "N/A"}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Triage Urgency</span>
              <span className="font-extrabold uppercase text-teal-700 text-xs block mt-0.5">
                {triageLevel}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-bold text-[10px]">Known Allergies</span>
              <span className="font-bold text-red-600 block mt-0.5">
                {allergies.length > 0 ? allergies.join(", ") : "None reported"}
              </span>
            </div>
          </div>

          {/* SBAR Clinical Sections */}
          <div className="space-y-4">
            {/* Situation */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                S — Situation (مریض کی فوری صورتحال)
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-3.5 border-l-2 border-teal-200">
                {situation || "Patient reported acute symptoms during conversational intake."}
              </p>
            </div>

            {/* Background */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                B — Background (طبی پس منظر اور موجودہ ادویات)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pl-3.5 border-l-2 border-teal-200">
                <div>
                  <strong className="text-slate-700 block">Chronic Conditions:</strong>
                  <span className="text-slate-600">
                    {conditions.length > 0 ? conditions.join(", ") : "None recorded"}
                  </span>
                </div>
                <div>
                  <strong className="text-slate-700 block">Current Medications:</strong>
                  <span className="text-slate-600">
                    {medications.length > 0 ? medications.join(", ") : "None reported"}
                  </span>
                </div>
              </div>
            </div>

            {/* Assessment */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
              <h4 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                A — Assessment (کلینیکل جائزہ اور علامات)
              </h4>
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed pl-3.5 border-l-2 border-teal-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {assessment || "Clinical assessment generated through WHO Triage protocols."}
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
              <h4 className="text-xs font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-600" />
                R — Recommendation (ڈاکٹر کے لیے تجاویز)
              </h4>
              <p className="text-xs sm:text-sm text-teal-950 leading-relaxed pl-3.5 border-l-2 border-teal-400">
                Physical examination, vital signs verification (BP, Heart Rate, SpO2, Blood Sugar), and clinical diagnostic workup as indicated by physician.
              </p>
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-400">
            <span>Prepared via TabeebCare SDG 3 Outreach System</span>
            <span>Educational Support Only • Not a Final Diagnosis</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 no-print">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close (بند کریں)
          </Button>
          <Button variant="primary" size="sm" onClick={handlePrint} className="gap-1.5 shadow-sm">
            <Printer className="w-4 h-4" />
            Print / Save PDF (پرنٹ کریں)
          </Button>
        </div>
      </div>
    </div>
  );
}

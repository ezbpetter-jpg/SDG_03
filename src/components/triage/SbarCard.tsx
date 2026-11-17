"use client";

import React from "react";
import { FileText, Printer, X, ShieldAlert, HeartPulse } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-800">
                Doctor Handover Card (SBAR Clinical Summary)
              </h3>
              <p className="text-xs text-slate-500">
                Standardized clinical intake summary for your consulting physician
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

        {/* Printable Card Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 print:p-0">
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-teal-600" />
              <span className="font-bold text-slate-800 tracking-tight">TabeebCare Clinical Handover</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              Date: {new Date().toLocaleDateString("en-GB")}
            </span>
          </div>

          {/* Patient Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block uppercase font-medium">Patient</span>
              <strong className="text-slate-800">{patientName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-medium">Age / Gender</span>
              <strong className="text-slate-800">
                {patientAge ? `${patientAge} yrs` : "N/A"} • {patientGender || "N/A"}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-medium">Triage Urgency</span>
              <span className="font-bold uppercase text-teal-700">{triageLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block uppercase font-medium">Allergies</span>
              <span className="font-semibold text-red-600">
                {allergies.length > 0 ? allergies.join(", ") : "None reported"}
              </span>
            </div>
          </div>

          {/* SBAR Sections */}
          <div className="space-y-4">
            {/* Situation */}
            <div className="border-l-4 border-teal-500 pl-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
                S — Situation (Chief Complaint)
              </h4>
              <p className="mt-1 text-slate-800 leading-relaxed bg-teal-50/50 p-2.5 rounded-lg border border-teal-100">
                {situation || "Patient reported acute medical discomfort."}
              </p>
            </div>

            {/* Background */}
            <div className="border-l-4 border-sky-500 pl-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-sky-800">
                B — Background (History & Current Therapy)
              </h4>
              <div className="mt-1 space-y-1.5 text-xs bg-sky-50/50 p-2.5 rounded-lg border border-sky-100">
                <p>
                  <strong>Chronic Conditions:</strong>{" "}
                  {conditions.length > 0 ? conditions.join(", ") : "None recorded"}
                </p>
                <p>
                  <strong>Current Medications:</strong>{" "}
                  {medications.length > 0 ? medications.join(", ") : "None currently active"}
                </p>
              </div>
            </div>

            {/* Assessment */}
            <div className="border-l-4 border-amber-500 pl-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800">
                A — Assessment (Symptom Intake & Protocol Classification)
              </h4>
              <p className="mt-1 text-slate-800 leading-relaxed bg-amber-50/50 p-2.5 rounded-lg border border-amber-100">
                {assessment || "Clinical assessment completed via evidence-based WHO triage protocol matching."}
              </p>
            </div>

            {/* Request */}
            <div className="border-l-4 border-emerald-500 pl-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                R — Recommendation / Request
              </h4>
              <p className="mt-1 text-slate-800 leading-relaxed bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
                Requesting physical evaluation, diagnostic confirmation, and therapeutic prescription guidance by consulting physician.
              </p>
            </div>
          </div>

          {/* Medical Notice */}
          <div className="flex items-center gap-2 text-[11px] text-slate-400 border-t border-slate-200 pt-3">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Generated via TabeebCare (SDG 3 Health Literacy). Intended solely to facilitate patient-physician clinical intake.
            </span>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2.5 print:hidden">
          <Button variant="outline" onClick={onClose} size="sm">
            Close
          </Button>
          <Button onClick={handlePrint} variant="primary" size="sm">
            <Printer className="w-4 h-4 mr-1.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>
    </div>
  );
}

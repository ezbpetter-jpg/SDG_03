"use client";

import React, { useState, useEffect } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";

export function MedicalDisclaimerFooter() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-6">
      <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center gap-3 text-xs text-slate-500">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
        <p className="leading-relaxed text-center sm:text-left">
          <strong className="text-slate-700">Medical Notice:</strong> TabeebCare is an educational health literacy and clinical triage navigation tool. It does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional. In case of life-threatening emergency, dial <strong className="text-red-600 font-bold">1122</strong> immediately.
        </p>
      </div>
    </footer>
  );
}

export function MedicalDisclaimerModal({ featureKey = "general" }: { featureKey?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const key = `tabibcare_disclaimer_ack_${featureKey}`;
    const acknowledged = localStorage.getItem(key);
    if (!acknowledged) {
      setIsOpen(true);
    }
  }, [featureKey]);

  const handleAcknowledge = () => {
    const key = `tabibcare_disclaimer_ack_${featureKey}`;
    localStorage.setItem(key, "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-lg p-6 space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-800">
            Important Medical Disclaimer
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            طبی رہنمائی اور حفاظتی انتباہ
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            • <strong>TabeebCare</strong> is an AI-assisted health literacy and triage companion designed to assist with communication and understanding.
          </p>
          <p>
            • It <strong>does not diagnose diseases</strong> or prescribe controlled medical therapies.
          </p>
          <p>
            • If you or someone with you experiences crushing chest pain, difficulty breathing, sudden stroke symptoms, or severe bleeding, please call <strong className="text-red-600">1122</strong> immediately without delay.
          </p>
        </div>

        <Button
          onClick={handleAcknowledge}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium"
        >
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          I Understand & Agree (میں متفق ہوں)
        </Button>
      </div>
    </div>
  );
}

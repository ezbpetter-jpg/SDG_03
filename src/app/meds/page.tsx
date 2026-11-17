"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MedicineCard, MedicineData } from "@/components/meds/MedicineCard";
import { MedicalDisclaimerModal } from "@/components/layout/MedicalDisclaimer";
import { Pill, Sparkles, AlertCircle, CheckCircle, Search, Clock } from "lucide-react";

export default function MedsPage() {
  const router = useRouter();
  const { user, profile, isLoading: isUserLoading, lang } = useUser();

  const isUrdu = lang === "ur";

  const [inputMeds, setInputMeds] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medData, setMedData] = useState<{
    medications: MedicineData[];
    general_advice?: string;
    general_advice_urdu?: string;
  } | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  const presets = [
    {
      title: "Diabetes Prescription",
      titleUrdu: "شوگر نسخہ",
      value: "Metformin 500mg, Glibenclamide 5mg, Aspirin 75mg",
    },
    {
      title: "Antibiotic Course",
      titleUrdu: "اینٹی بائیوٹک کورس",
      value: "Augmentin 625mg, Panadol 500mg",
    },
    {
      title: "Blood Pressure",
      titleUrdu: "بلڈ پریشر نسخہ",
      value: "Amlodipine 5mg, Losartan 50mg, Hydrochlorothiazide 25mg",
    },
  ];

  const handlePreset = (val: string) => {
    setInputMeds(val);
    handleAnalyze(val);
  };

  const handleAnalyze = async (medsToTest?: string) => {
    const text = medsToTest || inputMeds;
    if (!text.trim()) {
      setError("Please enter at least one medication name");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/meds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          medications: text,
          userId: user?.id,
        }),
      });

      const data = await res.json();
      if (res.ok && data.data) {
        setMedData(data.data);
      } else {
        setError(data.error || "Failed to analyze medications");
      }
    } catch {
      setError("Network error while connecting to Groq medication parser");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || !user) {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading...</div>;
  }

  return (
    <div className="space-y-6 py-2">
      <MedicalDisclaimerModal featureKey="meds" />

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {isUrdu ? "نسخہ و ادویات ڈیمسٹیفائر" : "Medicine Demystifier & Routine Guide"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {isUrdu
                ? "اپنی دواؤں کے نام درج کریں، اور 24 گھنٹے کا تصویری شیڈول اور غذائی ہدایات حاصل کریں۔"
                : "Enter prescribed medicines to receive clear dosage timings, food precautions, and allergy conflict checks."}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Fill Presets */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          {isUrdu ? "فوری ٹیسٹ کے لیے نمونہ نسخے (1-Click Presets):" : "1-Click Presets for Fast Evaluation:"}
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePreset(p.value)}
              className="text-xs px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 font-medium transition-colors shadow-2xs"
            >
              {isUrdu ? p.titleUrdu : p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isUrdu ? "نسخے کی ادویات کے نام درج کریں" : "Enter Medicine Names"}
            </label>
            <textarea
              rows={3}
              value={inputMeds}
              onChange={(e) => setInputMeds(e.target.value)}
              placeholder="e.g. Augmentin 625mg, Panadol 500mg, Glucophage 500mg, or Bactrim DS"
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400">
              Cross-checked with your recorded allergies:{" "}
              <strong className="text-slate-600 font-semibold">
                {profile?.allergies?.length ? profile.allergies.join(", ") : "None recorded"}
              </strong>
            </span>
            <Button
              onClick={() => handleAnalyze()}
              isLoading={isLoading}
              variant="primary"
            >
              <Search className="w-4 h-4 mr-1.5" />
              {isUrdu ? "ادویات کا تجزیہ کریں" : "Analyze & Build Schedule"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Results */}
      {medData && (
        <div className="space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-600" />
              {isUrdu ? "تجزیہ شدہ ادویات کا شیڈول" : "Generated Medication Schedule"}
            </h2>
            <span className="text-xs text-slate-500">
              {medData.medications.length} medication(s) evaluated
            </span>
          </div>

          {/* Cards per medication */}
          <div className="space-y-4">
            {medData.medications.map((med, idx) => (
              <MedicineCard key={idx} med={med} lang={lang} />
            ))}
          </div>

          {/* General Advice */}
          {(medData.general_advice || medData.general_advice_urdu) && (
            <div className="bg-teal-50/60 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 space-y-1">
              <strong className="font-bold flex items-center gap-1.5 text-teal-800">
                <CheckCircle className="w-4 h-4 text-teal-600" />
                {isUrdu ? "عمومی طبی مشورہ و احتیاط" : "General Clinical Advice"}
              </strong>
              <p className="leading-relaxed">
                {isUrdu && medData.general_advice_urdu ? medData.general_advice_urdu : medData.general_advice}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

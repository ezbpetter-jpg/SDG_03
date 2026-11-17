"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  UserCheck,
  ShieldAlert,
  Pill,
  Plus,
  X,
  Check,
  Save,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, updateProfile, isLoading: isUserLoading, lang, t } = useUser();
  const isUrdu = lang === "ur";

  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState<string>("Male");
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);

  const [newConditionInput, setNewConditionInput] = useState("");
  const [newAllergyInput, setNewAllergyInput] = useState("");
  const [newMedInput, setNewMedInput] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (profile) {
      setAge(profile.age ? String(profile.age) : "");
      setGender(profile.gender || "Male");
      setConditions(profile.conditions || []);
      setAllergies(profile.allergies || []);
      setMedications(profile.current_medications || []);
    }
  }, [profile]);

  const handleAddCondition = () => {
    if (newConditionInput.trim() && !conditions.includes(newConditionInput.trim())) {
      setConditions([...conditions, newConditionInput.trim()]);
      setNewConditionInput("");
    }
  };

  const handleRemoveCondition = (cond: string) => {
    setConditions(conditions.filter((c) => c !== cond));
  };

  const handleAddAllergy = () => {
    if (newAllergyInput.trim() && !allergies.includes(newAllergyInput.trim())) {
      setAllergies([...allergies, newAllergyInput.trim()]);
      setNewAllergyInput("");
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const handleAddMed = () => {
    if (newMedInput.trim() && !medications.includes(newMedInput.trim())) {
      setMedications([...medications, newMedInput.trim()]);
      setNewMedInput("");
    }
  };

  const handleRemoveMed = (med: string) => {
    setMedications(medications.filter((m) => m !== med));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);

    const ok = await updateProfile({
      age: age ? Number(age) : null,
      gender,
      conditions,
      allergies,
      current_medications: medications,
    });

    setIsSaving(false);
    if (ok) {
      setSuccessMessage(t("profile_saved_toast"));
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>{isUrdu ? "پروفائل لوڈ ہو رہی ہے..." : "Loading patient profile..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t("profile_title")}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              مریض کا ذاتی میڈیکل ریکارڈ • Local SQLite Storage
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          {t("profile_subtitle")}
        </p>
      </div>

      {/* Success Notification Banner */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Demographics */}
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 p-5 sm:p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">
              {t("profile_basic_info")}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isUrdu ? "عمر اور جنس کی معلومات" : "Age and gender help the AI calibrate drug dosages and triage thresholds."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label={t("profile_age_label")}
              type="number"
              min="1"
              max="120"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 54"
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                {t("profile_gender_label")}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-colors"
              >
                <option value="Male">{isUrdu ? "مرد (Male)" : "Male"}</option>
                <option value="Female">{isUrdu ? "عورت (Female)" : "Female"}</option>
                <option value="Other">{isUrdu ? "دیگر (Other)" : "Other"}</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Chronic Conditions */}
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 p-5 sm:p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">
              {t("profile_conditions_title")}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isUrdu ? "جیسے شوگر، بلڈ پریشر، دمہ وغیرہ" : "e.g. Type 2 Diabetes, Hypertension, Asthma, Ischemic Heart Disease."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newConditionInput}
                onChange={(e) => setNewConditionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddCondition();
                  }
                }}
                placeholder={isUrdu ? "بیماری کا نام لکھ کر Add دبائیں..." : "Type condition and click Add..."}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddCondition}>
                <Plus className="w-4 h-4 mr-1" />
                {t("profile_add_btn")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {conditions.length > 0 ? (
                conditions.map((c, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200"
                  >
                    <span>{c}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCondition(c)}
                      className="text-teal-600 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">{t("dash_none_reported")}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Drug & Substance Allergies (Critical) */}
        <Card className="rounded-2xl border-red-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-red-50/40 p-5 sm:p-6 border-b border-red-100">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <CardTitle className="text-base font-bold text-red-950">
                {t("profile_allergies_title")}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-red-700/80">
              {isUrdu
                ? "دواؤں کے خطرناک ردعمل سے بچنے کے لیے معلوم الرجیز درج کریں، مثلاً Penicillin, Sulfa"
                : "Crucial: TabeebCare checks these against every prescription scan to prevent dangerous allergic reactions."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newAllergyInput}
                onChange={(e) => setNewAllergyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddAllergy();
                  }
                }}
                placeholder={isUrdu ? "الرجی کا نام لکھیں (مثلاً Penicillin, Sulfa)..." : "e.g. Penicillin, Sulfa, Aspirin..."}
                className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-500"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddAllergy}>
                <Plus className="w-4 h-4 mr-1" />
                {t("profile_add_btn")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {allergies.length > 0 ? (
                allergies.map((a, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300"
                  >
                    <span>{a}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAllergy(a)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">{t("dash_none_reported")}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Current Medications */}
        <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/70 p-5 sm:p-6 border-b border-slate-100">
            <CardTitle className="text-base font-bold text-slate-800">
              {t("profile_meds_title")}
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              {isUrdu ? "جو ادویات آپ روزانہ باقاعدگی سے لیتے ہیں" : "Prescriptions you currently take regularly (e.g. Metformin 500mg, Amlodipine 5mg)."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 sm:p-6 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMedInput}
                onChange={(e) => setNewMedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddMed();
                  }
                }}
                placeholder={isUrdu ? "موجودہ دوا کا نام لکھیں..." : "e.g. Metformin 500mg, Amlodipine 5mg..."}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
              />
              <Button type="button" variant="outline" size="sm" onClick={handleAddMed}>
                <Plus className="w-4 h-4 mr-1" />
                {t("profile_add_btn")}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {medications.length > 0 ? (
                medications.map((m, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200"
                  >
                    <span>{m}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(m)}
                      className="text-sky-600 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">{t("dash_none_reported")}</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            isLoading={isSaving}
            size="lg"
            className="w-full sm:w-auto font-bold gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? t("btn_saving") : t("btn_save")}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

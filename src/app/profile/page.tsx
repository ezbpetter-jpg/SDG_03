"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { UserCheck, ShieldAlert, Pill, Plus, X, Check, Save } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, updateProfile, isLoading: isUserLoading, lang } = useUser();

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
      setSuccessMessage(isUrdu ? "پروفائل کامیابی سے اپ ڈیٹ ہو گئی!" : "Health profile updated successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  if (isUserLoading || !user) {
    return <div className="text-center py-20 text-slate-400 text-sm">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
          <UserCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {isUrdu ? "ہیلتھ پروفائل و لانگ ٹرم میموری" : "Health Profile & Long-Term Memory"}
          </h1>
          <p className="text-xs text-slate-500">
            {isUrdu
              ? "یہ معلومات ہر نسخہ چیک اور ٹریآج گفتگو میں خودکار طور پر استعمال ہوتی ہیں۔"
              : "Injected as long-term context into every AI consultation to prevent allergy and drug clashes."}
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      <Card>
        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Account Info Bar */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-medium">Logged in User</span>
                <strong className="text-slate-800 text-sm">{user.name}</strong>
              </div>
              <div className="text-slate-500">
                Email: <span className="font-mono text-slate-700">{user.email}</span>
              </div>
            </div>

            {/* Demographics */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age (سال)"
                type="number"
                placeholder="e.g. 54"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="1"
                max="120"
              />

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Gender (جنس)
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                >
                  <option value="Male">Male (مرد)</option>
                  <option value="Female">Female (خاتون)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Section: Chronic Conditions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Chronic Medical Conditions (دائمی امراض)
              </label>

              <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-slate-50/70 border border-slate-200 rounded-xl">
                {conditions.length > 0 ? (
                  conditions.map((cond) => (
                    <span
                      key={cond}
                      className="inline-flex items-center gap-1.5 text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-1 rounded-lg font-medium"
                    >
                      {cond}
                      <button
                        type="button"
                        onClick={() => handleRemoveCondition(cond)}
                        className="text-teal-600 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic py-1">No chronic conditions listed</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add condition (e.g. Type 2 Diabetes, Hypertension, Asthma)"
                  value={newConditionInput}
                  onChange={(e) => setNewConditionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCondition();
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddCondition}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Section: Allergies */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-500" />
                Drug & Food Allergies (معلوم الرجی الرٹس)
              </label>

              <div className="flex flex-wrap gap-2 min-h-[36px] p-2 bg-red-50/40 border border-red-200 rounded-xl">
                {allergies.length > 0 ? (
                  allergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="inline-flex items-center gap-1.5 text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg font-semibold"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic py-1">No drug allergies recorded</span>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add allergy (e.g. Sulfa, Penicillin, Aspirin, Ibuprofen)"
                  value={newAllergyInput}
                  onChange={(e) => setNewAllergyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddAllergy();
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddAllergy}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Section: Current Medications */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-teal-600" />
                Current Active Medications (روزانہ کی ادویات)
              </label>

              <div className="space-y-1.5">
                {medications.length > 0 ? (
                  medications.map((med) => (
                    <div
                      key={med}
                      className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs"
                    >
                      <span className="font-semibold text-slate-700">{med}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(med)}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg">
                    No active medications recorded
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add medication (e.g. Metformin 500mg, Amlodipine 5mg)"
                  value={newMedInput}
                  onChange={(e) => setNewMedInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddMed();
                    }
                  }}
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleAddMed}>
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              className="w-full mt-4"
            >
              <Save className="w-4 h-4 mr-1.5" />
              {isUrdu ? "محفوظ کریں (Save Changes)" : "Save Profile Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HeartPulse, UserPlus, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";

export default function SignupPage() {
  const router = useRouter();
  const { login, lang, t } = useUser();
  const isUrdu = lang === "ur";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [conditions, setConditions] = useState<string[]>([]);
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const conditionOptions = [
    { label: "Type 2 Diabetes", labelUrdu: "شوگر (ذیابیطس)" },
    { label: "Hypertension (High BP)", labelUrdu: "ہائی بلڈ پریشر" },
    { label: "Asthma / Respiratory", labelUrdu: "دمہ / سانس کا مسئلہ" },
    { label: "Ischemic Heart Disease", labelUrdu: "دل کا عارضہ" },
    { label: "Chronic Kidney Disease", labelUrdu: "گردے کا مسئلہ" },
    { label: "High Cholesterol", labelUrdu: "کولیسٹرول" },
  ];

  const toggleCondition = (cond: string) => {
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError(isUrdu ? "براہ کرم بنیادی اکاؤنٹ کی معلومات مکمل کریں" : "Please fill in all required account fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    const allergyList = allergies
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const medList = medications
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          age: age ? Number(age) : null,
          gender,
          conditions,
          allergies: allergyList,
          current_medications: medList,
        }),
      });

      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user, {
          age: age ? Number(age) : null,
          gender,
          conditions,
          allergies: allergyList,
          current_medications: medList,
        });
        router.push("/dashboard");
      } else {
        setError(data.error || (isUrdu ? "اکاؤنٹ بنانے میں مسئلہ پیش آیا" : "Failed to create account"));
      }
    } catch {
      setError(isUrdu ? "نیٹ ورک میں خرابی پیش آئی ہے" : "An unexpected network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl w-full mx-auto py-6 sm:py-10">
      <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="text-center pb-4 pt-6 sm:pt-8 bg-slate-50/50 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <UserPlus className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            {isUrdu ? "طبیب کیئر میں نیا اکاؤنٹ بنائیں" : "Create TabeebCare Account"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {isUrdu
              ? "ذاتی ہیلتھ پروفائل اور AI کلینیکل ٹریآج کے لیے رجسٹریشن"
              : "Register your patient profile for safe, personalized triage and prescription checks."}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Credentials */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isUrdu ? "1. اکاؤنٹ کی معلومات" : "1. Account Credentials"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label={isUrdu ? "مکمل نام" : "Full Name"}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fatima Ali"
                  required
                />
                <Input
                  label={isUrdu ? "ای میل ایڈریس" : "Email Address"}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patient@example.com"
                  required
                />
              </div>
              <Input
                label={isUrdu ? "پاس ورڈ" : "Password"}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {/* Demographics */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isUrdu ? "2. بنیادی معلومات" : "2. Demographics"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <Input
                  label={isUrdu ? "عمر (سال)" : "Age (Years)"}
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="e.g. 45"
                />
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    {isUrdu ? "جنس" : "Gender"}
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
              </div>
            </div>

            {/* Chronic Conditions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isUrdu ? "3. دائمی بیماریاں (اختیاری)" : "3. Chronic Conditions (Select all that apply)"}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {conditionOptions.map((c, i) => {
                  const isSelected = conditions.includes(c.label);
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => toggleCondition(c.label)}
                      className={clsx(
                        "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left",
                        isSelected
                          ? "bg-teal-50 border-teal-400 text-teal-900 font-bold shadow-2xs"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <div
                        className={clsx(
                          "w-4 h-4 rounded-md border flex items-center justify-center shrink-0",
                          isSelected
                            ? "bg-teal-600 border-teal-600 text-white"
                            : "border-slate-300 bg-white"
                        )}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span>{isUrdu ? c.labelUrdu : c.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Allergies & Medications */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isUrdu ? "4. الرجیز اور موجودہ ادویات" : "4. Allergies & Daily Medications"}
              </h4>
              <Input
                label={isUrdu ? "معلوم الرجیز (کوما سے الگ کریں)" : "Known Allergies (comma separated)"}
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Penicillin, Sulfa, Aspirin"
              />
              <Input
                label={isUrdu ? "موجودہ ادویات (کوما سے الگ کریں)" : "Current Medications (comma separated)"}
                type="text"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
                placeholder="e.g. Metformin 500mg, Panadol"
              />
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold gap-2 shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isUrdu ? "اکاؤنٹ رجسٹر کریں" : "Complete Registration"}</span>
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            {isUrdu ? "پہلے سے اکاؤنٹ موجود ہے؟ " : "Already have an account? "}
            <Link href="/login" className="text-teal-700 font-bold hover:underline">
              {isUrdu ? "لاگ ان کریں" : "Sign In"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

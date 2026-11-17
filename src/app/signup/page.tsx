"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HeartPulse, UserPlus, Sparkles } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { login } = useUser();

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
    "Type 2 Diabetes",
    "Hypertension (High BP)",
    "Asthma / Respiratory",
    "Ischemic Heart Disease",
    "Chronic Kidney Disease",
    "Hyperlipidemia (High Cholesterol)",
  ];

  const toggleCondition = (cond: string) => {
    setConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("Please fill in all required account fields");
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
        setError(data.error || "Failed to create account");
      }
    } catch {
      setError("An unexpected network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="text-center pb-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Create Your TabeebCare Profile
          </CardTitle>
          <CardDescription>
            نیا ہیلتھ اکاؤنٹ بنائیں اور محفوظ ڈیجیٹل ریکارڈ حاصل کریں
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg leading-relaxed">
                {error}
              </div>
            )}

            {/* Account Credentials */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block border-b border-slate-100 pb-1">
                1. Account Credentials (بنیادی معلومات)
              </span>

              <Input
                label="Full Name *"
                type="text"
                placeholder="e.g. Fatima Tariq"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Input
                  label="Password *"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Health Onboarding */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block border-b border-slate-100 pb-1">
                2. Health Profile & Long-Term Memory (صحت کا ریکارڈ)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Age"
                  type="number"
                  placeholder="e.g. 45"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="1"
                  max="120"
                />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Gender
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

              {/* Conditions Checkboxes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Chronic Conditions (دائمی امراض)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {conditionOptions.map((cond) => {
                    const isChecked = conditions.includes(cond);
                    return (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => toggleCondition(cond)}
                        className={`text-left text-xs p-2.5 rounded-lg border transition-colors flex items-center justify-between ${
                          isChecked
                            ? "bg-teal-50 border-teal-300 text-teal-800 font-semibold"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{cond}</span>
                        {isChecked && (
                          <span className="w-2 h-2 rounded-full bg-teal-600" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Allergies & Current Meds */}
              <Input
                label="Known Drug or Food Allergies"
                type="text"
                placeholder="e.g. Penicillin, Sulfa, Peanuts (comma-separated)"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                helperText="Crucial for preventing adverse drug-allergy clashes"
              />

              <Input
                label="Current Active Prescriptions"
                type="text"
                placeholder="e.g. Glucophage 500mg, Panadol (comma-separated)"
                value={medications}
                onChange={(e) => setMedications(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-4"
            >
              <UserPlus className="w-4 h-4 mr-1.5" />
              Complete Registration & Enter (اکاؤنٹ مکمل کریں)
            </Button>
          </form>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
            <Link
              href="/login"
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Already have an account? Sign In
            </Link>
            <Link
              href="/login?demo=true"
              className="flex items-center gap-1 font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded"
            >
              <Sparkles className="w-3 h-3" />
              Judge Demo Mode
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

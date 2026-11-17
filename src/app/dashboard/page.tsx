"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Pill, MessageSquareHeart, UserCheck, ShieldAlert, ArrowRight, HeartPulse, Activity } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, profile, isLoading, lang } = useUser();

  const isUrdu = lang === "ur";

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Loading health dashboard...
      </div>
    );
  }

  const conditions = profile?.conditions || [];
  const allergies = profile?.allergies || [];
  const medications = profile?.current_medications || [];

  return (
    <div className="space-y-6 py-2">
      {/* Welcome Greeting Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50/60 border border-teal-200/80 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Assalam o Alaikum, {user.name} 👋
            </h1>
            {user.isDemo && (
              <Badge variant="primary" size="sm">
                Demo Patient
              </Badge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {isUrdu
              ? "آپ کا ذاتی ہیلتھ پورٹل اور AI طبی مشیر فعال ہے۔"
              : "Your personal health literacy and triage companion is ready."}
          </p>
        </div>

        <Link href="/triage">
          <Button variant="primary" size="md">
            <MessageSquareHeart className="w-4 h-4 mr-1.5" />
            {isUrdu ? "علامات کا معائنہ شروع کریں" : "Start Triage Chat"}
          </Button>
        </Link>
      </div>

      {/* 3 Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Action 1 */}
        <Link href="/meds" className="group">
          <Card className="h-full border-slate-200 group-hover:border-teal-300 group-hover:shadow-md transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                  {isUrdu ? "ادویات کا شیڈول دیکھیں" : "Check Medicines"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isUrdu
                    ? "نسخہ ڈیمسٹیفائر اور روزانہ کے اوقات"
                    : "Prescription schedule, food precautions & allergy checks."}
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-semibold text-teal-600 group-hover:gap-2 transition-all">
                <span>{isUrdu ? "کھولیں" : "Open Module"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Action 2 */}
        <Link href="/triage" className="group">
          <Card className="h-full border-slate-200 group-hover:border-amber-300 group-hover:shadow-md transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
                <MessageSquareHeart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                  {isUrdu ? "علامات کا جائزہ (Triage)" : "Symptom Triage"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isUrdu
                    ? "ایمرجنسی اسسمنٹ اور ڈاکٹر گائیڈنس"
                    : "WHO protocol urgency classification & emergency guidance."}
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-semibold text-amber-600 group-hover:gap-2 transition-all">
                <span>{isUrdu ? "کھولیں" : "Start Consultation"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Action 3 */}
        <Link href="/profile" className="group">
          <Card className="h-full border-slate-200 group-hover:border-sky-300 group-hover:shadow-md transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 group-hover:text-sky-700 transition-colors">
                  {isUrdu ? "ہیلتھ پروفائل میموری" : "Health Profile Memory"}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isUrdu
                    ? "الرجی، دائمی امراض اور نسخے محفوظ کریں"
                    : "Manage conditions, drug allergies & active medication records."}
                </p>
              </div>
              <div className="pt-1 flex items-center text-xs font-semibold text-sky-600 group-hover:gap-2 transition-all">
                <span>{isUrdu ? "دیکھیں" : "Update Profile"}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Long-Term Memory Summary Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Conditions & Allergies Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                Active Health Conditions & Allergies
              </CardTitle>
              <Link href="/profile" className="text-xs text-teal-600 hover:underline font-medium">
                Edit
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-1">
            {/* Conditions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                Chronic Diagnoses:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {conditions.length > 0 ? (
                  conditions.map((c, i) => (
                    <Badge key={i} variant="primary">
                      {c}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No chronic conditions listed</span>
                )}
              </div>
            </div>

            {/* Allergies */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                Recorded Allergies (الرجی الرٹس):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {allergies.length > 0 ? (
                  allergies.map((a, i) => (
                    <Badge key={i} variant="emergency">
                      {a}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No drug allergies recorded</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Active Prescriptions */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-600" />
                Current Active Medications
              </CardTitle>
              <Link href="/meds" className="text-xs text-teal-600 hover:underline font-medium">
                Demystify
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {medications.length > 0 ? (
              <div className="space-y-2">
                {medications.map((m, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-slate-50 border border-slate-200/80 p-2.5 rounded-xl text-xs"
                  >
                    <span className="font-semibold text-slate-800">{m}</span>
                    <span className="text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200/60">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs italic space-y-1">
                <p>No active medications added to your memory profile.</p>
                <Link href="/profile" className="text-teal-600 not-italic font-semibold hover:underline">
                  Add Medications
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

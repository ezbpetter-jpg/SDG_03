"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Pill, MessageSquareHeart, FileText, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, HeartPulse } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export default function HomePage() {
  const { user, lang } = useUser();

  const isUrdu = lang === "ur";

  return (
    <div className="space-y-12 py-4">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>SDG 3 Hackathon Initiative • Minhaj University Lahore</span>
        </div>

        <div className="space-y-3 max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            TabeebCare <span className="text-teal-600 font-serif font-normal">(طبیب کیئر)</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            {isUrdu
              ? "پاکستانی مریضوں کے لیے نسخہ سمجھنے، علامات کے جائزے اور ڈاکٹر کے ہینڈ اوور کا آسان ترین AI پلیٹ فارم۔"
              : "AI-powered healthcare literacy, prescription demystifier, and clinical triage companion designed to bridge patient-doctor communication in Pakistan."}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all hover:gap-3"
            >
              <span>{isUrdu ? "ڈیش بورڈ پر جائیں" : "Go to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/login?demo=true"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-sm transition-all hover:shadow"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isUrdu ? "⚡ فوری جج ڈیمو لاگ ان" : "⚡ Instant Judge Demo"}</span>
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm shadow-xs transition-colors"
              >
                <span>{isUrdu ? "نیا اکاؤنٹ بنائیں" : "Create Account"}</span>
              </Link>
            </>
          )}
        </div>

        {/* Value Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            100% Free & Offline-Ready (SQLite)
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Evidence-Based WHO Triage RAG
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
            Sub-Second Groq Llama 3.1 Inference
          </span>
        </div>
      </section>

      {/* 3 Core Features Grid */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-slate-800">
            {isUrdu ? "طبیب کیئر کے بنیادی ماڈیولز" : "Core Patient Literacy Modules"}
          </h2>
          <p className="text-xs text-slate-500">
            {isUrdu ? "تین کلیدی مسائل کا مکمل اور فوری حل" : "Targeting the 3 biggest barriers in primary care outpatient journeys"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Medicine Demystifier */}
          <Card className="hover:border-teal-300 transition-all hover:shadow-md flex flex-col justify-between">
            <CardContent className="space-y-3 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200/80 text-teal-700 flex items-center justify-center">
                <Pill className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isUrdu ? "1. نسخہ و ادویات ڈیمسٹیفائر" : "1. Medicine Demystifier"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isUrdu
                  ? "نسخے کی پیچیدہ دواؤں کا نام درج کریں، اور صبح/دوپہر/شام/رات کا تصویری شیڈول، کھانے کی احتیاطیں اور الرجی الرٹ حاصل کریں۔"
                  : "Type prescribed medications to get an intuitive 24-hr visual schedule in English and Urdu, food rules, and allergy clash warnings."}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link
                href="/meds"
                className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline"
              >
                <span>{isUrdu ? "ادویات چیک کریں" : "Demystify Meds"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Card 2: Symptom Triage */}
          <Card className="hover:border-teal-300 transition-all hover:shadow-md flex flex-col justify-between">
            <CardContent className="space-y-3 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-700 flex items-center justify-center">
                <MessageSquareHeart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isUrdu ? "2. علامات ٹریآج و ایمرجنسی" : "2. Protocol Symptom Triage"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isUrdu
                  ? "اردو یا رومن اردو میں علامات بتائیں؛ سسٹم عالمی ادارہ صحت (WHO) کے پروٹوکول کے مطابق خطرے کی سطح (ایمرجنسی، ارجنٹ، روٹین) بتاتا ہے۔"
                  : "Conversational intake in English, Urdu, or Roman Urdu. Classifies severity into Emergency, Urgent, Routine, or Home Care with WHO protocols."}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link
                href="/triage"
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
              >
                <span>{isUrdu ? "علامات چیک کریں" : "Start Triage"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>

          {/* Card 3: Doctor Handover Card */}
          <Card className="hover:border-teal-300 transition-all hover:shadow-md flex flex-col justify-between">
            <CardContent className="space-y-3 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-700 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {isUrdu ? "3. ڈاکٹر ہینڈ اوور کارڈ (SBAR)" : "3. Doctor Handover Card"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isUrdu
                  ? "ایک کلک پر بین الاقوامی معیار کا کلینیکل سمری کارڈ جو ڈاکٹر کو 3 منٹ کی ملاقات میں مریض کی مکمل کیفیت فوری سمجھا دیتا ہے۔"
                  : "Auto-generates a standardized 1-page SBAR clinical handover card that the patient can print or show to save vital consultation time."}
              </p>
            </CardContent>
            <div className="p-6 pt-0">
              <Link
                href="/triage"
                className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:underline"
              >
                <span>{isUrdu ? "ہینڈ اوور کارڈ بنائیں" : "Generate SBAR Card"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Real-World Pakistani Context Banner */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5">
          <HeartPulse className="w-6 h-6 text-teal-600" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            {isUrdu ? "SDG 3 کے تحت پاکستان کا حقیقی مسئلہ" : "Real-World SDG 3 Challenge in Pakistan"}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-2xl font-extrabold text-teal-700">65%+</span>
            <p className="text-slate-700 font-semibold">Prescription Misunderstanding</p>
            <p className="text-slate-500">Patients struggle with illegible handwriting & complex English dosages.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-2xl font-extrabold text-teal-700">&lt; 3 Mins</span>
            <p className="text-slate-700 font-semibold">Average Consultation Time</p>
            <p className="text-slate-500">Overburdened clinics leave little time for thorough patient history intake.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-1">
            <span className="text-2xl font-extrabold text-teal-700">1122 Ready</span>
            <p className="text-slate-700 font-semibold">Zero-Delay Escalation</p>
            <p className="text-slate-500">Emergency red flags trigger hard warnings and direct local emergency dialer.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

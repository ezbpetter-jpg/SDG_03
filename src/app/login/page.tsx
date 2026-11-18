"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HeartPulse, Sparkles, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: isAuthLoading, login, lang } = useUser();
  const isUrdu = lang === "ur";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const demoTriggeredRef = useRef(false);

  const handleDemoLogin = useCallback(async () => {
    setIsDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user, data.profile);
        router.replace("/dashboard");
      } else {
        setError(data.error || "Failed to initialize demo login");
      }
    } catch {
      setError(
        isUrdu
          ? "ڈیمو لاگ ان میں نیٹ ورک کا مسئلہ پیش آیا"
          : "Network error while logging in as demo user"
      );
    } finally {
      setIsDemoLoading(false);
    }
  }, [isUrdu, login, router]);

  // Redirect already authenticated users to dashboard
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, user, router]);

  // Check if ?demo=true in URL (guarded against double invocation)
  useEffect(() => {
    if (
      !isAuthLoading &&
      !user &&
      searchParams.get("demo") === "true" &&
      !demoTriggeredRef.current
    ) {
      demoTriggeredRef.current = true;
      handleDemoLogin();
    }
  }, [isAuthLoading, user, searchParams, handleDemoLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        isUrdu
          ? "براہ کرم ای میل اور پاس ورڈ دونوں درج کریں"
          : "Please fill in both email and password"
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError(
        isUrdu
          ? "براہ کرم درست ای میل ایڈریس درج کریں"
          : "Please enter a valid email address"
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user, data.profile);
        router.replace("/dashboard");
      } else {
        setError(
          data.error ||
            (isUrdu ? "غلط ای میل یا پاس ورڈ" : "Invalid email or password")
        );
      }
    } catch {
      setError(
        isUrdu
          ? "نیٹ ورک میں خرابی پیش آئی ہے"
          : "An unexpected network error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || user) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
          <span>{isUrdu ? "لاگ ان پورٹل لوڈ ہو رہا ہے..." : "Loading login portal..."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto py-6 sm:py-10">
      <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="text-center pb-4 pt-6 sm:pt-8 bg-slate-50/50 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            {isUrdu ? "طبیب کیئر پورٹل میں خوش آمدید" : "Sign in to TabeebCare"}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {isUrdu
              ? "اپنے اکاؤنٹ یا جج ڈیمو موڈ کے ذریعے لاگ ان کریں"
              : "Access your patient profile and clinical triage"}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-5">
          {/* 1-Click Judge Demo Login Button */}
          <div className="bg-teal-50/80 border border-teal-200 rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-900">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                {isUrdu ? "ہیکاتھون جج / تشخیصی موڈ" : "Hackathon Evaluator / Demo"}
              </span>
              <span className="text-[10px] uppercase font-bold bg-teal-200 text-teal-900 px-2 py-0.5 rounded-full">
                1-Click
              </span>
            </div>
            <p className="text-[11px] text-teal-800 leading-relaxed">
              {isUrdu
                ? "احمد خان (54 سالہ، ذیابیطس، ہائی بلڈ پریشر، پینسلین الرجی) کے پہلے سے تیار پروفائل کے ساتھ فوراً شروع کریں۔"
                : "Instantly login as Ahmad Khan (54yo, Diabetes, Hypertension, Penicillin & Sulfa allergy)."}
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDemoLogin}
              isLoading={isDemoLoading}
              disabled={isLoading}
              className="w-full font-bold shadow-xs gap-1.5 bg-teal-600 hover:bg-teal-700"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isUrdu ? "فوری ڈیمو لاگ ان (احمد خان)" : "Quick Demo Login (Ahmad Khan)"}</span>
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-medium whitespace-nowrap">
              {isUrdu ? "یا ای میل سے لاگ ان کریں" : "Or standard login"}
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label={isUrdu ? "ای میل ایڈریس" : "Email Address"}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. patient@example.com"
              required
            />

            <div className="relative">
              <Input
                label={isUrdu ? "پاس ورڈ" : "Password"}
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-[30px] p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="outline"
              size="md"
              isLoading={isLoading}
              disabled={isDemoLoading}
              className="w-full font-bold gap-2"
            >
              <LogIn className="w-4 h-4 text-teal-600" />
              <span>{isUrdu ? "لاگ ان کریں" : "Sign In with Credentials"}</span>
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 pt-2">
            {isUrdu ? "اکاؤنٹ نہیں ہے؟ " : "Don't have an account? "}
            <Link href="/signup" className="text-teal-700 font-bold hover:underline">
              {isUrdu ? "نیا اکاؤنٹ بنائیں" : "Sign Up"}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[40vh] text-slate-400 text-sm">
          Loading login portal...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

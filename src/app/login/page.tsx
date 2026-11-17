"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { HeartPulse, Sparkles, LogIn } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if ?demo=true in URL
  useEffect(() => {
    if (searchParams.get("demo") === "true") {
      handleDemoLogin();
    }
  }, [searchParams]);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/demo", {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user, data.profile);
        router.push("/dashboard");
      } else {
        setError(data.error || "Failed to initialize demo login");
      }
    } catch {
      setError("Network error while logging in as demo user");
    } finally {
      setIsDemoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in both email and password");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        login(data.user);
        router.push("/dashboard");
      } else {
        setError(data.error || "Invalid email or password");
      }
    } catch {
      setError("An unexpected network error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2 shadow-xs">
            <HeartPulse className="w-6 h-6" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Welcome to TabeebCare
          </CardTitle>
          <CardDescription>
            طبیب کیئر پورٹل میں لاگ ان کریں
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* 1-Click Judge Demo Login Button */}
          <div className="bg-teal-50/70 border border-teal-200/90 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-teal-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-teal-600" />
                Hackathon Judge / Evaluator Mode
              </span>
              <span className="text-[10px] uppercase font-bold bg-teal-200/80 text-teal-800 px-1.5 py-0.5 rounded">
                1-Click
              </span>
            </div>
            <p className="text-xs text-teal-700 leading-relaxed">
              Instantly log in as <strong>Ahmad Khan (54yo, Diabetes + Hypertension, Sulfa Allergy)</strong> without entering credentials.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleDemoLogin}
              isLoading={isDemoLoading}
              className="w-full bg-teal-700 hover:bg-teal-800 font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              ⚡ Instant Judge Demo Login
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-xs text-slate-400 uppercase font-medium">
              or standard login
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-lg leading-relaxed">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              <LogIn className="w-4 h-4 mr-1.5" />
              Sign In (لاگ ان)
            </Button>
          </form>

          {/* Footer note */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-teal-600 hover:text-teal-700 hover:underline"
            >
              Create Account (نیا اکاؤنٹ بنائیں)
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { HeartPulse, Pill, MessageSquareHeart, UserCheck, LogOut, Sparkles } from "lucide-react";
import clsx from "clsx";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, lang, setLang } = useUser();

  const isAuthPage = pathname === "/login" || pathname === "/signup";

  const navLinks = [
    { href: "/dashboard", label: lang === "ur" ? "ڈیش بورڈ" : "Dashboard", icon: HeartPulse },
    { href: "/meds", label: lang === "ur" ? "دوائیں" : "Check Meds", icon: Pill },
    { href: "/triage", label: lang === "ur" ? "علامات ٹریآج" : "Symptom Triage", icon: MessageSquareHeart },
    { href: "/profile", label: lang === "ur" ? "پروفائل" : "Health Profile", icon: UserCheck },
  ];

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-slate-800 text-base leading-tight tracking-tight flex items-center gap-1.5">
              TabeebCare
              <span className="text-xs font-normal text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/60">
                SDG 3
              </span>
            </span>
            <span className="text-xs text-slate-400 font-medium">طبیب کیئر • AI صحت گائیڈ</span>
          </div>
        </Link>

        {/* Navigation links (when logged in or on feature pages) */}
        {user && !isAuthPage && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={clsx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    isActive
                      ? "bg-teal-50 text-teal-700 border border-teal-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right tools: Language toggle & User profile / Auth */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === "en" ? "ur" : "en")}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            title="Switch Language (اردو / English)"
          >
            <span className={clsx("transition-opacity", lang === "ur" ? "text-teal-700 font-bold" : "text-slate-500")}>
              اردو
            </span>
            <span className="text-slate-300">|</span>
            <span className={clsx("transition-opacity", lang === "en" ? "text-teal-700 font-bold" : "text-slate-500")}>
              EN
            </span>
          </button>

          {/* User Status */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200/80 hover:bg-slate-200/70 transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
                {user.isDemo && (
                  <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-100/80 px-1 rounded">
                    Demo
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {lang === "ur" ? "لاگ ان" : "Sign In"}
                </Link>
                <Link
                  href="/login?demo=true"
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {lang === "ur" ? "ڈیمو لاگ ان" : "Demo Mode"}
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}

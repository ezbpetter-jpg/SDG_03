import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InitialSplashLoader } from "@/components/layout/InitialSplashLoader";
import "./globals.css";

export const metadata: Metadata = {
  title: "TabeebCare (طبیب کیئر) — AI Health Literacy & Clinical Triage (SDG 3)",
  description:
    "AI-powered prescription demystifier, symptom triage, and doctor clinical handover companion tailored for Pakistani patients under UN SDG 3.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
        <InitialSplashLoader />
        <UserProvider>
          <Navbar />
          <main className="flex-1 max-w-[1600px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            {children}
          </main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}

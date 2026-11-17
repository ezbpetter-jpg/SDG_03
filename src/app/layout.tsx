import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { Navbar } from "@/components/layout/Navbar";
import { MedicalDisclaimerFooter } from "@/components/layout/MedicalDisclaimer";
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
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
        <UserProvider>
          <Navbar />
          <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
            {children}
          </main>
          <MedicalDisclaimerFooter />
        </UserProvider>
      </body>
    </html>
  );
}

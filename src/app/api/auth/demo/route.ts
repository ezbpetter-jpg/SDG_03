import { NextResponse } from "next/server";

export async function POST() {
  const demoUser = {
    id: 999,
    name: "Ahmad Khan (احمد خان)",
    email: "ahmad.demo@tabeebcare.pk",
    isDemo: true,
  };

  const demoProfile = {
    age: 54,
    gender: "Male",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    allergies: ["Sulfa", "Penicillin"],
    current_medications: ["Metformin 500mg", "Amlodipine 5mg"],
  };

  return NextResponse.json({
    success: true,
    user: demoUser,
    profile: demoProfile,
  });
}

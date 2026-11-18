import { NextResponse } from "next/server";
import { DEMO_PROFILE, DEMO_USER, setSessionCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    user: DEMO_USER,
    profile: DEMO_PROFILE,
  });

  setSessionCookie(response, DEMO_USER);
  return response;
}

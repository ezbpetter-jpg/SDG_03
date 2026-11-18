import { NextResponse } from "next/server";
import {
  DEMO_PROFILE,
  DEMO_USER,
  SessionConfigError,
  setSessionCookie,
} from "@/lib/auth";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        success: true,
        user: DEMO_USER,
        profile: DEMO_PROFILE,
      },
      { headers: NO_STORE_HEADERS }
    );

    setSessionCookie(response, DEMO_USER);
    return response;
  } catch (error: unknown) {
    if (error instanceof SessionConfigError) {
      return NextResponse.json(
        { error: error.message },
        { status: 503, headers: NO_STORE_HEADERS }
      );
    }
    return NextResponse.json(
      { error: "Failed to initialize demo session." },
      { status: 500, headers: NO_STORE_HEADERS }
    );
  }
}

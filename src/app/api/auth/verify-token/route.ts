import { verifyOtp } from "@/features/auth/actions/verify-otp";
import { routeRedirect } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);

  const token_hash = searchParams.get("token_hash");

  if (token_hash?.startsWith("pkce_")) {
    const res = await verifyOtp({ token_hash });

    if (!res?.error) return routeRedirect(request);
  }

  return NextResponse.redirect(`${origin}/auth/code-error`);
}

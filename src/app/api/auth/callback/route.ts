import { routeRedirect } from "@/lib/utils";
import { createClient } from "@/services/supabase/server/supabase";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);

  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) return routeRedirect(request);
  }

  return NextResponse.redirect(`${origin}/auth/code-error`);
}

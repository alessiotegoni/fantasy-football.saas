import { createServerClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";
import { match } from "path-to-regexp";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, supabase, supabaseResponse };
}

export function createRouteMatcher<T extends string>(patterns: T[]) {
  const matchers = patterns.map((pattern) =>
    match(pattern, { decode: decodeURIComponent })
  );

  return (request: NextRequest): boolean => {
    const url = new URL(request.url);
    return matchers.some((fn) => !!fn(url.pathname));
  };
}

export async function isAdmin(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
) {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", userId);

  return !!data?.[0] && !error;
}

export async function getRedirectUrl(request: NextRequest, url: string = "/") {
  const referer = request.headers.get("referer");
  if (referer) return referer;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = url;

  return redirectUrl;
}

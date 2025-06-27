import { clsx, type ClassValue } from "clsx";
import { NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createRouteMatcher<T extends string>(patterns: T[]) {
  const matchers = patterns.map(pattern =>
    match(pattern, { decode: decodeURIComponent })
  );

  return (request: NextRequest): boolean => {
    return matchers.some(matcher => !!matcher(request.nextUrl.pathname));
  };
}

export function routeRedirect(request: Request, defaultRedirect = "/") {
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || defaultRedirect;
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  const origin = isLocalEnv
    ? url.origin
    : forwardedHost
      ? `https://${forwardedHost}`
      : url.origin;

  return NextResponse.redirect(`${origin}${next}`);
}

export function getRedirectUrl(request: NextRequest, defaultPath = "/"): URL {
  const referer = request.headers.get("referer");

  if (referer && referer !== request.url) {
    return new URL(referer);
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = defaultPath;
  return redirectUrl;
}

export function getUrl(pathname = "/"): string {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";

  const url = baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`;
  const normalizedUrl = url.endsWith("/") ? url : `${url}/`;

  return new URL(pathname, normalizedUrl).toString();
}

export function getItemHref(href: string, leagueId: string): string {
  return href.replace(":leagueId", leagueId);
}

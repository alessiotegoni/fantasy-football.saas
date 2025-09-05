import { NextRequest, NextResponse } from "next/server";
import { UrlObject } from "url";

export type ErrorResult = {
  error: true;
  message: string;
  data: null;
};

export type SuccessResult<T = {}> = {
  error: false;
  message: string;
  data: T;
};

export function createError(message: string): ErrorResult {
  return {
    error: true,
    message,
    data: null,
  };
}

export function createSuccess<T>(message = "", data: T): SuccessResult<T> {
  return {
    error: false,
    message,
    data,
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

export type Href = __next_route_internal_types__.RouteImpl<string>;

export function getItemHref(href: Href, leagueId: string) {
  return href.replace(":leagueId", leagueId) as Href;
}

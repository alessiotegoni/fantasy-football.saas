import { clsx, type ClassValue } from "clsx";
import { NextRequest, NextResponse } from "next/server";
import { match } from "path-to-regexp";
import { ExternalToast, toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function actionToast(
  { error, message }: { error: boolean; message: string },
  toastData?: ExternalToast
) {
  const variant = error ? "error" : "success";

  return toast[variant](message, toastData);
}

export function getErrorObject(
  message = "Errore nell'esecuzione dell'operazione"
) {
  return { error: true, message };
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

export function routeRedirect(request: Request, defaultRedirect = "/") {
  const { origin, searchParams } = new URL(request.url);

  const next = searchParams.get("next") ?? defaultRedirect;

  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  let response: NextResponse;

  if (isLocalEnv) {
    response = NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    response = NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    response = NextResponse.redirect(`${origin}${next}`);
  }

  return response;
}

export async function getRedirectUrl(request: NextRequest, url: string = "/") {
  const referer = request.headers.get("referer");

  if (referer && referer !== request.url) return referer;

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = url;

  return redirectUrl;
}

export function getUrl(pathname = "/") {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return new URL(pathname, url).toString();
}

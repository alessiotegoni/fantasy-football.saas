import { clsx, type ClassValue } from "clsx";
import { NextResponse } from "next/server";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export function getUrl(pathname = "/") {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ??
    process?.env?.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000/";

  url = url.startsWith("http") ? url : `https://${url}`;
  url = url.endsWith("/") ? url : `${url}/`;

  return new URL(pathname, url).toString();
}

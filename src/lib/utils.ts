import { clsx, type ClassValue } from "clsx";
import { NextRequest } from "next/server";
import { match } from "path-to-regexp";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createRouteMatcher<T extends string>(patterns: T[]) {
  const matchers = patterns.map((pattern) => match(pattern));

  return (request: NextRequest): boolean => {
    return matchers.some((matcher) => !!matcher(request.nextUrl.pathname));
  };
}

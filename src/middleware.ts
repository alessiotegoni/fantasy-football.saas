import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher } from "./lib/utils";
import {
  addUserLastLeagueMetadata,
  getCanRedirectUserToLeague,
  canAccessLeague,
  isAdmin,
} from "./features/users/utils/user";
import { getRedirectUrl } from "./utils/helpers";

const ROUTE_MATCHERS = {
  auth: createRouteMatcher(["/auth/*rest"]),
  admin: createRouteMatcher(["/admin"]),
  private: createRouteMatcher([
    "/",
    "/leagues/create",
    "/leagues/join",
    "/leagues/join/*rest",
  ]),
  league: createRouteMatcher(["/leagues/*rest"]),
} as const;

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (ROUTE_MATCHERS.auth(request) && user) {
    return NextResponse.redirect(getRedirectUrl(request));
  }

  if (ROUTE_MATCHERS.private(request)) {
    const privateRouteResponse = await handlePrivateRoute(request, user);
    if (privateRouteResponse) return privateRouteResponse;
  }

  if (ROUTE_MATCHERS.league(request) && !ROUTE_MATCHERS.private(request)) {
    const leagueRouteResponse = await handleLeagueRoute(request, user);
    if (leagueRouteResponse) return leagueRouteResponse;
  }

  if (ROUTE_MATCHERS.admin(request) && user) {
    const isUserAdmin = await isAdmin(supabase, user.id);
    if (!isUserAdmin) {
      return NextResponse.redirect(getRedirectUrl(request));
    }
  }

  return supabaseResponse;
}

async function handlePrivateRoute(request: NextRequest, user: any) {
  if (!user) {
    const { pathname, search } = request.nextUrl;
    const redirectTo = encodeURIComponent(`${pathname}${search}`);
    return NextResponse.redirect(
      new URL(`/auth/login?next=${redirectTo}`, request.nextUrl)
    );
  }

  const { isRedirectable, redirectUrl } = getCanRedirectUserToLeague(
    request,
    user
  );
  return isRedirectable ? NextResponse.redirect(redirectUrl) : null;
}

async function handleLeagueRoute(request: NextRequest, user: any) {
  const leagueId = extractLeagueId(request.nextUrl.pathname);

  if (!user || !leagueId || !(await canAccessLeague(user, leagueId))) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  addUserLastLeagueMetadata(user, leagueId).catch(console.error);

  return null;
}

function extractLeagueId(pathname: string): string | null {
  const segments = pathname.split("/");
  return segments[2] || null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

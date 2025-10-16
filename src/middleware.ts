import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher } from "./lib/utils";
import {
  addUserLastLeagueMetadata,
  getCanRedirectUserToLeague,
  canAccessLeague,
} from "./features/dashboard/user/utils/user";
import { handleDashboardRoute } from "./features/dashboard/user/utils/roles";
import { getRedirectUrl } from "./utils/helpers";
import { User } from "@supabase/supabase-js";

const ROUTE_MATCHERS = {
  home: createRouteMatcher(["/"]),
  auth: createRouteMatcher(["/auth/*rest"]),
  private: createRouteMatcher(["/players/*rest"]),
  dashboard: createRouteMatcher(["/dashboard", "/dashboard/*rest"]),
  league: createRouteMatcher(["/league/*rest"]),
} as const;

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (ROUTE_MATCHERS.home(request) && user) {
    const { isRedirectable, redirectUrl } = getCanRedirectUserToLeague(
      request,
      user
    );
    if (isRedirectable) return NextResponse.redirect(redirectUrl);
  }

  if (ROUTE_MATCHERS.auth(request) && user) {
    return NextResponse.redirect(getRedirectUrl(request));
  }

  if (ROUTE_MATCHERS.private(request) && !user) {
    return NextResponse.redirect(getRedirectUrl(request, "/auth/login"));
  }

  if (ROUTE_MATCHERS.league(request)) {
    const leagueRouteResponse = await handleLeagueRoute(request, user);
    if (leagueRouteResponse) return leagueRouteResponse;
  }

  if (ROUTE_MATCHERS.dashboard(request)) {
    const dashboardResponse = await handleDashboardRoute(
      request,
      user,
      supabase
    );
    if (dashboardResponse) return dashboardResponse;
  }

  return supabaseResponse;
}

async function handleLeagueRoute(request: NextRequest, user: User | null) {
  const leagueId = request.nextUrl.pathname.split("/")[2];

  if (!user || !leagueId || !canAccessLeague(user, leagueId)) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  addUserLastLeagueMetadata(user, leagueId).catch(console.error);

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

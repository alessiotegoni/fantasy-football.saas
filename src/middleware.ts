import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher } from "./lib/utils";
import {
  addUserLastLeagueMetadata,
  canAccessLeague,
  isAdmin,
} from "./features/users/utils/user";
import { getRedirectUrl } from "./utils/helpers";

const ROUTE_MATCHERS = {
  auth: createRouteMatcher(["/auth/*rest"]),
  dashboard: createRouteMatcher(["/dashboard/*rest"]),
  league: createRouteMatcher(["/league/*rest"]),
} as const;

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  if (ROUTE_MATCHERS.auth(request) && user) {
    return NextResponse.redirect(getRedirectUrl(request));
  }

  if (ROUTE_MATCHERS.league(request)) {
    const leagueRouteResponse = await handleLeagueRoute(request, user);
    if (leagueRouteResponse) return leagueRouteResponse;
  }

  if (ROUTE_MATCHERS.dashboard(request) && user) {
    const isUserAdmin = await isAdmin(supabase, user.id);
    if (!isUserAdmin) {
      return NextResponse.redirect(getRedirectUrl(request));
    }
  }

  // if (ROUTE_MATCHERS.content_creator(request) && user) {
  //   const isUserContentCreator = await isContentCreator(supabase, user.id);
  //   if (!isUserContentCreator) {
  //     return NextResponse.redirect(getRedirectUrl(request));
  //   }
  // }

  // if (ROUTE_MATCHERS.redaction(request) && user) {
  //   const isUserRedaction = await isRedaction(supabase, user.id);
  //   if (!isUserRedaction) {
  //     return NextResponse.redirect(getRedirectUrl(request));
  //   }
  // }

  return supabaseResponse;
}

async function handleLeagueRoute(request: NextRequest, user: any) {
  const leagueId = request.nextUrl.pathname.split("/")[2];

  if (!user || !leagueId || !(await canAccessLeague(user, leagueId))) {
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

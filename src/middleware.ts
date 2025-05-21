import { NextResponse, type NextRequest } from "next/server";
import { isAdmin, updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher, getRedirectUrl } from "./lib/utils";
import { User } from "@supabase/supabase-js";

const isAuthRoute = createRouteMatcher(["/auth/*rest"]);
const isAdminRoute = createRouteMatcher(["/admin"]);
const isPrivateRoute = createRouteMatcher(["/", "/leagues/*rest"]);
const isLeagueRoute = createRouteMatcher(["/leagues/:leagueId/*rest"]);

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  console.log(user?.email);

  if (isAuthRoute(request) && user) {
    const url = await getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  if (isPrivateRoute(request) && !user) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }

  if (isLeagueRoute(request) && !canAccessLeague(request, user)) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (isAdminRoute(request) && user && !(await isAdmin(supabase, user.id))) {
    const url = await getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

function canAccessLeague(request: NextRequest, user: User | null) {
  if (!user) return false;

  const leagueId = request.nextUrl.pathname.split("/")[2];
  const userLeagueIds = user.user_metadata?.league_ids as string[] | undefined;

  return userLeagueIds?.includes(leagueId);
}

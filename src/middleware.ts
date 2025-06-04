import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher, getRedirectUrl } from "./lib/utils";
import { User } from "@supabase/supabase-js";
import {
  addUserLastLeagueMetadata,
  getCanRedirectUserToLeague,
  getMetadataFromUser,
  isAdmin,
} from "./features/users/utils/user";

const isAuthRoute = createRouteMatcher(["/auth/*rest"]);
const isAdminRoute = createRouteMatcher(["/admin"]);
const isPrivateRoute = createRouteMatcher([
  "/",
  "/leagues/create",
  "/leagues/join",
  "/leagues/join/*rest",
]);
const isLeagueRoute = createRouteMatcher(["/leagues/*rest"]);

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  console.log(user?.email);

  if (isAuthRoute(request) && user) {
    const url = getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  if (isPrivateRoute(request)) {
    if (!user) {
      const { pathname, search } = request.nextUrl;
      const redirectTo = `${pathname}${search}`;

      return NextResponse.redirect(
        new URL(`/auth/login?next=${redirectTo}`, request.nextUrl)
      );
    }
    const { isRedirectable, redirectUrl } = getCanRedirectUserToLeague(
      request,
      user
    );

    if (isRedirectable) return NextResponse.redirect(redirectUrl);
  }

  if (isLeagueRoute(request) && !isPrivateRoute(request)) {
    const leagueId = request.nextUrl.pathname.split("/")[2];

    if (!user || !canAccessLeague(user, leagueId)) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    addUserLastLeagueMetadata(user, leagueId);
  }

  if (isAdminRoute(request) && user && !(await isAdmin(supabase, user.id))) {
    const url = getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

function canAccessLeague(user: User, leagueId: string) {
  const { league_ids } = getMetadataFromUser(user)
  return league_ids?.includes(leagueId);
}

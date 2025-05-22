import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./services/supabase/utils/supabase";
import { createRouteMatcher, getRedirectUrl } from "./lib/utils";
import { User } from "@supabase/supabase-js";
import {
  addUserLastLeagueMetadata,
  getUserMetadata,
  isAdmin,
} from "./features/users/utils/user";

const isAuthRoute = createRouteMatcher(["/auth/*rest"]);
const isAdminRoute = createRouteMatcher(["/admin"]);
const isPrivateRoute = createRouteMatcher([
  "/",
  "/leagues/create",
  "/leagues/join",
]);
const isLeagueRoute = createRouteMatcher(["/leagues/*rest"]);

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

  if (isLeagueRoute(request) && !isPrivateRoute(request)) {
    const leagueId = request.nextUrl.pathname.split("/")[2];

    if (!user || !canAccessLeague(user, leagueId)) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    
    addUserLastLeagueMetadata(user, leagueId);
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

function canAccessLeague(user: User, leagueId: string) {
  const userLeagueIds = getUserMetadata(user, "league_ids");
  return userLeagueIds?.includes(leagueId);
}

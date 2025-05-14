import { NextResponse, type NextRequest } from "next/server";
import {
  createRouteMatcher,
  getRedirectUrl,
  isAdmin,
  updateSession,
} from "./services/supabase/utils/supabase";

const isAuthRoute = createRouteMatcher(["/login", "/verify"]);
const isAdminRoute = createRouteMatcher(["/admin"]);
const isPrivateRoute = createRouteMatcher(["/leagues"]);

export async function middleware(request: NextRequest) {
  const { user, supabase, supabaseResponse } = await updateSession(request);

  console.log(user, supabaseResponse);

  if (isAdminRoute(request) && user && !(await isAdmin(supabase, user.id))) {
    const url = await getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute(request) && user) {
    const url = await getRedirectUrl(request);
    return NextResponse.redirect(url);
  }

  if (isPrivateRoute(request) && !user) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

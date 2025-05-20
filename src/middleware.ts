import { NextResponse, type NextRequest } from "next/server";
import {
  createRouteMatcher,
  getRedirectUrl,
  isAdmin,
  updateSession,
} from "./services/supabase/utils/supabase";

const isAuthRoute = createRouteMatcher(["/auth/*rest"]);
const isAdminRoute = createRouteMatcher(["/admin"]);
const isPrivateRoute = createRouteMatcher(["/", "/leagues/*rest"]);

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

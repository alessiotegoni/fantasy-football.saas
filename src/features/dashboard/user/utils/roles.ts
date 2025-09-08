import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { getRedirectUrl } from "@/utils/helpers";

type RoleCheck = (
  supabase: SupabaseClient<any, "public", any>,
  userId: string
) => Promise<boolean>;

const roleChecks: Record<string, RoleCheck> = {
  admin: isAdmin,
  "content-creator": isContentCreator,
  redaction: isRedaction,
};

export async function handleDashboardRoute(
  request: NextRequest,
  user: User | null,
  supabase: SupabaseClient<any, "public", any>
) {
  const pathname = request.nextUrl.pathname;
  const role = pathname.split("/")[2];

  if (user) {
    if (pathname === "/dashboard" || role === "user") return null;

    const checkRole = roleChecks[role];

    if (checkRole) {
      const hasPermission = await checkRole(supabase, user.id);
      if (hasPermission) return null;
    }
  }

  return NextResponse.redirect(getRedirectUrl(request));
}

export async function isAdmin(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("admins")
    .select("*")
    .eq("user_id", userId)
    .single();

  return !!data;
}

export async function isContentCreator(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("content_creators")
    .select("*")
    .eq("user_id", userId)
    .single();

  return !!data;
}

export async function isRedaction(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  const { data } = await supabase
    .from("redactions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return !!data;
}

export const roles = ["superadmin", "admin", "content-creator", "redaction"] as const
export type Role = (typeof roles)[number];

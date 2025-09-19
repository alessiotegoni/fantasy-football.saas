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
    if (pathname === "/dashboard" || role === "user" || isSuperadmin(user.id)) {
      return null;
    }

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
  if (isSuperadmin(userId)) return true;

  const { count } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count ?? 0) > 0;
}

export async function isContentCreator(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  if (isSuperadmin(userId)) return true;

  const { count } = await supabase
    .from("content_creators")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count ?? 0) > 0;
}

export async function isRedaction(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  if (isSuperadmin(userId)) return true;

  const { count } = await supabase
    .from("redactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  return (count ?? 0) > 0;
}

export function isSuperadmin(userId: string) {
  return process.env.SUPERADMIN_ID === userId;
}

export const roles = [
  "superadmin",
  "admin",
  "content-creator",
  "redaction",
] as const;
export type Role = (typeof roles)[number];

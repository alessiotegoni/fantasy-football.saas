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
    if (role === "user") return null

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
  const { count, error } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true })
    .eq("id", userId);

  if (error) {
    console.error("Error checking admin status:", error);
    return false;
  }

  return count !== null && count > 0;
}

export async function isContentCreator(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("content_creators")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking content creator status:", error);
    return false;
  }

  return count !== null && count > 0;
}

export async function isRedaction(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("redactions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    console.error("Error checking redaction status:", error);
    return false;
  }

  return count !== null && count > 0;
}

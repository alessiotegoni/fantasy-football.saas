import {
  createAdminClient,
  createClient,
} from "@/services/supabase/server/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

type UserMetadata = {
  league_ids?: string[];
  last_league_id?: string;
  avatar_url?: string
  name?: string
};

export const getMetadata = (user: User): UserMetadata => user.user_metadata;

export function getUserMetadata<T extends keyof UserMetadata>(
  user: User,
  metadata: T
) {
  const userMetadata = getMetadata(user);
  return userMetadata[metadata];
}

export async function addUserMetadata(user: User, metadata: UserMetadata) {
  const supabase = await createAdminClient();
  return supabase.auth.admin.updateUserById(user.id, {
    user_metadata: { ...user.user_metadata, ...metadata },
  });
}

export async function addUserLeaguesMetadata(user: User, leagueId: string) {
  const currentLeagues = getUserMetadata(user, "league_ids");
  const updatedLeagues = [...new Set([...(currentLeagues ?? []), leagueId])];
  await addUserMetadata(user, {
    league_ids: updatedLeagues,
  });
}

export async function addUserLastLeagueMetadata(user: User, leagueId: string) {
  const lastLeagueId = getUserMetadata(user, "last_league_id");
  if (lastLeagueId === leagueId) return;

  await addUserMetadata(user, {
    last_league_id: leagueId,
  });
}

export async function isAdmin(
  supabase: SupabaseClient<any, "public", any>,
  userId: string
) {
  const { data, error } = await supabase
    .from("admins")
    .select("*")
    .eq("id", userId);

  return !!data?.[0] && !error;
}

export function getCanRedirectUserToLeague(request: NextRequest, user: User) {
  const isInHomePage = request.nextUrl.pathname === "/";
  const preventRedirect = request.nextUrl.searchParams.get("preventRedirect");
  const userLastLeagueId = getUserMetadata(user, "last_league_id");

  return {
    isRedirectable: isInHomePage && !!userLastLeagueId && !preventRedirect,
    redirectUrl: new URL(`/leagues/${userLastLeagueId}`, request.nextUrl),
  };
}

export function getUserId() {
  return getUser().then((user) => user?.id);
}

export async function getUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return data.user;
}

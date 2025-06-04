import { MemberActionArgs } from "@/features/leagueMembers/permissions/leagueMember";
import {
  createAdminClient,
  createClient,
} from "@/services/supabase/server/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

type UserMetadata = {
  league_ids?: string[];
  last_league_id?: string | null;
  avatar_url?: string;
  name?: string;
};

export function getMetadataFromUser(user: User): UserMetadata {
  return user.user_metadata;
}

export async function getMetadataFromUserId(
  userId: string
): Promise<UserMetadata> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data.user) throw new Error(`User with id: ${userId} not found`);
  return data.user.user_metadata;
}

export async function setUserMetadata(
  userId: string,
  user_metadata: UserMetadata
) {
  const supabase = await createAdminClient();
  return supabase.auth.admin.updateUserById(userId, {
    user_metadata,
  });
}

export async function addUserLeaguesMetadata(user: User, leagueId: string) {
  const userMetadata = getMetadataFromUser(user);
  const updatedLeagues = [
    ...new Set([...(userMetadata.league_ids ?? []), leagueId]),
  ];

  return await setUserMetadata(user.id, {
    ...userMetadata,
    league_ids: updatedLeagues,
  });
}

export async function removeUserLeagueMetadata({
  userId,
  leagueId,
}: Pick<MemberActionArgs, "leagueId" | "userId">) {
  const userMetadata = await getMetadataFromUserId(userId);

  const league_ids = userMetadata.league_ids?.filter((id) => id !== leagueId);
  const last_league_id = league_ids?.find(() => true) || null;

  const updatedMetadata: UserMetadata = {
    ...userMetadata,
    league_ids,
    last_league_id,
  };

  return await setUserMetadata(userId, updatedMetadata);
}

export async function addUserLastLeagueMetadata(user: User, leagueId: string) {
  const userMetadata = getMetadataFromUser(user);
  if (userMetadata.last_league_id === leagueId) return;

  return await setUserMetadata(user.id, {
    ...userMetadata,
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
  const { last_league_id } = getMetadataFromUser(user);

  return {
    isRedirectable: isInHomePage && !!last_league_id && !preventRedirect,
    redirectUrl: new URL(`/leagues/${last_league_id}`, request.nextUrl),
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

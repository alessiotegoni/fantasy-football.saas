import {
  createAdminClient,
  createClient,
} from "@/services/supabase/server/supabase";
import { SupabaseClient, User } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export interface UserMetadata {
  league_ids?: string[];
  last_league_id?: string | null;
  avatar_url?: string;
  name?: string;
}

export function getMetadataFromUser(user: User): UserMetadata {
  return user.user_metadata || {};
}

export async function getMetadataFromUserId(
  userId: string
): Promise<UserMetadata> {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.auth.admin.getUserById(userId);

  if (error || !data.user) {
    throw new Error(`User with id: ${userId} not found`);
  }

  return data.user.user_metadata || {};
}

export async function setUserMetadata(userId: string, metadata: UserMetadata) {
  const supabase = await createAdminClient();
  return supabase.auth.admin.updateUserById(userId, {
    user_metadata: metadata,
  });
}

export async function canAccessLeague(
  user: User,
  leagueId: string
): Promise<boolean> {
  if (!leagueId) return false;

  const { league_ids } = getMetadataFromUser(user);
  return league_ids?.includes(leagueId) ?? false;
}

export async function addUserLeaguesMetadata(user: User, leagueId: string) {
  const userMetadata = getMetadataFromUser(user);
  const currentLeagues = userMetadata.league_ids ?? [];

  const updatedLeagues = Array.from(new Set([...currentLeagues, leagueId]));

  return setUserMetadata(user.id, {
    ...userMetadata,
    league_ids: updatedLeagues,
  });
}

export async function removeUserLeagueMetadata({
  userId,
  leagueId,
}: {
  userId: string;
  leagueId: string;
}) {
  const userMetadata = await getMetadataFromUserId(userId);
  const league_ids =
    userMetadata.league_ids?.filter((id) => id !== leagueId) ?? [];

  const updatedMetadata: UserMetadata = {
    ...userMetadata,
    league_ids,
    last_league_id: league_ids[0] || null,
  };

  return setUserMetadata(userId, updatedMetadata);
}

export async function addUserLastLeagueMetadata(user: User, leagueId: string) {
  const userMetadata = getMetadataFromUser(user);

  if (userMetadata.last_league_id === leagueId) return;

  return setUserMetadata(user.id, {
    ...userMetadata,
    last_league_id: leagueId,
  });
}

export function getCanRedirectUserToLeague(request: NextRequest, user: User) {
  const isHomePage = request.nextUrl.pathname === "/";
  const preventRedirect = request.nextUrl.searchParams.has("preventRedirect");
  const { last_league_id } = getMetadataFromUser(user);

  return {
    isRedirectable: isHomePage && !!last_league_id && !preventRedirect,
    redirectUrl: new URL(`/leagues/${last_league_id}`, request.nextUrl),
  };
}

export async function getUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserId(): Promise<string | undefined> {
  const user = await getUser();
  return user?.id;
}

import { Calendar, UserXmark } from "iconoir-react";
import { Button } from "@/components/ui/button";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getLeagueBansTag } from "@/features/league/leagues/db/cache/league";
import { db } from "@/drizzle/db";
import { leagueUserBans } from "@/drizzle/schema";
import { authUsers } from "drizzle-orm/supabase";
import { eq } from "drizzle-orm";
import ActionButton from "@/components/ActionButton";
import { unBanMember } from "../actions/memberActions";

export default async function BannedUsersSection({
  leagueId,
}: {
  leagueId: string;
}) {
  const bannedUsers = await getLeagueBans(leagueId);
  if (!bannedUsers.length) return null;

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <UserXmark className="size-5 text-red-600" />
        <h2 className="text-lg font-heading text-foreground">
          Utenti Bannati
          <span className="ml-2">({bannedUsers.length})</span>
        </h2>
      </div>

      <div className="space-y-3">
        {bannedUsers.map((bannedUser) => (
          <div
            key={bannedUser.banId}
            className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800"
          >
            <div className="flex-1">
              <p className="font-medium text-foreground truncate">
                {bannedUser.user?.email}
              </p>

              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Bannato il {bannedUser.bannedAt.toLocaleDateString("it-IT")}
                </p>
              </div>

              {bannedUser.reason && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Motivo: {bannedUser.reason}
                </p>
              )}
            </div>

            <ActionButton
              className="w-fit border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950/20 bg-transparent"
              action={unBanMember.bind(null, {
                userId: bannedUser.user!.id,
                leagueId,
                banId: bannedUser.banId,
              })}
              loadingText="Sbanno utente"
            >
              Sbanna
            </ActionButton>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getLeagueBans(leagueId: string) {
  "use cache";
  cacheTag(getLeagueBansTag(leagueId));

  return db
    .select({
      banId: leagueUserBans.id,
      reason: leagueUserBans.reason,
      bannedAt: leagueUserBans.bannedAt,
      user: {
        id: authUsers.id,
        email: authUsers.email,
      },
    })
    .from(leagueUserBans)
    .leftJoin(authUsers, eq(authUsers.id, leagueUserBans.userId))
    .where(eq(leagueUserBans.leagueId, leagueId));
}

import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getTeamCredits } from "../../teamsPlayers/queries/teamsPlayer";
import { isLeagueMember } from "../../members/permissions/leagueMember";
import { getUserTeamId } from "@/features/users/queries/user";

export async function canCreateTrade({
  userId,
  leagueId,
  proposerTeamId,
  receiverTeamId,
}: {
  userId: string;
  leagueId: string;
  proposerTeamId: string;
  receiverTeamId: string;
}) {
  const [isMarketOpen, isMember, userTeamId, ] = await Promise.all([
    isTradeMarketOpen(leagueId),
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
    getTeamCredits(proposerTeamId),
    getTeamCredits(receiverTeamId),
  ]);
}

export async function isTradeMarketOpen(leagueId: string) {
  const [res] = await db
    .select({ isOpen: leagueOptions.isTradingMarketOpen })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId));

  return res.isOpen;
}

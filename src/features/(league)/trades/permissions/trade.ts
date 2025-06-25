import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getTeamCredits } from "../../teamsPlayers/queries/teamsPlayer";
import { isLeagueMember } from "../../members/permissions/leagueMember";
import { getUserTeamId } from "@/features/users/queries/user";
import { getError } from "../db/trade";
import { TradeProposalSchema } from "../schema/trade";

export async function canCreateTrade({
  userId,
  leagueId,
  proposerTeamId,
  receiverTeamId,
  creditOfferedByProposer,
  creditRequestedByProposer,
}: {
  userId: string;
} & TradeProposalSchema) {
  const [
    isMarketOpen,
    isMemberOfLeague,
    userTeamId,
    proposerTeamCredits,
    receiverTeamCredits,
  ] = await Promise.all([
    isTradeMarketOpen(leagueId),
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
    getTeamCredits(proposerTeamId),
    getTeamCredits(receiverTeamId),
  ]);

  if (!isMarketOpen) {
    return getError("Il mercato degli scambi e' attualmente chiuso");
  }

  if (!isMemberOfLeague) {
    return getError("Non sei membro della lega");
  }

  if (userTeamId !== proposerTeamId) {
    return getError("La squadra che propone lo scambio deve essere la tua");
  }

  if (
    creditOfferedByProposer &&
    creditOfferedByProposer > proposerTeamCredits
  ) {
    return getError(
      `Non hai abbastanza crediti per questo scambio (${proposerTeamCredits})`
    );
  }

  if (
    creditRequestedByProposer &&
    creditRequestedByProposer > receiverTeamCredits
  ) {
    return getError(
      `La squadra dello scambio non ha abbastanza crediti da offrire (${receiverTeamCredits})`
    );
  }

  return { error: false, message: "" };
}

export async function canDeleteTrade({
  userId,
  leagueId,
  proposerTeamId,
  receiverTeamId,
}: {
  userId: string;
} & TradeProposalSchema) {
  const [
    isMemberOfLeague,
    userTeamId,
  ] = await Promise.all([
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
  ]);

  if (!isMemberOfLeague) {
    return getError("Non sei membro della lega");
  }

  if (userTeamId !== proposerTeamId) {
    return getError("Puoi eliminare solo gli scambi proposti da te");
  }

  return { error: false, message: "" };
}

export async function isTradeMarketOpen(leagueId: string) {
  const [res] = await db
    .select({ isOpen: leagueOptions.isTradingMarketOpen })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId));

  return res.isOpen;
}

export async function isUserTeamTrade(userId: string, leagueId: string) {
  const [res] = await db
    .select({ isOpen: leagueOptions.isTradingMarketOpen })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId));

  return res.isOpen;
}

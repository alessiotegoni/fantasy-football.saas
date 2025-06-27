import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { getTeamCredits } from "../../teamsPlayers/queries/teamsPlayer";
import { isLeagueMember } from "../../members/permissions/leagueMember";
import { getUserTeamId } from "@/features/users/queries/user";
import { getError } from "../db/trade";
import { CreateTradeProposalSchema } from "../schema/trade";
import { getTradeStatus } from "../queries/trade";
import { isTeamRoleSlotFull } from "../../teamsPlayers/permissions/teamsPlayer";
import { groupTradePlayers } from "../utils/trade";

export async function canCreateTrade({
  userId,
  leagueId,
  proposerTeamId,
  receiverTeamId,
  creditOfferedByProposer,
  creditRequestedByProposer,
}: {
  userId: string;
} & CreateTradeProposalSchema) {
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
    return getError("La squadra che fa lo scambio deve essere la tua");
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

  return {
    error: false,
    message: "",
    data: { proposerTeamCredits, receiverTeamCredits },
  };
}

export async function canUpdateTrade(
  tradeId: string,
  args: {
    userId: string;
  } & CreateTradeProposalSchema
) {
  const [permissions, tradeStatus, { isProposerTeamRoleSlotFull, isReceiverTeamRoleSlotFull }] = await Promise.all([
    canCreateTrade(args),
    getTradeStatus(tradeId),
    getTeamsRoleSlotFull(args),
  ]);

  if (permissions.error) return permissions;

  if (tradeStatus !== "pending") {
    return getError("Puoi accettare o rifiutare solo le richieste in sospeso");
  }

  if (isProposerTeamRoleSlotFull) {
    return getError("Non hai spazio in squadra");
  }

  return { error: false, message: "", data: permissions.data };
}

export async function canDeleteTrade({
  tradeId,
  userId,
  leagueId,
  proposerTeamId,
}: {
  tradeId: string;
  userId: string;
  leagueId: string;
  proposerTeamId: string;
}) {
  const [isMemberOfLeague, userTeamId, tradeStatus] = await Promise.all([
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
    getTradeStatus(tradeId),
  ]);

  if (!isMemberOfLeague) {
    return getError("Non sei membro della lega");
  }

  if (userTeamId !== proposerTeamId) {
    return getError("Puoi eliminare solo gli scambi proposti da te");
  }

  if (tradeStatus !== "pending") {
    return getError(
      "Puoi eliminare solo le proposte di scambio che nono sono ancora state accettate o rifiutate"
    );
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

async function getTeamsRoleSlotFull({
  leagueId,
  proposerTeamId,
  receiverTeamId,
  players,
}: Pick<
  CreateTradeProposalSchema,
  "leagueId" | "proposerTeamId" | "receiverTeamId" | "players"
>) {
  const groupedPlayers = groupTradePlayers(players);

  const [isProposerTeamRoleSlotFull, isReceiverTeamRoleSlotFull] = await Promise.all([
    isTeamRoleSlotFull(
      leagueId,
      proposerTeamId,
      groupedPlayers["requested"]?.map((player) => player.roleId) ?? []
    ),
    isTeamRoleSlotFull(
      leagueId,
      receiverTeamId,
      groupedPlayers["proposed"]?.map((player) => player.roleId) ?? []
    ),
  ]);

  return { isProposerTeamRoleSlotFull, isReceiverTeamRoleSlotFull };
}

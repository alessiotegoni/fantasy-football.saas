import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getPlayersRoles,
  getTeamCredits,
} from "../../teamsPlayers/queries/teamsPlayer";
import { isLeagueMember } from "../../members/permissions/leagueMember";
import { getUserTeamId } from "@/features/users/queries/user";
import { CreateTradeProposalSchema } from "../schema/trade";
import { getTradeStatus } from "../queries/trade";
import { isTeamRoleSlotFull } from "../../teamsPlayers/permissions/teamsPlayer";
import { groupTradePlayers } from "../utils/trade";

type TradePermissionParams = {
  userId: string;
} & CreateTradeProposalSchema;

const TRADE_ERRORS = {
  MARKET_CLOSED: "Il mercato degli scambi è attualmente chiuso",
  NOT_LEAGUE_MEMBER: "Non sei membro della lega",
  INVALID_PROPOSER: "La squadra che fa lo scambio deve essere la tua",
  INSUFFICIENT_PROPOSER_CREDITS:
    "Non hai abbastanza crediti per questo scambio",
  INSUFFICIENT_RECEIVER_CREDITS:
    "La squadra dello scambio non ha abbastanza crediti da offrire",
  TRADE_NOT_PENDING: "Puoi accettare o rifiutare solo le richieste in sospeso",
  DELETE_NOT_OWNER: "Puoi eliminare solo gli scambi proposti da te",
  DELETE_NOT_PENDING:
    "Puoi eliminare solo le proposte di scambio che non sono ancora state accettate o rifiutate",
} as const;

export async function canCreateTrade({
  userId,
  leagueId,
  proposerTeamId,
  receiverTeamId,
  creditOfferedByProposer,
  creditRequestedByProposer,
}: TradePermissionParams) {
  const [isMarketOpen, isMemberOfLeague, userTeamId] = await Promise.all([
    isTradeMarketOpen(leagueId),
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
  ]);

  if (!isMarketOpen) {
    return createError(TRADE_ERRORS.MARKET_CLOSED);
  }

  if (!isMemberOfLeague) {
    return createError(TRADE_ERRORS.NOT_LEAGUE_MEMBER);
  }

  if (userTeamId !== proposerTeamId) {
    return createError(TRADE_ERRORS.INVALID_PROPOSER);
  }

  const needsCreditsValidation =
    creditOfferedByProposer || creditRequestedByProposer;
  if (!needsCreditsValidation) {
    return createSuccess({ proposerTeamCredits: 0, receiverTeamCredits: 0 });
  }

  const [proposerTeamCredits, receiverTeamCredits] = await Promise.all([
    getTeamCredits(proposerTeamId),
    getTeamCredits(receiverTeamId),
  ]);

  const creditsValidation = validateCredits({
    creditOfferedByProposer,
    creditRequestedByProposer,
    proposerTeamCredits,
    receiverTeamCredits,
  });

  if (creditsValidation.error) return creditsValidation;

  return createSuccess({ proposerTeamCredits, receiverTeamCredits });
}

export async function canUpdateTrade(
  tradeId: string,
  args: TradePermissionParams
): Promise<PermissionResult<{ proposerTeamCredits: number; receiverTeamCredits: number }>> {
  const [permissions, tradeStatus] = await Promise.all([
    canCreateTrade(args),
    getTradeStatus(tradeId),
  ]);

  if (permissions.error) return permissions;

  if (tradeStatus !== "pending") {
    return createError(TRADE_ERRORS.TRADE_NOT_PENDING);
  }

  const roleSlotValidation = await validateTeamRoleSlots(args);
  if (roleSlotValidation.error) return roleSlotValidation;

  return createSuccess(permissions.data);
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
}): Promise<PermissionResult<{}>> {
  const [isMemberOfLeague, userTeamId, tradeStatus] = await Promise.all([
    isLeagueMember(userId, leagueId),
    getUserTeamId(userId, leagueId),
    getTradeStatus(tradeId),
  ]);

  if (!isMemberOfLeague) {
    return createError(TRADE_ERRORS.NOT_LEAGUE_MEMBER);
  }

  if (userTeamId !== proposerTeamId) {
    return createError(TRADE_ERRORS.DELETE_NOT_OWNER);
  }

  if (tradeStatus !== "pending") {
    return createError(TRADE_ERRORS.DELETE_NOT_PENDING);
  }

  return createSuccess({});
}

export async function isTradeMarketOpen(leagueId: string): Promise<boolean> {
  const [result] = await db
    .select({ isOpen: leagueOptions.isTradingMarketOpen })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId))
    .limit(1);

  return result?.isOpen ?? false;
}

function validateCredits({
  creditOfferedByProposer,
  creditRequestedByProposer,
  proposerTeamCredits,
  receiverTeamCredits,
}: {
  creditOfferedByProposer?: number | null;
  creditRequestedByProposer?: number | null;
  proposerTeamCredits: number;
  receiverTeamCredits: number;
}): PermissionResult<{ proposerTeamCredits: number; receiverTeamCredits: number }> {
  if (
    creditOfferedByProposer &&
    creditOfferedByProposer > proposerTeamCredits
  ) {
    return createError(
      `${TRADE_ERRORS.INSUFFICIENT_PROPOSER_CREDITS} (${proposerTeamCredits})`
    );
  }

  if (
    creditRequestedByProposer &&
    creditRequestedByProposer > receiverTeamCredits
  ) {
    return createError(
      `${TRADE_ERRORS.INSUFFICIENT_RECEIVER_CREDITS} (${receiverTeamCredits})`
    );
  }

  return createSuccess({ proposerTeamCredits, receiverTeamCredits });
}

async function validateTeamRoleSlots(args: TradePermissionParams): Promise<PermissionResult<{}>> {
  const { proposerTeam, receiverTeam } = await getTeamsRoleSlotValidation(args);

  if (!proposerTeam.isSlotFull && !receiverTeam.isSlotFull) {
    return createSuccess({});
  }

  const roles = await getPlayersRoles();
  const errorMessages: string[] = [];

  if (proposerTeam.isSlotFull) {
    const fullRoles = roles
      .filter((role) => proposerTeam.fullRolesIdsSlot.has(role.id))
      .map((role) => role.name);

    if (fullRoles.length > 0) {
      errorMessages.push(
        `Non hai abbastanza spazio in questi ruoli: ${fullRoles.join(", ")}`
      );
    }
  }

  if (receiverTeam.isSlotFull) {
    const fullRoles = roles
      .filter((role) => receiverTeam.fullRolesIdsSlot.has(role.id))
      .map((role) => role.name);

    if (fullRoles.length > 0) {
      errorMessages.push(
        `La squadra con il quale vuoi scambiare non ha spazio in questi ruoli: ${fullRoles.join(
          ", "
        )}`
      );
    }
  }

  return errorMessages.length > 0
    ? createError(errorMessages.join("\n"))
    : createSuccess({});
}

async function getTeamsRoleSlotValidation({
  leagueId,
  proposerTeamId,
  receiverTeamId,
  players,
}: Pick<
  CreateTradeProposalSchema,
  "leagueId" | "proposerTeamId" | "receiverTeamId" | "players"
>) {
  const groupedPlayers = groupTradePlayers(players);

  const [proposerTeam, receiverTeam] = await Promise.all([
    isTeamRoleSlotFull(
      leagueId,
      proposerTeamId,
      groupedPlayers.requested?.map((player) => player.roleId) ?? []
    ),
    isTeamRoleSlotFull(
      leagueId,
      receiverTeamId,
      groupedPlayers.proposed?.map((player) => player.roleId) ?? []
    ),
  ]);

  return { proposerTeam, receiverTeam };
}

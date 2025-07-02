import { db } from "@/drizzle/db";
import { leagueOptions } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import {
  getPlayersRoles,
  getTeamCredits,
  getTeamPlayers,
} from "../../teamsPlayers/queries/teamsPlayer";
import { isLeagueMember } from "../../members/permissions/leagueMember";
import { getUserTeamId } from "@/features/users/queries/user";
import { CreateTradeProposalSchema } from "../schema/trade";
import { getTradeStatus } from "../queries/trade";
import { isTeamRoleSlotFull } from "../../teamsPlayers/permissions/teamsPlayer";
import { groupTradePlayers } from "../utils/trade";
import { createError, createSuccess } from "@/lib/helpers";

type TradePermissionParams = {
  userId: string;
} & CreateTradeProposalSchema;

enum TRADE_ERRORS {
  MARKET_CLOSED = "Il mercato degli scambi è attualmente chiuso",
  NOT_LEAGUE_MEMBER = "Non sei membro della lega",
  INVALID_PROPOSER = "La squadra che fa lo scambio deve essere la tua",
  INVALID_RECEIVER = "Solo il team ricevente può accettare o rifiutare lo scambio.",
  INSUFFICIENT_PROPOSER_CREDITS = "Non hai abbastanza crediti per questo scambio",
  INSUFFICIENT_RECEIVER_CREDITS = "La squadra dello scambio non ha abbastanza crediti da offrire",
  TRADE_NOT_PENDING = "Puoi accettare o rifiutare solo le richieste in sospeso",
  PLAYERS_NOT_VALID = "Uno o più giocatori non sono più nella squadra originale e non possono essere scambiati.",
  DELETE_NOT_OWNER = "Puoi eliminare solo gli scambi proposti da te",
  DELETE_NOT_PENDING = "Puoi eliminare solo le proposte di scambio che non sono ancora state accettate o rifiutate",
}

export async function canCreateTrade(args: TradePermissionParams) {
  const baseValidation = await validateTradeBaseRequirements(
    args.userId,
    args.leagueId
  );
  if (baseValidation.error) return baseValidation;

  if (baseValidation.data.userTeamId !== args.proposerTeamId) {
    return createError(TRADE_ERRORS.INVALID_PROPOSER);
  }

  const [creditsValidation, teamsSlotsValidation] = await Promise.all([
    validateTradeCredits(args),
    validateTeamRoleSlots(args),
  ]);
  if (creditsValidation.error) return creditsValidation;
  if (teamsSlotsValidation.error) return teamsSlotsValidation;

  return createSuccess("", null);
}

export async function canUpdateTrade(
  tradeId: string,
  isTradeAccepted: boolean,
  args: TradePermissionParams
) {
  const baseValidation = await validateTradeBaseRequirements(
    args.userId,
    args.leagueId
  );
  if (baseValidation.error) return baseValidation;

  if (baseValidation.data.userTeamId !== args.receiverTeamId) {
    return createError(TRADE_ERRORS.INVALID_RECEIVER);
  }

  const tradeStatus = await getTradeStatus(tradeId);
  if (tradeStatus !== "pending") {
    return createError(TRADE_ERRORS.TRADE_NOT_PENDING);
  }

  if (!isTradeAccepted) return createSuccess("", null);

  const [stillInTeamsValidation, creditValidation, roleSlotValidation] =
    await Promise.all([
      validateTradePlayersStillInTeams(args),
      validateTradeCredits(args),
      validateTeamRoleSlots(args),
    ]);

  if (stillInTeamsValidation.error) return stillInTeamsValidation;
  if (creditValidation.error) return creditValidation;
  if (roleSlotValidation.error) return roleSlotValidation;

  return createSuccess("", creditValidation.data);
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
    return createError(TRADE_ERRORS.NOT_LEAGUE_MEMBER);
  }

  if (userTeamId !== proposerTeamId) {
    return createError(TRADE_ERRORS.DELETE_NOT_OWNER);
  }

  if (tradeStatus !== "pending") {
    return createError(TRADE_ERRORS.DELETE_NOT_PENDING);
  }

  return createSuccess("", null);
}

async function validateTradeBaseRequirements(userId: string, leagueId: string) {
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

  return createSuccess("", { userTeamId });
}

async function validateTradeCredits({
  proposerTeamId,
  receiverTeamId,
  creditOfferedByProposer,
  creditRequestedByProposer,
}: {
  proposerTeamId: string;
  receiverTeamId: string;
  creditOfferedByProposer?: number | null;
  creditRequestedByProposer?: number | null;
}) {
  const needsValidation = creditOfferedByProposer || creditRequestedByProposer;

  if (!needsValidation) {
    return createSuccess("", {
      proposerTeamCredits: 0,
      receiverTeamCredits: 0,
    });
  }

  const [proposerTeamCredits, receiverTeamCredits] = await Promise.all([
    getTeamCredits(proposerTeamId),
    getTeamCredits(receiverTeamId),
  ]);

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

  return createSuccess("", {
    proposerTeamCredits,
    receiverTeamCredits,
  });
}

async function validateTradePlayersStillInTeams(args: TradePermissionParams) {
  const invalidPlayers = await getInvalidPlayersIds(args)
  if (invalidPlayers.length) return createError(TRADE_ERRORS.PLAYERS_NOT_VALID);

  return createSuccess("", null)
}

export async function getInvalidPlayersIds({
  proposerTeamId,
  receiverTeamId,
  players,
}: TradePermissionParams) {
  const teamsPlayers = await getTeamPlayers([proposerTeamId, receiverTeamId]);

  const invalidPlayers = players.filter((tradePlayer) =>
    teamsPlayers.some((teamPlayer) => teamPlayer.id !== tradePlayer.id)
  );

  return invalidPlayers.map((player) => player.id);
}

async function validateTeamRoleSlots(args: TradePermissionParams) {
  const { proposerTeam, receiverTeam } = await getTeamsRoleSlotValidation(args);

  if (!proposerTeam.isSlotFull && !receiverTeam.isSlotFull) {
    return createSuccess("", null);
  }

  const roles = await getPlayersRoles();
  const errorMessages: string[] = [];

  if (proposerTeam.isSlotFull) {
    const fullRoles = roles
      .filter((role) => proposerTeam.fullRolesIdsSlot.has(role.id))
      .map((role) => role.name);

    if (fullRoles.length > 0) {
      errorMessages.push(
        `Non hai abbastanza spazio in questi ruoli: ${fullRoles.join(", ")}.`
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
        )}.`
      );
    }
  }

  return errorMessages.length > 0
    ? createError(errorMessages.join("\n"))
    : createSuccess("", {});
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
    isTeamRoleSlotFull({
      leagueId,
      teamId: proposerTeamId,
      playersRolesIdsIn: groupedPlayers.requested?.map((p) => p.roleId) ?? [],
      playersRolesIdsOut: groupedPlayers.proposed?.map((p) => p.roleId) ?? [],
    }),
    isTeamRoleSlotFull({
      leagueId,
      teamId: receiverTeamId,
      playersRolesIdsIn: groupedPlayers.proposed?.map((p) => p.roleId) ?? [],
      playersRolesIdsOut: groupedPlayers.requested?.map((p) => p.roleId) ?? [],
    }),
  ]);

  return { proposerTeam, receiverTeam };
}

export async function isTradeMarketOpen(leagueId: string): Promise<boolean> {
  const [result] = await db
    .select({ isOpen: leagueOptions.isTradingMarketOpen })
    .from(leagueOptions)
    .where(eq(leagueOptions.leagueId, leagueId))
    .limit(1);

  return result?.isOpen ?? false;
}

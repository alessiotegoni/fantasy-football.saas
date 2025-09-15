import { getUserId } from "@/features/dashboard/user/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { createClient } from "@/services/supabase/server/supabase";
import { getSplitMatchday } from "../../admin/splits/queries/split";
import { getPlayersMatchdayVotes } from "../../queries/vote";
import {
  CreateVotesSchema,
  DeleteVoteSchema,
  EditVoteSchema,
} from "../schema/vote";
import { db } from "@/drizzle/db";
import { matchdayVotes } from "@/drizzle/schema";
import { isRedaction } from "@/features/dashboard/user/utils/roles";

enum VOTE_ERRORS {
  REQUIRE_REDACTION = "Devi essere parte della redazione per gestire i voti",
  VOTE_NOT_FOUND = "Voto non trovato",
  MATCHDAY_UPCOMING = "Non puoi gestire i voti per una giornata non ancora iniziata.",
  ALREADY_ASSIGNED = "Un voto è già stato assegnato ad un giocatore per questa giornata.",
}

async function baseValidation(matchdayId: number) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const supabase = await createClient();
  const userIsRedaction = await isRedaction(supabase, userId);

  if (!userIsRedaction) {
    return createError(VOTE_ERRORS.REQUIRE_REDACTION);
  }

  const matchday = await getSplitMatchday(matchdayId);

  if (matchday?.status === "upcoming") {
    return createError(VOTE_ERRORS.MATCHDAY_UPCOMING);
  }

  return createSuccess("", { matchday });
}

export async function canCreateVotes(data: CreateVotesSchema["votes"]) {
  const validation = await baseValidation(data[0].matchdayId);
  if (validation.error) return validation;

  const matchdayId = data[0].matchdayId;

  const playersIds = data.map((v) => v.playerId);
  const existingVotes = await getPlayersMatchdayVotes({
    matchdayId,
    playersIds,
  });

  const existingSet = new Set(existingVotes.map((v) => v.playerId));

  const hasVote = data.some((v) => existingSet.has(v.playerId));
  if (hasVote) return createError(VOTE_ERRORS.ALREADY_ASSIGNED);

  return createSuccess("", null);
}

export async function canUpdateVote(data: EditVoteSchema) {
  const validation = await baseValidation(data.matchdayId);
  if (validation.error) return validation;

  const existing = await getPlayerMatchdayVote(data);
  if (existing && existing.id !== data.id) {
    return createError(VOTE_ERRORS.ALREADY_ASSIGNED);
  }

  return createSuccess("", null);
}

export async function canDeleteVote(data: DeleteVoteSchema) {
  const validation = await baseValidation(data.matchdayId);
  if (validation.error) return validation;

  const vote = await getMatchdayVote(data.voteId);
  if (!vote || vote.matchdayId !== validation.data.matchday.id) {
    return createError(VOTE_ERRORS.VOTE_NOT_FOUND);
  }

  return createSuccess("", null);
}

async function getMatchdayVote(id: string) {
  return db.query.matchdayVotes.findFirst({
    where: (vote, { eq }) => eq(vote.id, id),
    columns: {
      matchdayId: true,
    },
  });
}

async function getPlayerMatchdayVote(
  data: Pick<typeof matchdayVotes.$inferSelect, "matchdayId" | "playerId" | "id">
) {
  return db.query.matchdayVotes.findFirst({
    where: (v, { and, eq }) =>
      and(eq(v.matchdayId, data.matchdayId), eq(v.playerId, data.playerId)),
    columns: {
      id: true,
    },
  });
}

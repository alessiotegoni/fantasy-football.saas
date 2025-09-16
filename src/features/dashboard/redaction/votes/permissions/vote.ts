import { getUserId } from "@/features/dashboard/user/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { createClient } from "@/services/supabase/server/supabase";
import {
  AssignVoteSchema,
  CreateVotesSchema,
  DeleteVoteSchema,
  EditVoteSchema,
} from "../schema/vote";
import { db } from "@/drizzle/db";
import { matchdayVotes } from "@/drizzle/schema";
import { isRedaction } from "@/features/dashboard/user/utils/roles";
import { getSplitMatchday } from "@/features/dashboard/admin/splits/queries/split";
import { and, count, eq, inArray } from "drizzle-orm";

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

  if (await hasVote(data)) {
    return createError(VOTE_ERRORS.ALREADY_ASSIGNED);
  }

  return createSuccess("", null);
}

export async function canUpdateVote(data: EditVoteSchema) {
  const validation = await baseValidation(data.matchdayId);
  if (validation.error) return validation;

  if (await hasVote([data])) {
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
    columns: {
      matchdayId: true,
    },
    where: (vote, { eq }) => eq(vote.id, id),
  });
}

async function hasVote(data: AssignVoteSchema[]) {
  const matchdayId = data[0].matchdayId;
  const redactionId = data[0].redactionId;
  const playersIds = data.map((d) => d.playerId);

  const [res] = await db
    .select({ count: count() })
    .from(matchdayVotes)
    .where(
      and(
        eq(matchdayVotes.matchdayId, matchdayId),
        eq(matchdayVotes.redactionId, redactionId),
        inArray(matchdayVotes.playerId, playersIds)
      )
    );

  return res.count > 0;
}

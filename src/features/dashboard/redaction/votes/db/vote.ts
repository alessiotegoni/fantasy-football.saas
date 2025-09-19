import { db } from "@/drizzle/db";
import { matchdayVotes } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import {
  revalidateRedactionMatchdaysVotesCache,
  revalidatePlayerMatchdayVoteCache,
} from "./cache/vote";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nell'assegnazione del voto",
  UPDATE_ERROR = "Errore nell'aggiormento del voto",
  DELETE_ERROR = "Errore nell'eliminazione del voto",
}

export async function insertVotes(data: (typeof matchdayVotes.$inferInsert)[]) {
  const res = await db.insert(matchdayVotes).values(data).returning();

  if (!res.length) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateCaches(res);

  console.log(res);

  return res;
}

export async function updateVote(
  id: string,
  data: Pick<typeof matchdayVotes.$inferInsert, "vote">
) {
  const [res] = await db
    .update(matchdayVotes)
    .set(data)
    .where(eq(matchdayVotes.id, id))
    .returning();

  if (!res.id) {
    throw new Error(createError(DB_ERRORS.UPDATE_ERROR).message);
  }

  revalidateCaches([res]);
}

export async function deleteVote(id: string) {
  const [res] = await db
    .delete(matchdayVotes)
    .where(eq(matchdayVotes.id, id))
    .returning();

  if (!res.id) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateCaches([res]);
}

function revalidateCaches(
  data: { redactionId: string; matchdayId: number; playerId: number }[]
) {
  const matchdayId = data[0].matchdayId;
  const redactionId = data[0].redactionId;
  const playersIds = data.map(({ playerId }) => playerId);

  revalidateRedactionMatchdaysVotesCache(redactionId);
  revalidatePlayerMatchdayVoteCache(playersIds, matchdayId);
}

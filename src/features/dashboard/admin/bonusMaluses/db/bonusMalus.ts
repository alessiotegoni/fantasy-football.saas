import { db } from "@/drizzle/db";
import { matchdayBonusMalus } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import {
  revalidatePlayerMatchdayBonusMalusCache,
  revalidateSplitMatchdaysBonusMalusesCache,
} from "./cache/bonusMalus";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nell'assegnazione del bonus/malus",
  UPDATE_ERROR = "Errore nell'aggiormento del bonus/malus",
  DELETE_ERROR = "Errore nell'eliminazione del bonus/malus",
}

export async function insertBonusMalus(
  data: (typeof matchdayBonusMalus.$inferInsert)[]
) {
  const [res] = await db.insert(matchdayBonusMalus).values(data).returning({
    id: matchdayBonusMalus.id,
  });

  if (!res.id) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateCaches(data);

  return res.id;
}

export async function updateBonusMalus(
  id: string,
  data: Pick<
    typeof matchdayBonusMalus.$inferInsert,
    "bonusMalusTypeId" | "count"
  >
) {
  const [res] = await db
    .update(matchdayBonusMalus)
    .set(data)
    .where(eq(matchdayBonusMalus.id, id))
    .returning({
      id: matchdayBonusMalus.id,
      playerId: matchdayBonusMalus.playerId,
      matchdayId: matchdayBonusMalus.matchdayId,
    });

  if (!res.id) {
    throw new Error(createError(DB_ERRORS.UPDATE_ERROR).message);
  }

  revalidateCaches([res]);
}

export async function deleteBonusMalus(id: string) {
  const [res] = await db
    .delete(matchdayBonusMalus)
    .where(eq(matchdayBonusMalus.id, id))
    .returning({
      id: matchdayBonusMalus.id,
      playerId: matchdayBonusMalus.playerId,
      matchdayId: matchdayBonusMalus.matchdayId,
    });

  if (!res.id) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateCaches([res]);
}

function revalidateCaches(data: { matchdayId: number; playerId: number }[]) {
  const matchdayId = data[0].matchdayId;
  const playersIds = data.map(({ playerId }) => playerId);

  revalidateSplitMatchdaysBonusMalusesCache(matchdayId);
  revalidatePlayerMatchdayBonusMalusCache(playersIds, matchdayId);
}

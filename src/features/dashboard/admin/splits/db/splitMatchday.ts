import { db } from "@/drizzle/db";
import { splitMatchdays } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import { revalidateSplitMatchdaysCache } from "./cache/split";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nella creazione della giornata",
  UPDATE_ERROR = "Errore nell'aggiormento della giornata",
  DELETE_ERROR = "Errore nell'eliminazione della giornata",
}

export async function insertSplitMatchday(
  data: (typeof splitMatchdays.$inferInsert)[]
) {
  const [res] = await db
    .insert(splitMatchdays)
    .values(data)
    .returning({ splitMatchdayId: splitMatchdays.id });

  if (!res.splitMatchdayId) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateSplitMatchdaysCache(res.splitMatchdayId);

  return res.splitMatchdayId;
}

export async function updateSplitMatchday(
  id: number,
  data: Partial<typeof splitMatchdays.$inferInsert>
) {
  const [res] = await db
    .update(splitMatchdays)
    .set(data)
    .where(eq(splitMatchdays.id, id))
    .returning({ splitMatchdayId: splitMatchdays.id });

  if (!res.splitMatchdayId) {
    throw new Error(createError(DB_ERRORS.UPDATE_ERROR).message);
  }

  revalidateSplitMatchdaysCache(res.splitMatchdayId);
}

export async function deleteSplitMatchday(id: number) {
  const [res] = await db
    .delete(splitMatchdays)
    .where(eq(splitMatchdays.id, id))
    .returning({ splitMatchdayId: splitMatchdays.id });

  if (!res.splitMatchdayId) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateSplitMatchdaysCache(res.splitMatchdayId);
}

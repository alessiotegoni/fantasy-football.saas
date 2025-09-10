import { db } from "@/drizzle/db";
import { splits } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import { revalidateSplitsCache } from "./cache/split";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nella creazione dello split",
  UPDATE_ERROR = "Errore nell'aggiormento dello split",
  DELETE_ERROR = "Errore nell'eliminazione dello split",
}

export async function insertSplit(data: (typeof splits.$inferInsert)[]) {
  const [res] = await db
    .insert(splits)
    .values(data)
    .returning({ splitId: splits.id });

  if (!res.splitId) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateSplitsCache(res.splitId);
}

export async function updateSplit(
  id: number,
  data: Partial<typeof splits.$inferInsert>
) {
  const [res] = await db
    .update(splits)
    .set(data)
    .where(eq(splits.id, id))
    .returning({ splitId: splits.id });

  if (!res.splitId) {
    throw new Error(createError(DB_ERRORS.UPDATE_ERROR).message);
  }

  revalidateSplitsCache(res.splitId);
}

export async function deleteSplit(id: number) {
  const [res] = await db
    .delete(splits)
    .where(eq(splits.id, id))
    .returning({ splitId: splits.id });

  if (!res.splitId) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateSplitsCache(res.splitId);
}

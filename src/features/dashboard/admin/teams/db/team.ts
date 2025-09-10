import { db } from "@/drizzle/db";
import { teams } from "@/drizzle/schema";
import { createError } from "@/utils/helpers";
import { eq } from "drizzle-orm";
import { revalidateTeamsCache } from "./cache/team";

enum DB_ERRORS {
  INSERT_ERROR = "Errore nella creazione del team",
  UPDATE_ERROR = "Errore nell'aggiormento del team",
  DELETE_ERROR = "Errore nell'eliminazione del team",
}

export async function insertTeam(data: typeof teams.$inferInsert) {
  const [res] = await db
    .insert(teams)
    .values(data)
    .returning({ teamId: teams.id });

  if (!res.teamId) {
    throw new Error(createError(DB_ERRORS.INSERT_ERROR).message);
  }

  revalidateTeamsCache();

  return res.teamId;
}

export async function updateTeam(
  id: number,
  data: Partial<typeof teams.$inferInsert>
) {
  const [res] = await db
    .update(teams)
    .set(data)
    .where(eq(teams.id, id))
    .returning({ teamId: teams.id });

  if (!res.teamId) {
    throw new Error(createError(DB_ERRORS.UPDATE_ERROR).message);
  }

  revalidateTeamsCache();
}

export async function deleteTeam(id: number) {
  const [res] = await db
    .delete(teams)
    .where(eq(teams.id, id))
    .returning({ teamId: teams.id });

  if (!res.teamId) {
    throw new Error(createError(DB_ERRORS.DELETE_ERROR).message);
  }

  revalidateTeamsCache();
}

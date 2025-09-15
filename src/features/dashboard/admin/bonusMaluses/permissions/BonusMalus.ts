import { getUserId } from "@/features/dashboard/user/utils/user";
import { createError, createSuccess } from "@/utils/helpers";
import { VALIDATION_ERROR } from "@/schema/helpers";
import { isAdmin, isSuperadmin } from "@/features/dashboard/user/utils/roles";
import { createClient } from "@/services/supabase/server/supabase";
import { getSplitMatchday } from "../../splits/queries/split";
import { getPlayersMatchdayBonusMaluses } from "../queries/bonusMalus";
import {
  CreateBonusMalusSchema,
  DeleteBonusMalusSchema,
  EditBonusMalusSchema,
} from "../schema/bonusMalus";
import { db } from "@/drizzle/db";
import { matchdayBonusMalus } from "@/drizzle/schema";

enum BONUS_MALUS_ERRORS {
  REQUIRE_ADMIN = "Devi essere un admin per gestire i bonus/malus",
  BONUS_MALUS_NOT_FOUND = "Bonus/malus non trovato",
  MATCHDAY_UPCOMING = "Non puoi gestire i bonus/malus per una giornata non ancora iniziata.",
  ALREADY_ASSIGNED = "Un bonus/malus è già stato assegnato ad un giocatore per questa giornata.",
}

async function baseValidation(matchdayId: number) {
  const userId = await getUserId();
  if (!userId) return createError(VALIDATION_ERROR);

  const supabase = await createClient();
  const userIsAdmin = await isAdmin(supabase, userId);

  if (!userIsAdmin && !isSuperadmin(userId)) {
    return createError(BONUS_MALUS_ERRORS.REQUIRE_ADMIN);
  }

  const matchday = await getSplitMatchday(matchdayId);

  if (matchday?.status === "upcoming") {
    return createError(BONUS_MALUS_ERRORS.MATCHDAY_UPCOMING);
  }

  return createSuccess("", { matchday });
}

export async function canCreateBonusMaluses(
  data: CreateBonusMalusSchema["bonusMaluses"]
) {
  const validation = await baseValidation(data[0].matchdayId);
  if (validation.error) return validation;

  const matchdayId = data[0].matchdayId;

  const playersIds = data.map((bm) => bm.playerId);
  const existingBonusMaluses = await getPlayersMatchdayBonusMaluses({
    matchdayId,
    playersIds,
  });

  const existingSet = new Set(
    existingBonusMaluses.map((bm) => `${bm.playerId}-${bm.id}`)
  );

  const hasBonusMalus = data.some((bm) =>
    existingSet.has(`${bm.playerId}-${bm.bonusMalusTypeId}`)
  );
  if (hasBonusMalus) return createError(BONUS_MALUS_ERRORS.ALREADY_ASSIGNED);

  return createSuccess("", null);
}

export async function canUpdateBonusMalus(data: EditBonusMalusSchema) {
  const validation = await baseValidation(data.matchdayId);
  if (validation.error) return validation;

  const existing = await getPlayerMatchdayBonusMalusByType(data);
  if (existing && existing.id !== data.id) {
    return createError(BONUS_MALUS_ERRORS.ALREADY_ASSIGNED);
  }

  return createSuccess("", null);
}

export async function canDeleteBonusMalus(data: DeleteBonusMalusSchema) {
  const validation = await baseValidation(data.matchdayId);
  if (validation.error) return validation;

  const bonusMalus = await getMatchdayBonusMalus(data.bonusMalusId);
  if (!bonusMalus || bonusMalus.matchdayId !== validation.data.matchday.id) {
    return createError(BONUS_MALUS_ERRORS.BONUS_MALUS_NOT_FOUND);
  }

  return createSuccess("", null);
}

async function getMatchdayBonusMalus(id: string) {
  return db.query.matchdayBonusMalus.findFirst({
    where: (matchdayBonus, { eq }) => eq(matchdayBonus.id, id),
    columns: {
      matchdayId: true,
    },
  });
}

async function getPlayerMatchdayBonusMalusByType(
  data: typeof matchdayBonusMalus.$inferSelect
) {
  return db.query.matchdayBonusMalus.findFirst({
    where: (bm, { and, eq }) =>
      and(
        eq(bm.matchdayId, data.matchdayId),
        eq(bm.playerId, data.playerId),
        eq(bm.bonusMalusTypeId, data.bonusMalusTypeId)
      ),
    columns: {
      id: true,
    },
  });
}

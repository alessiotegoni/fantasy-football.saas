"use server";

import { db } from "@/drizzle/db";
import { createLeagueSchema, CreateLeagueSchema } from "../schema/league";
import { count, ilike } from "drizzle-orm";
import { leagues } from "@/drizzle/schema";
import { getError, insertLeague, insertLeagueOptions } from "../db/league";
import { getUserId } from "@/services/supabase/utils/supabase";
import { redirect } from "next/navigation";

export async function createLeague(values: CreateLeagueSchema) {
  const { success, data: league } = createLeagueSchema.safeParse(values);
  if (!success) return getError();

  const userId = await getUserId();
  if (!userId) return getError();

  if (league.visibility === "public" && !(await isUniqueName(league.name))) {
    return getError("Il nome della lega esiste gia, utilizzane un'altro");
  }

  const leagueId = await db.transaction(async (tx) => {
    const leagueId = await insertLeague({ ownerId: userId, ...league }, tx);
    await insertLeagueOptions({ leagueId }, tx);

    return leagueId;
  });

  redirect(`/leagues/${leagueId}/options`);
}

async function isUniqueName(leagueName: string) {
  const [res] = await db
    .select({ count: count() })
    .from(leagues)
    .where(ilike(leagues.name, leagueName));

  return res.count === 0;
}

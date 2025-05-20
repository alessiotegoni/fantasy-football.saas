"use server";

import { db } from "@/drizzle/db";
import { createLeagueSchema, CreateLeagueSchema } from "../schema/league";
import { count, ilike } from "drizzle-orm";
import { leagues } from "@/drizzle/schema";
import {
  getError,
  insertLeague,
  insertLeagueOptions,
  updateLeague,
} from "../db/league";
import { getUserId } from "@/services/supabase/utils/supabase";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { uploadImage } from "@/services/supabase/storage/supabase";
import { canCreateLeague } from "../permissions/league";

export async function createLeague(values: CreateLeagueSchema) {
  const userId = await getUserId();

  if (!userId || !(await canCreateLeague(userId))) {
    return getError("Per creare 2 o piu leghe devi avere il premium");
  }

  const { success, data: league } = createLeagueSchema.safeParse(values);
  if (!success) return getError();

  if (league.visibility === "public" && !(await isUniqueName(league.name))) {
    return getError("Il nome della lega esiste gia, utilizzane un'altro");
  }

  const leagueId = await db.transaction(async (tx) => {
    const leagueId = await insertLeague({ ownerId: userId, ...league }, tx);
    await insertLeagueOptions({ leagueId }, tx);

    return leagueId;
  });

  if (league.image) after(updateLeagueImage.bind(null, leagueId, league.image));

  redirect(`/leagues/${leagueId}/options`);
}

async function updateLeagueImage(leagueId: string, file: File) {
  const imageUrl = await uploadImage({
    file,
    folder: "leagues-logos",
    name: leagueId,
  });

  console.log(imageUrl);

  if (imageUrl) await updateLeague(leagueId, { imageUrl });
}
 
async function isUniqueName(leagueName: string) {
  const [res] = await db
    .select({ count: count() })
    .from(leagues)
    .where(ilike(leagues.name, leagueName));

  return res.count === 0;
}

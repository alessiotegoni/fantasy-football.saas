"use server";

import { db } from "@/drizzle/db";
import { createLeagueSchema, CreateLeagueSchema } from "../schema/createLeague";
import { count, ilike } from "drizzle-orm";
import { leagues } from "@/drizzle/schema";
import {
  getError,
  insertLeague,
  insertLeagueMember,
  updateLeague,
} from "../db/league";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { uploadImage } from "@/services/supabase/storage/supabase";
import { canCreateLeague } from "../permissions/league";
import { addUserLeaguesMetadata, getUser } from "@/features/users/utils/user";
import { insertLeagueOptions } from "@/features/leagueOptions/db/leagueOptions";

export async function createLeague(values: CreateLeagueSchema) {
  const user = await getUser();

  if (!user || !(await canCreateLeague(user.id))) {
    return getError("Per creare 2 o piu leghe devi avere il premium");
  }

  const { success, data: league } = createLeagueSchema.safeParse(values);
  if (!success) return getError();

  console.log(league);

  if (!(await isUniqueName(league.name))) {
    return getError("Il nome della lega esiste gia, utilizzane un'altro");
  }

  const leagueId = await db.transaction(async (tx) => {
    const leagueId = await insertLeague({ ownerId: user.id, ...league }, tx);
    await insertLeagueOptions({ leagueId }, tx);

    return leagueId;
  });

  after(async () => {
    await Promise.all([
      addUserLeaguesMetadata(user, leagueId),
      insertLeagueMember(user.id, leagueId, "admin"),
    ]);
    if (league.image) await updateLeagueImage(leagueId, league.image);
  });

  redirect(`/leagues/${leagueId}/options/general`);
}

async function updateLeagueImage(leagueId: string, file: File) {
  const imageUrl = await uploadImage({
    file,
    folder: "leagues-logos",
    name: leagueId,
  });

  if (imageUrl) await updateLeague(leagueId, { imageUrl });
}

async function isUniqueName(leagueName: string) {
  const [res] = await db
    .select({ count: count() })
    .from(leagues)
    .where(ilike(leagues.name, leagueName));

  return res.count === 0;
}

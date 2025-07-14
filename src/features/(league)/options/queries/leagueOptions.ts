import { getBonusMalusTag, getTacticalModulesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getLeagueBonusMalusOptionsTag,
  getLeagueGeneralOptionsTag,
  getLeagueOptionsTag,
} from "../db/cache/leagueOption";

export async function getTacticalModules() {
  "use cache";
  cacheTag(getTacticalModulesTag());

  return db.query.tacticalModules.findMany();
}

export async function getBonusMaluses() {
  "use cache";
  cacheTag(getBonusMalusTag());

  return db.query.bonusMalusTypes.findMany();
}

export async function getGeneralOptions(leagueId: string) {
  "use cache";
  cacheTag(getLeagueOptionsTag(leagueId), getLeagueGeneralOptionsTag(leagueId));

  return db.query.leagueOptions.findFirst({
    columns: {
      initialCredits: true,
      maxMembers: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });
}

export async function getBonusMalusesOptions(leagueId: string) {
  "use cache";
  cacheTag(
    getLeagueOptionsTag(leagueId),
    getLeagueBonusMalusOptionsTag(leagueId)
  );

  const bonusMalusOptions = await db.query.leagueOptions.findFirst({
    columns: {
      customBonusMalus: true,
    },
    where: (options, { eq }) => eq(options.leagueId, leagueId),
  });

  return bonusMalusOptions;
}

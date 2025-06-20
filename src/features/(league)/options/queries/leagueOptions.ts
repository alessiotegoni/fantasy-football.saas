import { getBonusMalusTag, getTacticalModulesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

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

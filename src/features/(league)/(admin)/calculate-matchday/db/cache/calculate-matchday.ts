import { getLeagueTag } from "@/cache/helpers";
import { revalidateTag } from "next/cache";

export type CALCULATIONS_TAG = "league-calculations";

export const getLeagueCalculationsTag = (leagueId: string) =>
  getLeagueTag("league-calculations", leagueId);

export const revalidateLeagueCalculationsCache = (leagueId: string) => {
  revalidateTag(getLeagueCalculationsTag(leagueId));
};

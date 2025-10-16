import { getLeagueTag } from "@/cache/helpers";
import { updateTag } from "next/cache";

export type CALCULATIONS_TAG = "league-calculations";

export const getLeagueCalculationsTag = (leagueId: string) =>
  getLeagueTag("league-calculations", leagueId);

export const revalidateLeagueCalculationsCache = (leagueId: string) => {
  updateTag(getLeagueCalculationsTag(leagueId));
};

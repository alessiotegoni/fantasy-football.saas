import { getTacticalModulesTag } from "@/cache/global";
import { db } from "@/drizzle/db";
import { RolePosition } from "@/drizzle/schema";
import {
  getMatchLineupInfoTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getTeamIdTag } from "@/features/(league)/teams/db/cache/leagueTeam";
import { getSplitMatchdaysIdTag } from "@/features/splits/db/cache/split";
import { validateUUIds } from "@/schema/helpers";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { notFound } from "next/navigation";

export default async function MatchPage({
  params,
}: {
  params: Promise<{ leagueId: string; matchId: string }>;
}) {
  const { success, leagueId, matchId } = validateUUIds(await params);
  if (!success) notFound();

  const lineupInfo = await getMatchLineupInfo(leagueId, matchId);

  return <div>MatchPage</div>;
}

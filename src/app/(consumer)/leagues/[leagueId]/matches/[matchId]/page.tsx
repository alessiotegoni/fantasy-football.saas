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

async function getMatchLineupInfo(leagueId: string, matchId: string) {
  "use cache";
  cacheTag(
    getMatchLineupInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag(),
    getLeagueOptionsTag(leagueId)
  );

  const result = await db.query.leagueMatches.findFirst({
    columns: {},
    with: {
      league: {
        columns: {},
        with: {
          options: {
            columns: {
              customBonusMalus: true,
            },
          },
        },
      },
      splitMatchday: {
        columns: {
          splitId: true,
          status: true,
        },
      },
      homeTeam: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      awayTeam: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
      lineups: {
        columns: {
          id: true,
          teamId: true,
        },
        with: {
          tacticalModule: true,
        },
      },
      matchResults: {
        columns: {
          teamId: true,
          goals: true,
          totalScore: true,
        },
      },
    },
    where: (match, { and, eq }) =>
      and(eq(match.leagueId, leagueId), eq(match.id, matchId)),
  });

  if (!result) return undefined;

  if (result.homeTeam) cacheTag(getTeamIdTag(result.homeTeam.id));
  if (result.awayTeam) cacheTag(getTeamIdTag(result.awayTeam.id));

  cacheTag(getSplitMatchdaysIdTag(result.splitMatchday.splitId));

  return {
    splitId: result.splitMatchday.splitId,
    splitMatchdayStatus: result.splitMatchday.status,
    leagueCustomBonusMalus: result.league.options[0].customBonusMalus,
    homeTeam: formatTeamData(
      result.homeTeam,
      result.lineups,
      result.matchResults
    ),
    awayTeam: formatTeamData(
      result.awayTeam,
      result.lineups,
      result.matchResults
    ),
  };
}

function formatTeamData(
  team: { id: string; name: string; imageUrl: string | null } | null,
  lineups: {
    teamId: string;
    tacticalModule: { id: number; layout: RolePosition[]; name: string };
  }[],
  matchResults: {
    teamId: string;
    goals: number;
    totalScore: string;
  }[]
) {
  if (!team) return null;

  const lineup = lineups.find((l) => l.teamId === team.id);
  const result = matchResults.find((r) => r.teamId === team.id);

  return {
    id: team.id,
    name: team.name,
    imageUrl: team.imageUrl,
    tacticalModule: lineup?.tacticalModule ?? null,
    result: result ?? null,
  };
}

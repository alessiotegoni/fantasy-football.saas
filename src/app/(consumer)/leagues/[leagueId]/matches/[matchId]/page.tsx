import { getTacticalModulesTag } from "@/cache/global";
import Container from "@/components/Container";
import { db } from "@/drizzle/db";
import { RolePosition } from "@/drizzle/schema";
import CalendarMatchCard from "@/features/(league)/(admin)/calendar/components/CalendarMatchCard";
import {
  getMatchInfoTag,
  getMatchResultsTag,
} from "@/features/(league)/matches/db/cache/match";
import { getLeagueOptionsTag } from "@/features/(league)/options/db/cache/leagueOption";
import { getBonusMalusesOptions } from "@/features/(league)/options/queries/leagueOptions";
import { getTeamIdTag } from "@/features/(league)/teams/db/cache/leagueTeam";
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

  const [matchInfo, { bonusMalusOptions }] = await Promise.all([
    getMatchInfo(leagueId, matchId),
    getBonusMalusesOptions(leagueId),
  ]);
  if (!matchInfo) notFound();

  console.log(matchInfo);

  return (
    <Container headerLabel="Partita" leagueId={leagueId}>
      <CalendarMatchCard
        className="!rounded-4xl -mt-4"
        leagueId={leagueId}
        homeModule={matchInfo.homeTeam?.lineup?.tacticalModule.name ?? null}
        awayModule={matchInfo.awayTeam?.lineup?.tacticalModule.name ?? null}
        isLink={false}
        {...matchInfo}
      />
    </Container>
  );
}

async function getMatchInfo(leagueId: string, matchId: string) {
  "use cache";

  const result = await db.query.leagueMatches.findFirst({
    columns: {
      id: true,
      isBye: true,
    },
    with: {
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

  cacheTag(
    ...getMatchInfoTags({
      ...result,
      leagueId,
      matchId,
    })
  );

  const { homeTeam, awayTeam, lineups, ...matchInfo } = result;

  return {
    homeTeam: formatTeamData(homeTeam, lineups),
    awayTeam: formatTeamData(awayTeam, lineups),
    ...matchInfo,
  };
}

type Team = { id: string; name: string; imageUrl: string | null } | null;

function formatTeamData(
  team: Team,
  lineups: {
    id: string;
    teamId: string;
    tacticalModule: { id: number; layout: RolePosition[]; name: string };
  }[]
) {
  if (!team) return null;

  const lineup = lineups.find((l) => l.teamId === team.id) ?? null;

  return {
    ...team,
    lineup,
  };
}

function getMatchInfoTags({
  homeTeam,
  awayTeam,
  leagueId,
  matchId,
}: {
  homeTeam: Team;
  awayTeam: Team;
  leagueId: string;
  matchId: string;
}) {
  const tags = [
    getMatchInfoTag(matchId),
    getMatchResultsTag(matchId),
    getTacticalModulesTag(),
    getLeagueOptionsTag(leagueId),
  ];

  if (homeTeam) tags.push(getTeamIdTag(homeTeam.id));
  if (awayTeam) tags.push(getTeamIdTag(awayTeam.id));

  return tags;
}

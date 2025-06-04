import { db } from "@/drizzle/db";
import { getLeagueTeamsTag } from "@/features/leagueTeams/db/cache/leagueTeam";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function LeagueTeamPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const leagueTeams = await getLeagueTeams(leagueId);

  console.log(leagueTeams);

  return <div>LeagueTeam</div>;
}

async function getLeagueTeams(leagueId: string) {
  "use cache";
  cacheTag(getLeagueTeamsTag(leagueId));

  return db.query.leagueMemberTeams.findMany({
    columns: {
      leagueMemberId: false,
    },
    where: (league, { eq }) => eq(league.id, leagueId),
  });
}

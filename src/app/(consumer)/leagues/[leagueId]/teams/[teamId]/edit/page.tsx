import { db } from "@/drizzle/db";
import { LeagueTeamForm } from "@/features/leagueTeams/components/LeagueTeamForm";
import { getLeagueMemberTeamTag } from "@/features/leagueTeams/db/cache/leagueTeam";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function EditLeagueTeamPage({
  params,
}: {
  params: Promise<{ leagueId: string; teamId: string }>;
}) {
  const { leagueId, teamId } = await params;
  const leagueTeam = await getLeagueMemberTeam(teamId);

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <h2 className="ext-2xl md:text-3xl font-heading mb-8">
        Modifica la tua squadra
      </h2>
      <LeagueTeamForm
        leagueId={leagueId}
        teamId={teamId}
        initialData={leagueTeam}
      />
    </div>
  );
}

async function getLeagueMemberTeam(teamId: string) {
  "use cache";
  cacheTag(getLeagueMemberTeamTag(teamId));

  return db.query.leagueMemberTeams.findFirst({
    columns: {
      name: true,
      imageUrl: true,
      managerName: true,
    },
    where: (team, { eq }) => eq(team.id, teamId),
  });
}

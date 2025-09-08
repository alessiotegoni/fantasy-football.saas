import { db } from "@/drizzle/db";
import { LeagueTeamForm } from "@/features/league/teams/components/LeagueTeamForm";
import {
  getLeagueMemberTeamTag,
  getTeamIdTag,
} from "@/features/league/teams/db/cache/leagueTeam";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export default async function EditLeagueTeamPage({
  params,
}: PageProps<"/league/[leagueId]/teams/[teamId]/edit">) {
  const { leagueId, teamId } = await params;
  const leagueTeam = await getLeagueMemberTeam(teamId);

  return (
    <div className="max-w-[700px] mx-auto md:p-4">
      <h2 className="text-2xl md:text-3xl font-heading mb-8">
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
  cacheTag(getTeamIdTag(teamId), getLeagueMemberTeamTag(teamId));

  const memberTeam = await db.query.leagueMemberTeams.findFirst({
    columns: {
      name: true,
      imageUrl: true,
      managerName: true,
    },
    where: (team, { eq }) => eq(team.id, teamId),
  });

  if (!memberTeam) return undefined;

  return { ...memberTeam, image: null };
}

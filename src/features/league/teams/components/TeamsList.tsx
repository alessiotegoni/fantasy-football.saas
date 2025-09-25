import { getLeagueTeams } from "../queries/leagueTeam";
import LeagueTeamCard from "./LeagueTeamCard";
import CreateTeamBanner from "./CreateTeamBanner";

type Props = {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
  teamUserId?: string;
};

export default function TeamsList({ teams, leagueId, teamUserId }: Props) {
  const hasTeam = teams.some((team) => team.userId === teamUserId);
  const sortedTeams = sortTeams({ teams, teamUserId });

  return (
    <>
      {teamUserId !== undefined && !hasTeam && (
        <CreateTeamBanner leagueId={leagueId} />
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {sortedTeams.map((team) => (
          <LeagueTeamCard
            key={team.id}
            team={team}
            teamUserId={teamUserId}
            leagueId={leagueId}
            className="min-h-[110px]"
          />
        ))}
      </div>
    </>
  );
}

function sortTeams({ teams, teamUserId }: Omit<Props, "leagueId">) {
  return teamUserId
    ? teams.toSorted((a, b) => {
        if (a.userId === teamUserId) return -1;
        if (b.userId === teamUserId) return 1;
        return 0;
      })
    : teams;
}

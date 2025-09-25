import { getLeagueTeams } from "../queries/leagueTeam";
import LeagueTeamCard from "./LeagueTeamCard";
import CreateTeamBanner from "./CreateTeamBanner";

type Props = {
  teams: Awaited<ReturnType<typeof getLeagueTeams>>;
  leagueId: string;
  userId?: string;
};

export default function TeamsList({ teams, leagueId, userId }: Props) {
  const hasTeam = teams.some((team) => team.userId === userId);
  const sortedTeams = sortTeams({ teams, userId });

  return (
    <>
      {userId !== undefined && hasTeam && (
        <CreateTeamBanner leagueId={leagueId} />
      )}
      <div className="grid gap-4 xl:grid-cols-2">
        {sortedTeams.map((team) => (
          <LeagueTeamCard
            key={team.id}
            team={team}
            userId={userId}
            leagueId={leagueId}
            className="min-h-[110px]"
          />
        ))}
      </div>
    </>
  );
}

function sortTeams({ teams, userId }: Omit<Props, "leagueId">) {
  return userId
    ? teams.toSorted((a, b) => {
        if (a.userId === userId) return -1;
        if (b.userId === userId) return 1;
        return 0;
      })
    : teams;
}

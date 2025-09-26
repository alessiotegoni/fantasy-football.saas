import { LeagueTeam } from "../queries/leagueTeam";

export function sortTeams({
  teams,
  userId,
}: {
  teams: LeagueTeam[];
  userId?: string;
}) {
  if (!userId) return teams;

  const sortedTeams = teams.toSorted((a, b) => {
    if (a.userId === userId) return -1;
    if (b.userId === userId) return 1;
    return 0;
  });

  return sortedTeams;
}

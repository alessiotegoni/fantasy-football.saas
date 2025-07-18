import { getStarterLineups, MatchInfo } from "../queries/match";
import { SplitMatchday } from "@/features/splits/queries/split";
import { LineupTeam } from "../utils/match";
import StarterLineupField from "./StarterLineupField";
import LineupEmptyState from "./LineupEmptyState";

type Props = {
  match: MatchInfo;
  myTeam?: LineupTeam;
  currentMatchday?: SplitMatchday;
  isMatchdayClosed: boolean;
};

export default async function StarterLineups({
  match: {
    id: matchId,
    isBye,
    homeTeam,
    awayTeam,
    leagueCustomBonusMalus,
    splitMatchday: matchMatchday,
  },
  currentMatchday,
  myTeam,
  isMatchdayClosed,
}: Props) {
  if (isBye) return null;

  const starterPlayers =
    homeTeam?.lineup || awayTeam?.lineup
      ? await getStarterLineups(matchId, matchMatchday.id)
      : undefined;

  return (
    <div className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full min-h-[600px] sm:min-h-[400px] xl:min-h-[500px]">
      {[homeTeam, awayTeam].map((team, i) => {
        if (!team) return null;

        if (
          (isMatchdayClosed && !team.lineup) ||
          (!isMatchdayClosed && !team.lineup && team.id !== myTeam?.id)
        ) {
          return (
            <LineupEmptyState
              key={i}
              team={team}
              myTeam={myTeam}
              matchMatchday={matchMatchday}
            />
          );
        }

        if (!isMatchdayClosed) {
          const teamPlayers = starterPlayers?.filter(
            (player) => player.leagueTeamId === team.id
          );

          return (
            <StarterLineupField
              key={team.id}
              team={team}
              players={teamPlayers ?? []}
              canEdit={!isMatchdayClosed && team.id === myTeam?.id}
            />
          );
        }
      })}
    </div>
  );
}

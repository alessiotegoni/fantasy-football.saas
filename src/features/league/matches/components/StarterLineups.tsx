"use client";

import { LineupPlayer, MatchInfo } from "../queries/match";
import { SplitMatchday } from "@/features/splits/queries/split";
import StarterLineupField from "./StarterLineupField";
import LineupEmptyState from "./LineupEmptyState";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  match: MatchInfo;
  players: LineupPlayer[];
  currentMatchday?: SplitMatchday;
  isMatchdayClosed: boolean;
};

export default function StarterLineups({
  match: { isBye, homeTeam, awayTeam, splitMatchday: matchMatchday },
  players,
  isMatchdayClosed,
}: Props) {
  if (isBye) return null;

  const { myTeam } = useMyLineup();

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
              matchMatchday={matchMatchday}
            />
          );
        }

        if (!isMatchdayClosed) {
          const teamPlayers = players.filter(
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

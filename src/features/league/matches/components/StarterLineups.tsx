"use client";

import { LineupPlayer, MatchInfo } from "../queries/match";

import StarterLineupField from "./StarterLineupField";
import LineupEmptyState from "./LineupEmptyState";
import useMyLineup from "@/hooks/useMyLineup";
import { SplitMatchday } from "@/features/dashboard/admin/splits/queries/split";

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

  const teams = [
    { ...homeTeam, isHome: true },
    { ...awayTeam, isHome: false },
  ];

  return (
    <div className="absolute grid grid-rows-2 sm:grid-rows-none sm:grid-cols-2 w-full min-h-[600px] sm:min-h-[400px] xl:min-h-[500px]">
      {teams.map((team, i) => {
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

        const teamPlayers = players.filter(
          (player) => player.leagueTeamId === team.id
        );

        if (!teamPlayers.length) {
          return (
            <LineupEmptyState
              key={i}
              team={team}
              matchMatchday={matchMatchday}
            />
          );
        }

        return (
          <StarterLineupField
            key={team.id}
            team={team}
            players={teamPlayers}
            canEdit={!isMatchdayClosed && team.id === myTeam?.id}
          />
        );
      })}
    </div>
  );
}

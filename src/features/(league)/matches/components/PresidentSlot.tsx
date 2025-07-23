"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { LineupPlayer } from "../queries/match";
import { PRESIDENT_ROLE_ID } from "@/drizzle/schema";
import useMyLineup from "@/hooks/useMyLineup";

type Props = {
  canEditLineup: boolean;
  starterPresident: LineupPlayer | LineupPlayerWithoutVotes | undefined;
};

export default function PresidentSlot({
  canEditLineup,
  starterPresident,
}: Props) {
  const {
    myLineup: { starterPlayers },
  } = useMyLineup();

  if (!starterPresident && !canEditLineup) return null; // FIXME: emptystate ui

  return <div className="size-full bg-input/30 rounded-4xl"></div>;
}

export function getPresident(
  players: LineupPlayer[] | LineupPlayerWithoutVotes[],
  teamId: string | null
) {
  const president = players.find(
    (player) =>
      player.role.id === PRESIDENT_ROLE_ID && player.leagueTeamId === teamId
  );

  return president;
}

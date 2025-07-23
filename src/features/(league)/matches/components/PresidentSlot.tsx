"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { LineupPlayer } from "../queries/match";
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

"use client"

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useIsMobile } from "@/hooks/useMobile";
import StarterLineupFieldMobile from "./StarterLineupFieldMobile";
import StarterLineupFieldDesktop from "./StarterLineupFieldDesktop";

type Props = {
  team: NonNullable<LineupTeam>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupField(props: Props) {
  const isMobile = useIsMobile(640);

  return isMobile ? (
    <StarterLineupFieldMobile {...props} />
  ) : (
    <StarterLineupFieldDesktop {...props} />
  );
}

// TODO: creare client componente col drower su mobile e dialog su desktop  che fetchi i giocatori di myTeam solo al click, e che mostri solo i giocatori che non ci sono a seconda del contesto (bench, starter)

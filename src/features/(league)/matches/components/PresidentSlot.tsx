"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import { Crown, Plus, PlusCircle } from "iconoir-react";
import { getPresident } from "../utils/match";
import PlayersSelectTrigger from "./PlayersSelectTrigger";
import PresidentCard from "./PresidentCard";
import { PRESIDENT_ROLE_ID } from "@/drizzle/schema";
import { cn } from "@/lib/utils";

type Props = {
  canEditLineup: boolean;
  starterPresident: LineupPlayer | LineupPlayerWithoutVotes | undefined;
};

export default function PresidentSlot({
  canEditLineup,
  starterPresident,
}: Props) {
  const {
    myTeam,
    myLineup: { starterPlayers },
  } = useMyLineup();

  const president = canEditLineup
    ? getPresident(starterPlayers, myTeam.id)
    : starterPresident;

  const hasPresident = !!president;

  return (
    <div
      className={cn(
        `relative size-full bg-input/30 rounded-4xl p-4`,
        !hasPresident && !canEditLineup && "border-transparent",
        hasPresident && "border border-primary"
      )}
    >
      <div className="flex gap-2">
        <Crown
          className={cn(
            "absolute -top-8.5 left-1/2 -translate-x-1/2 text-3xl",
            hasPresident ? "text-primary" : "text-input"
          )}
          fill={hasPresident ? "var(--primary)" : "currentColor"}
        />
        <h2>Presidente</h2>
      </div>
      {!hasPresident && !canEditLineup && (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground text-center">
            Presidente non inserito
          </p>
        </div>
      )}
      {!hasPresident && canEditLineup && (
        <PlayersSelectTrigger
          lineupType="starter"
          roleId={PRESIDENT_ROLE_ID}
          positionId="PR-1"
          className="size-full flex-col gap-2"
        >
          <div className="flex justify-center items-center size-8 bg-primary text-white rounded-full">
            <Plus className="size-5" />
          </div>
          <p className="text-sm font-medium text-primary text-center">
            Aggiungi <br /> presidente
          </p>
        </PlayersSelectTrigger>
      )}
      {hasPresident && <PresidentCard player={president} />}
    </div>
  );
}

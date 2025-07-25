"use client";

import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import { LineupPlayer } from "../queries/match";
import useMyLineup from "@/hooks/useMyLineup";
import { Crown, Plus, UserCrown, UserXmark } from "iconoir-react";
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
      <div className="flex justify-between items-center gap-2">
        <Crown
          className={cn(
            "absolute -top-8.5 left-1/2 -translate-x-1/2 text-3xl",
            hasPresident ? "text-primary" : "text-input"
          )}
          fill={hasPresident ? "var(--primary)" : "currentColor"}
        />
        <h2>Presidente</h2>
        {!hasPresident && canEditLineup && (
          <AddPresidentButton>
            <div className="flex justify-center items-center size-6 bg-primary text-white rounded-full">
              <Plus className="size-5" />
            </div>
          </AddPresidentButton>
        )}
      </div>
      {!hasPresident && !canEditLineup && (
        <div className="size-full flex flex-col gap-2 justify-start mt-6.5 items-center">
          <UserXmark className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground text-center">
            Presidente non inserito
          </p>
        </div>
      )}
      {!hasPresident && canEditLineup && (
        <AddPresidentButton className="size-full flex-col justify-start gap-2 mt-6.5">
          <UserCrown className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground text-center">
            Aggiungi <br /> presidente
          </p>
        </AddPresidentButton>
      )}
      {hasPresident && (
        <PresidentCard player={president} canEdit={canEditLineup} />
      )}
    </div>
  );
}

function AddPresidentButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <PlayersSelectTrigger
      lineupType="starter"
      roleId={PRESIDENT_ROLE_ID}
      className={className}
    >
      {children}
    </PlayersSelectTrigger>
  );
}

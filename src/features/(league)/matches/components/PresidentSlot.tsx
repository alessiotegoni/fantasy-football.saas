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
        `relative min-h-36 2xl:size-full bg-input/30 rounded-4xl p-4`,
        !hasPresident && !canEditLineup && "border-transparent",
        hasPresident && "border border-primary"
      )}
    >
      <div className="flex justify-between items-center gap-2 h-7">
        <Crown
          className={cn(
            "absolute -top-8.5 left-1/2 -translate-x-1/2 text-3xl",
            hasPresident ? "text-primary" : "text-input"
          )}
          fill={hasPresident ? "var(--primary)" : "currentColor"}
        />
        <h2 className="text-sm xs:text-base">Presidente</h2>
        {!hasPresident && canEditLineup && (
          <AddPresidentButton className="bg-primary text-primary-foreground size-6 xs:size-7 p-0 rounded-full 2xl:size-6 shrink-0">
            <Plus className="size-5 font-semibold" />
          </AddPresidentButton>
        )}
      </div>
      {!hasPresident && !canEditLineup && (
        <div className="mt-2 2xl:size-full flex flex-col gap-2 justify-center 2xl:justify-start 2xl:mt-6.5 items-center">
          <UserXmark className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground text-center">
            Presidente non inserito
          </p>
        </div>
      )}
      {!hasPresident && canEditLineup && (
        <AddPresidentButton className="w-full mt-2 2xl:size-full flex-col justify-center 2xl:justify-start gap-2 2xl:mt-6.5">
          <UserCrown className="size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground text-center w-full 2xl:max-w-32">
            Aggiungi presidente
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

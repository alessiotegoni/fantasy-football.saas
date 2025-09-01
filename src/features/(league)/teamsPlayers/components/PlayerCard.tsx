"use client";

import Avatar from "@/components/Avatar";
import { Minus, Plus, User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import TeamCreditsBadge from "../../teams/components/TeamCreditsBadge";
import { cn } from "@/lib/utils";
import { TeamPlayer } from "../queries/teamsPlayer";

type Props = TeamPlayer & {
  showSelectButton?: boolean;
  showPurchaseCost?: boolean;
  canSelectCard?: boolean;
  onSelect?: (player: TeamPlayer) => void;
  className?: string;
  avatarSize?: number;
};

export default memo(function PlayerCard({
  showSelectButton = true,
  showPurchaseCost = true,
  className,
  avatarSize = 12,
  canSelectCard = false,
  onSelect,
  ...player
}: Props) {
  const { teamId } = useParams();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl border border-border",
        canSelectCard && "cursor-pointer",
        className
      )}
      {...(canSelectCard ? { onClick: onSelect?.bind(null, player) } : {})}
    >
      <div className="flex items-center gap-3">
        <div className={cn("relative", `size-${avatarSize}`)}>
          <Avatar
            imageUrl={player.avatarUrl}
            name={player.displayName}
            renderFallback={() => <User />}
            className={cn(
              avatarSize && `size-${avatarSize}`,
              "ring-1 ring-zinc-700"
            )}
          />
          {player.role && (
            <PlayerRoleBadge
              role={player.role}
              className={cn("absolute -top-1 -left-1")}
            />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibold">{player.displayName}</span>
          {player.team && (
            <span className="text-xs text-muted-foreground">
              {player.team.displayName}
            </span>
          )}
        </div>
      </div>

      {(showPurchaseCost || showSelectButton) && (
        <div className="flex gap-2 items-center">
          {!!player.purchaseCost && showPurchaseCost && (
            <TeamCreditsBadge credits={player.purchaseCost} />
          )}
          {showSelectButton && (
            <DialogTrigger asChild>
              <Button
                className="w-fit rounded-full size-8"
                onClick={onSelect?.bind(null, player)}
              >
                {teamId ? (
                  <Minus className="size-5" />
                ) : (
                  <Plus className="size-5" />
                )}
              </Button>
            </DialogTrigger>
          )}
        </div>
      )}
    </div>
  );
});

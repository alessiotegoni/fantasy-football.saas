"use client";

import Avatar from "@/components/Avatar";
import { Minus, Plus, User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { EnrichedPlayer } from "@/contexts/PlayersProvider";
import TeamCreditsBadge from "../../teams/components/TeamCreditsBadge";
import { cn } from "@/lib/utils";

type Props = EnrichedPlayer & {
  showSelectButton?: boolean;
  className?: string;
  canSelectCard?: boolean;
  onSelect?: (player: EnrichedPlayer) => void;
};

export default memo(function PlayerCard({
  showSelectButton = true,
  className,
  canSelectCard = false,
  onSelect,
  ...player
}: Props) {
  const { teamId } = useParams();

  return (
    <div
      className={cn(
        "flex items-center justify-between px-4 py-3 rounded-xl border border-border",
        className
      )}
      {...(canSelectCard ? { onClick: onSelect?.bind(null, player) } : {})}
    >
      <div className="flex items-center gap-3">
        <div className="relative size-12">
          <Avatar
            imageUrl={player.avatarUrl}
            name={player.displayName}
            size={12}
            renderFallback={() => <User />}
          />
          {player.role && (
            <PlayerRoleBadge
              role={player.role}
              className="absolute -top-1 -left-1"
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

      <div className="flex gap-2 items-center">
        {player.purchaseCost !== undefined && (
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
    </div>
  );
});

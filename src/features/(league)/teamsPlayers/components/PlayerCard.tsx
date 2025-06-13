"use client";

import Avatar from "@/components/Avatar";
import { Minus, Plus, User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { EnrichedPlayer } from "@/contexts/PlayersProvider";
import { usePlayerSelection } from "@/contexts/PlayerSelectionProvider";
import TeamCreditsBadge from "../../leagueTeams/components/TeamCreditsBadge";

type Props = EnrichedPlayer & {
  showSelectButton?: boolean;
  // onSelect?: (player: EnrichedPlayer) => void;
};

export default memo(function PlayerCard({
  showSelectButton = true,
  // onSelect,
  ...player
}: Props) {
  const { teamId } = useParams();
  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border">
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
        {isSelectionMode && showSelectButton && (
          <DialogTrigger asChild>
            <Button
              className="w-fit rounded-full size-8"
              onClick={toggleSelectPlayer.bind(null, player)}
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

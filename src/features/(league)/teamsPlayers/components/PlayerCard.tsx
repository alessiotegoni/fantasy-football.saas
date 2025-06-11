"use client";

import Avatar from "@/components/Avatar";
import { Minus, Plus, User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import usePlayerSelection from "@/hooks/usePlayerSelection";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EnrichedPlayer } from "@/contexts/PlayersListProvider";
import { useParams } from "next/navigation";

type Props = EnrichedPlayer & { showSelectButton?: boolean };

export default memo(function PlayerCard(player: Props) {
  const { teamId } = useParams();

  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  const showSelectButton = [
    player.showSelectButton ?? true,
    isSelectionMode,
    player.team,
    player.role,
  ].every(Boolean);

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
          <span className="text-sm font-semibol">{player.displayName}</span>
          {player.team && (
            <span className="text-xs text-muted-foreground">
              {player.team.displayName}
            </span>
          )}
        </div>
      </div>

      {showSelectButton && (
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

      {/* RIGHT - Stats
      <div className="flex flex-col text-sm items-end">
        <span className="text-gray-900 font-medium">{fm.toFixed(2)}</span>
        <span className="text-gray-500">{fvmp}</span>
      </div> */}
    </div>
  );
});

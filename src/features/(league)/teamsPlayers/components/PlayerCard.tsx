"use client";

import Avatar from "@/components/Avatar";
import { Plus, User } from "iconoir-react";
import { getPlayersRoles } from "../queries/player";
import { getTeams } from "@/features/teams/queries/team";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import usePlayerSelection from "@/hooks/usePlayerSelection";
import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  id: string;
  avatarUrl: string | null;
  displayName: string;
  //   fm: number;
  //   fvmp: number;
  team: Awaited<ReturnType<typeof getTeams>>[number] | null;
  role?: Awaited<ReturnType<typeof getPlayersRoles>>[number] | null;
};

export default memo(function PlayerCard({
  id,
  avatarUrl,
  displayName,
  team,
  role,
}: Props) {
  const { isSelectionMode, toggleSelectPlayer } = usePlayerSelection();

  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <div className="relative size-12">
          <Avatar
            imageUrl={avatarUrl}
            name={displayName}
            size={12}
            renderFallback={() => <User />}
          />
          {role && (
            <PlayerRoleBadge role={role} className="absolute -top-1 -left-1" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibol">{displayName}</span>
          {team && (
            <span className="text-xs text-muted-foreground">
              {team.displayName}
            </span>
          )}
        </div>
      </div>

      {isSelectionMode && team && (
        <DialogTrigger asChild>
          <Button
            className="w-fit rounded-full size-8"
            onClick={toggleSelectPlayer.bind(null, id)}
          >
            <Plus className="size-5" />
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

"use client"

import Avatar from "@/components/Avatar";
import { User } from "iconoir-react";
import { getPlayersRoles } from "../queries/player";
import { getTeams } from "@/features/teams/queries/team";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";

type Props = {
  id: string;
  avatarUrl: string;
  name: string;
  //   fm: number;
  //   fvmp: number;
  team: Awaited<ReturnType<typeof getTeams>>[number] | null;
  role: Awaited<ReturnType<typeof getPlayersRoles>>[number] | null;
};

export default memo(function PlayerCard({
  id,
  avatarUrl,
  name,
  team,
  role,
}: Props) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-border">
      <div className="flex items-center gap-3">
        <div className="relative size-12">
          <Avatar
            imageUrl={avatarUrl}
            name={name}
            size={12}
            renderFallback={() => <User />}
          />
          {role && (
            <PlayerRoleBadge role={role} className="absolute -top-1 -left-1" />
          )}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-semibol">{name}</span>
          {team && (
            <span className="text-xs text-muted-foreground">
              {team.displayName}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT - Stats
      <div className="flex flex-col text-sm items-end">
        <span className="text-gray-900 font-medium">{fm.toFixed(2)}</span>
        <span className="text-gray-500">{fvmp}</span>
      </div> */}
    </div>
  );
});

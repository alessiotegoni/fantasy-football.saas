import { PRESIDENT_ROLE_ID } from "@/drizzle/schema";
import { getPlayersRoles } from "@/features/league/teamsPlayers/queries/teamsPlayer";
import { cn } from "@/lib/utils";
import { Crown } from "iconoir-react";

type Props = {
  role: Awaited<ReturnType<typeof getPlayersRoles>>[number];
  className?: string;
};

export default function PlayerRoleBadge({ role, className }: Props) {
  const badgeStyle = roleClasses[role.name] ?? "bg-muted text-foreground";

  return (
    <div
      className={cn(
        "size-5 shrink-0 flex items-center justify-center rounded-full text-xs font-semibold",
        className,
        badgeStyle
      )}
    >
      {role.id === PRESIDENT_ROLE_ID ? (
        <Crown className="text-primary size-4" />
      ) : (
        role.shortName
      )}
    </div>
  );
}

export const roleNames: Record<string, { singular: string; plural: string }> = {
  Presidente: { singular: "presidente", plural: "presidenti" },
  Portiere: { singular: "portiere", plural: "portieri" },
  Difensore: { singular: "difensore", plural: "difensori" },
  Centrocampista: { singular: "centrocampista", plural: "centrocampisti" },
  Attaccante: { singular: "attaccante", plural: "attaccanti" },
};

export const roleClasses: Record<string, string> = {
  Portiere: "bg-blue-500 text-white",
  Difensore: "bg-green-500 text-white",
  Centrocampista: "bg-yellow-500 text-white",
  Attaccante: "bg-red-500 text-white",
};

import { cn } from "@/lib/utils";
import { formatPlural } from "@/utils/formatters";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/teamsPlayer";
import PlayerRoleBadge, { roleNames } from "@/components/PlayerRoleBadge";
import { getLeaguePlayersPerRole } from "../../settings/queries/setting";

type Props = {
  leagueId: string;
  className?: string;
};

export default async function LeaguePlayersPerRole({
  leagueId,
  className,
}: Props) {
  const [playersPerRole, availableRoles] = await Promise.all([
    getLeaguePlayersPerRole(leagueId),
    getPlayersRoles(),
  ]);

  return (
    <div
      className={cn(
        "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2",
        className
      )}
    >
      {availableRoles.map((role) => (
        <div
          key={role.id}
          className="flex items-center p-3 rounded-xl bg-muted/30 border border-border"
        >
          <PlayerRoleBadge role={role} className="size-8 mr-3" />
          <span className="capitalize text-sm font-medium">
            {formatPlural(playersPerRole[role.id] ?? 1, roleNames[role.name], {
              includeCount: true,
            })}
          </span>
        </div>
      ))}
    </div>
  );
}

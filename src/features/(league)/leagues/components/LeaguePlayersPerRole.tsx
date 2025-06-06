import { cn } from "@/lib/utils";
import { db } from "@/drizzle/db";
import { getLeaguePlayersPerRoleTag } from "@/features/(league)/leagueOptions/db/cache/leagueOption";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { formatPlural } from "@/lib/formatters";
import { getPlayersRoles } from "@/features/players/queries/player";
import PlayerRoleBadge, { roleNames } from "@/components/PlayerRoleBadge";

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
            {formatPlural(
              playersPerRole[role.id],
              roleNames[role.name] ?? {
                singular: role.name,
                plural: role.name + "i",
              },
              { includeCount: true }
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

async function getLeaguePlayersPerRole(leagueId: string) {
  "use cache";
  cacheTag(getLeaguePlayersPerRoleTag(leagueId));

  return db.query.leagueOptions
    .findFirst({
      columns: {
        playersPerRole: true,
      },
      where: (options, { eq }) => eq(options.leagueId, leagueId),
    })
    .then((res) => res!.playersPerRole);
}

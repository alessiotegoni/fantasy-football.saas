import { cn } from "@/lib/utils";
import { db } from "@/drizzle/db";
import { getPlayersRoles } from "@/features/leagueOptions/queries/leagueOptions";
import { getLeaguePlayersPerRoleTag } from "@/features/leagueOptions/db/cache/leagueOption";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { formatPlural } from "@/lib/formatters";

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
      {availableRoles.map((role) => {
        const count = playersPerRole[role.id];
        const badgeStyle = roleColors[role.name] ?? "bg-muted text-foreground";

        return (
          <div
            key={role.id}
            className="flex items-center p-3 rounded-xl bg-muted/30 border border-border"
          >
            <div
              className={cn(
                "size-8 shrink-0 flex items-center justify-center rounded-full text-xs font-semibold mr-3",
                badgeStyle
              )}
            >
              {role.shortName}
            </div>
            <span className="capitalize text-sm font-medium">
              {formatPlural(
                count,
                roleNames[role.name] ?? {
                  singular: role.name,
                  plural: role.name + "i",
                },
                { includeCount: true }
              )}
            </span>
          </div>
        );
      })}
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

const roleNames: Record<string, { singular: string; plural: string }> = {
  Portiere: { singular: "portiere", plural: "portieri" },
  Difensore: { singular: "difensore", plural: "difensori" },
  Centrocampista: { singular: "centrocampista", plural: "centrocampisti" },
  Attaccante: { singular: "attaccante", plural: "attaccanti" },
};

const roleColors: Record<string, string> = {
  Portiere: "bg-blue-500 text-white",
  Difensore: "bg-green-500 text-white",
  Centrocampista: "bg-yellow-500 text-white",
  Attaccante: "bg-red-500 text-white",
};

import CheckboxCard from "@/components/ui/checkbox-card";
import { db } from "@/drizzle/db";
import { getLeagueModulesTag } from "@/features/leagueOptions/db/cache/leagueOption";
import { getTacticalModules } from "@/features/leagueOptions/queries/leagueOptions";
import { cn } from "@/lib/utils";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

type Props = {
  leagueId: string;
  className?: string;
};

export default async function LeagueModules({ leagueId, className }: Props) {
  const [modules, availableModules] = await Promise.all([
    getLeagueModules(leagueId),
    getTacticalModules(),
  ]);

  const leagueModules = availableModules.filter((module) =>
    modules.includes(module.id)
  );

  return (
    <div className={cn("grid grid-cols-2 xs:grid-cols-3 gap-2", className)}>
      {leagueModules.map((mod) => (
        <CheckboxCard
          key={mod.id}
          label={mod.name}
          showCheckbox={false}
          checked={true}
          disabled
        />
      ))}
    </div>
  );
}

async function getLeagueModules(leagueId: string) {
  "use cache";
  cacheTag(getLeagueModulesTag(leagueId));

  return db.query.leagueOptions
    .findFirst({
      columns: {
        tacticalModules: true,
      },
      where: (options, { eq }) => eq(options.leagueId, leagueId),
    })
    .then((res) => res!.tacticalModules);
}

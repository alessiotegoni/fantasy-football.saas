"use client";

import CheckboxCard from "@/components/ui/checkbox-card";
import { TacticalModule } from "@/drizzle/schema";
import { cn } from "@/lib/utils";
import { use } from "react";

type Props = {
  allowedModulesPromise: Promise<number[]>;
  tacticalModulesPromise: Promise<TacticalModule[]>;
  defaultModule?: TacticalModule | null;
  onModuleChange?: (module: TacticalModule) => void;
  className?: string;
};

export default function LeagueModules({
  allowedModulesPromise,
  tacticalModulesPromise,
  defaultModule,
  onModuleChange,
  className,
}: Props) {
  const tacticalModules = use(tacticalModulesPromise);
  const allowedModulesIds = use(allowedModulesPromise);

  const leagueModules = tacticalModules.filter((module) =>
    allowedModulesIds.includes(module.id)
  );

  return (
    <div className={cn("grid grid-cols-2 xs:grid-cols-3 gap-2", className)}>
      {leagueModules.map((module) => (
        <CheckboxCard
          key={module.id}
          label={module.name}
          showCheckbox={false}
          checked={defaultModule?.id === module.id}
          onChange={onModuleChange?.bind(null, module)}
          disabled
        />
      ))}
    </div>
  );
}

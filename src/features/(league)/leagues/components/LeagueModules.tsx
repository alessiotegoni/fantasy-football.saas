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
    <ul className={cn("grid grid-cols-2 xs:grid-cols-3 gap-2", className)}>
      {leagueModules.map((module) => {
        const isCurrentModule = defaultModule?.id === module.id;

        return (
          <li
            className={cn(
              "flex items-center p-3 border rounded-xl transition-colors bg-muted/30",
              onModuleChange && "cursor-pointer",
              isCurrentModule && "text-primary"
            )}
            onClick={onModuleChange?.bind(null, module)}
          >
            <p className={cn("font-medium", isCurrentModule && "text-primary")}>
              {module.name}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

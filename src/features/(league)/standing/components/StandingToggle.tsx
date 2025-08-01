"use client";

import { Leaderboard, Settings } from "iconoir-react";
import { Switch } from "@/components/ui/switch";

type Props = {
  isExtended: boolean;
  onToggle: (extended: boolean) => void;
};

export function StandingToggle({ isExtended, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between p-3 xs:p-4 bg-muted/30 rounded-2xl border border-border mb-6">
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={onToggle.bind(null, !isExtended)}
      >
        <Leaderboard className="size-6 text-muted-foreground" />
        <span className="text-sm xs:text-base font-medium">
          Classifica estesa
        </span>
      </div>

      <Switch checked={isExtended} onCheckedChange={onToggle} />
    </div>
  );
}

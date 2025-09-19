"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useIsMobile } from "@/hooks/useMobile";
import RoleGroup from "./RoleGroup";
import { cn } from "@/lib/utils";

type Props = {
  team: NonNullable<LineupTeam & { isHome: boolean }>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupField(props: Props) {
  const isMobile = useIsMobile(640);

  return isMobile ? <MobileField {...props} /> : <DesktopField {...props} />;
}

function MobileField(props: Props) {
  const isAway = props.team.isHome === false;

  return (
    <div
      className={cn("flex flex-col gap-4 p-4", isAway && "flex-col-reverse")}
    >
      <RoleRow {...props} />
    </div>
  );
}

function DesktopField(props: Props) {
  const isAway = props.team.isHome === false;

  return (
    <div
      className={cn(
        "flex items-center gap-3 md:gap-4",
        isAway ? "mr-3" : "ml-3",
        isAway && "flex-row-reverse"
      )}
    >
      <RoleColumn {...props} />
    </div>
  );
}

function RoleRow(props: Props) {
  return <RoleGroup {...props} className="justify-evenly gap-4" />;
}

function RoleColumn(props: Props) {
  return <RoleGroup {...props} className="flex-col justify-evenly h-full" />;
}

"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import RoleGroup from "./RoleGroup";
import { cn } from "@/lib/utils";

type Props = {
  team: NonNullable<LineupTeam & { isAway: boolean }>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupField(props: Props) {
  const isMobile = useMediaQuery(640);

  return isMobile ? <MobileField {...props} /> : <DesktopField {...props} />;
}

function MobileField(props: Props) {
  const isAway = props.team.isAway;

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 pt-4 sm:p-4",
        isAway && "flex-col-reverse pt-0 pb-4"
      )}
    >
      <RoleRow {...props} />
    </div>
  );
}

function DesktopField(props: Props) {
  const isAway = props.team.isAway;

  return (
    <div
      className={cn(
        "flex justify-between items-center gap-3 md:gap-4 mx-3",
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

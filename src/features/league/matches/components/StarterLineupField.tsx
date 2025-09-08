"use client";

import { LineupPlayer } from "../queries/match";
import { LineupTeam } from "../utils/match";
import { useIsMobile } from "@/hooks/useMobile";
import RoleGroup from "./RoleGroup";

type Props = {
  team: NonNullable<LineupTeam>;
  canEdit: boolean;
  players: LineupPlayer[];
};

export default function StarterLineupField(props: Props) {
  const isMobile = useIsMobile(640);

  return isMobile ? <MobileField {...props} /> : <DesktopField {...props} />;
}

function MobileField(props: Props) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <RoleRow {...props} />
    </div>
  );
}

function DesktopField(props: Props) {
  return (
    <div className="ml-3 flex items-center gap-3 md:gap-4">
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

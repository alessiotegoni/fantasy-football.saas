import Avatar from "@/components/Avatar";
import { LineupPlayer } from "../queries/match";
import RemovePlayerButton from "./RemovePlayerButton";
import LineupPlayerBonusMaluses from "./LineupPlayerBonusMaluses";
import { cn } from "@/lib/utils";

type Props = {
  player: LineupPlayer;
  isAwayTeam: boolean;
  canEdit?: boolean;
};

// FIXME: base ui + bonusMalus ui

export default function PresidentCard({ player, isAwayTeam, canEdit }: Props) {
  return (
    <div
      className={cn(`relative flex 2xl:flex-col justify-start items-center gap-2
  2xl:justify-center text-center group`, isAwayTeam && "flex-row-reverse")}
    >
      <Avatar
        imageUrl={player.avatarUrl}
        name={player.displayName}
        className="size-16"
        renderFallback={() => null}
      />
      <p className="font-semibold">{player.displayName}</p>
      <LineupPlayerBonusMaluses {...player} />
      {canEdit && <RemovePlayerButton playerId={player.id} />}
    </div>
  );
}

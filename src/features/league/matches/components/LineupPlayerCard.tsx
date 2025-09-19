import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerType } from "@/drizzle/schema";
import RemovePlayerButton from "./RemovePlayerButton";
import { User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";
import LineupPlayerVotes from "./LineupPlayerVotes";
import LineupPlayerBonusMaluses from "./LineupPlayerBonusMaluses";

type Props = {
  player: LineupPlayer;
  type: LineupPlayerType;
  className?: string;
  canEdit: boolean;
  isAwayTeam: boolean;
};

// FIXME: UI LineupPlayerCard (verticale mobile, orizzontale desktop)
// FIXME: President lineup card ui

function LineupPlayerCard({
  player,
  type,
  className,
  canEdit,
  isAwayTeam,
}: Props) {
  const isStarter = type === "starter";
  const isBench = type === "bench";

  return (
    <div
      className={cn(
        "relative group flex justify-between items-center gap-2 rounded-md *:select-none",
        isStarter && "flex-col text-center",
        isBench && "flex-row px-2",
        isBench && isAwayTeam && "flex-row-reverse 2xl:flex-row",
        isBench && canEdit && "hover:cursor-grab",
        isBench && !canEdit && "!pr-0.5",
        !canEdit && !player.vote && "opacity-60",
        className
      )}
    >
      <div
        className={cn(
          isBench && "flex items-center gap-2",
          isBench && isAwayTeam && "flex-row-reverse 2xl:flex-row"
        )}
      >
        <div className="relative flex flex-col justify-center items-center gap-0.5">
          <LineupPlayerBonusMaluses {...player} />
          <Avatar
            imageUrl={player.avatarUrl}
            name={player.displayName}
            className={cn(isStarter ? "size-12" : "size-10")}
            renderFallback={() => <User />}
          />
          {isStarter && <LineupPlayerVotes {...player} />}
          {isBench && player.role && (
            <PlayerRoleBadge
              role={player.role}
              className="absolute -top-1 -left-1 size-4 text-[10px]"
            />
          )}
        </div>
        <div className={cn("text-xs max-w-20", isBench && "truncate")}>
          <p className="font-semibold">
            {player.displayName.split(" ").slice(1).join(" ")}
          </p>
          {isBench && player.team && (
            <span className="text-[11px] text-muted-foreground">
              {player.team.displayName}
            </span>
          )}
        </div>
      </div>
      {isBench && <LineupPlayerVotes {...player} />}

      {canEdit && isStarter && (
        <RemovePlayerButton
          playerId={player.id}
          className={cn(
            isStarter && "top-0 right-0 xl:top-1 xl:right-1",
            isBench && "hidden sm:group-hover:flex 2xl:group-hover:hidden"
          )}
        />
      )}
    </div>
  );
}

export default memo(LineupPlayerCard);

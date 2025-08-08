import Avatar from "@/components/Avatar";
import { cn } from "@/lib/utils";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerType } from "@/drizzle/schema";
import RemovePlayerButton from "./RemovePlayerButton";
import { User } from "iconoir-react";
import PlayerRoleBadge from "@/components/PlayerRoleBadge";
import { memo } from "react";

type Props = {
  player: LineupPlayer;
  type: LineupPlayerType;
  className?: string;
  canEdit: boolean;
};

// FIXME: UI LineupPlayerCard (verticale mobile, orizzontale desktop)

function LineupPlayerCard({ player, type, className, canEdit }: Props) {
  const isStarter = type === "starter";
  const isBench = type === "bench";

  console.log(player);

  return (
    <div
      className={cn(
        "relative group flex items-center gap-2 p-2 rounded-md",
        isStarter && "flex-col text-center",
        isBench && "hover:cursor-grab flex-row",
        className
      )}
    >
      <div className="relative">
        <Avatar
          imageUrl={player.avatarUrl}
          name={player.displayName}
          className={cn(isStarter ? "size-12" : "size-10")}
          renderFallback={() => <User />}
        />
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
        {player.vote !== null && (
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">
              Voto: {player.vote ?? "-"}
            </span>
            {player.bonusMaluses && player.bonusMaluses.length > 0 && (
              <div className="flex gap-1">
                {player.bonusMaluses.map((bm, index) => (
                  <div key={index} className="flex items-center">
                    {bm.imageUrl && <></>}
                    <span>{bm.count > 0 ? `+${bm.count}` : bm.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {player.totalVote !== null && (
          <p className="font-bold">Totale: {player.totalVote}</p>
        )}
      </div>
      {canEdit && (
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

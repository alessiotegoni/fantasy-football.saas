import Avatar from "@/components/Avatar";
import { LineupPlayer } from "../queries/match";
import RemovePlayerButton from "./RemovePlayerButton";
import LineupPlayerBonusMaluses from "./LineupPlayerBonusMaluses";
import { cn } from "@/lib/utils";
import PlayerFallbackImage from "@/components/PlayerFallbackImage";

type Props = {
  player: LineupPlayer;
  isAwayTeam: boolean;
  canEdit?: boolean;
};

// TODO: aggiungere icone per rigori presidenziali
// e cambiare stile

export default function PresidentCard({ player, isAwayTeam, canEdit }: Props) {
  return (
    <div
      className={cn(
        `relative flex flex-col sm:flex-row mt-2 sm:mt-0 2xl:flex-col justify-start items-center gap-2
  2xl:justify-center text-center group`,
        isAwayTeam && "sm:flex-row-reverse"
      )}
    >
      <Avatar
        imageUrl={player.avatarUrl}
        name={player.displayName}
        className="size-16 *:bg-transparent !overflow-visible"
        renderFallback={() => (
          <PlayerFallbackImage {...player} className="size-16" />
        )}
      />
      <div>
        <p className="font-semibold">{player.displayName}</p>
        <p className="text-[11px] xs:text-xs text-muted-foreground">
          {player.team.displayName}
        </p>
      </div>
      <LineupPlayerBonusMaluses
        {...player}
        className={cn(
          "*:size-7 sm:*:size-10 2xl:*:size-7 -top-3 right-0 sm:static 2xl:absolute sm:ml-auto",
          isAwayTeam && "left-0 2xl:left-auto sm:ml-0 sm:mr-auto"
        )}
      />
      {canEdit && <RemovePlayerButton playerId={player.id} className="top-0 sm:top-1/2 2xl:top-0" />}
    </div>
  );
}

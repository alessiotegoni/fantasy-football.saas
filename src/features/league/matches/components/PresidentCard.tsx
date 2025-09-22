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
          <img
            src="https://tpeehtrlgmfimvwrswif.supabase.co/storage/v1/object/public/kik-league/players-avatars/president-placeholder.png"
            alt="player placeholder"
            className="size-16"
          />
        )}
      />
      <div>
        <p className="font-semibold">{player.displayName}</p>
        <p className="text-[11px] xs:text-xs text-muted-foreground">
          {player.team.displayName}
        </p>
      </div>
      <LineupPlayerBonusMaluses {...player} />
      {canEdit && <RemovePlayerButton playerId={player.id} />}
    </div>
  );
}

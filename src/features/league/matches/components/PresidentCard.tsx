import Avatar from "@/components/Avatar";
import { LineupPlayer } from "../queries/match";
import RemovePlayerButton from "./RemovePlayerButton";

type Props = {
  player: LineupPlayer;
  canEdit?: boolean;
};

export default function PresidentCard({ player, canEdit }: Props) {
  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center group">
      <Avatar
        imageUrl={player.avatarUrl}
        name={player.displayName}
        className="size-16"
        renderFallback={() => null}
      />
      <p className="font-semibold mt-2">{player.displayName}</p>
      {player.vote !== null && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">
            Voto: {player.vote ?? "-"}
          </span>
          {"bonusMaluses" in player &&
            player.bonusMaluses &&
            player.bonusMaluses.length > 0 && (
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
      {canEdit && <RemovePlayerButton playerId={player.id} />}
    </div>
  );
}

import Avatar from "@/components/Avatar";
import { LineupPlayer } from "../queries/match";
import { LineupPlayerWithoutVotes } from "@/contexts/MyLineupProvider";
import RemovePlayerButton from "./RemovePlayerButton";

type Props = {
  player: LineupPlayer | LineupPlayerWithoutVotes;
  canEdit?: boolean;
};

export default function PresidentCard({ player, canEdit }: Props) {
  const totalVote =
    "vote" in player && player.vote !== undefined && player.vote !== null
      ? player.vote +
        (player.bonusMaluses?.reduce((acc, bm) => acc + bm.count, 0) ?? 0)
      : undefined;

  return (
    <div className="relative flex flex-col items-center justify-center h-full text-center group">
      <Avatar
        imageUrl={player.avatarUrl}
        name={player.displayName}
        className="size-16"
        renderFallback={() => null}
      />
      <p className="font-semibold mt-2">{player.displayName}</p>
      {"vote" in player && player.vote !== undefined && (
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
                    {bm.imageUrl && (
                      <Image
                        src={bm.imageUrl}
                        alt="bonus/malus icon"
                        width={16}
                        height={16}
                      />
                    )}
                    <span>{bm.count > 0 ? `+${bm.count}` : bm.count}</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}
      {totalVote !== undefined && (
        <p className="font-bold">Totale: {totalVote}</p>
      )}
      {canEdit && <RemovePlayerButton playerId={player.id} />}
    </div>
  );
}

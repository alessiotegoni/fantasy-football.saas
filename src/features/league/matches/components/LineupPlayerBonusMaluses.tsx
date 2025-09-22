import { LineupPlayer } from "../queries/match";

// FIXME: mandare a schermo immagine bonus (immagini soprapposte se piu bonus)
// che al click aprono dialog con legenda es. immagine x2 goal fatti ecc.

type Props = {
  className?: string;
} & Pick<LineupPlayer, "bonusMaluses">;

export default function LineupPlayerBonusMaluses({
  bonusMaluses,
  className,
}: Props) {
  if (!bonusMaluses.length) return null;

  return (
    <div className="absolute -top-1 -right-1 flex gap-1">
      {bonusMaluses.map((bm, index) => (
        <div key={index} className="flex items-center">
          {bm.imageUrl && <></>}
          <span>{bm.count > 0 ? `+${bm.count}` : bm.count}</span>
        </div>
      ))}
    </div>
  );
}

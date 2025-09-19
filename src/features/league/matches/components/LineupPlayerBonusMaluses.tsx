import { LineupPlayer } from "../queries/match";

export default function LineupPlayerBonusMaluses({
  bonusMaluses,
}: Pick<LineupPlayer, "bonusMaluses">) {
  if (!bonusMaluses.length) return null;

  return (
    <div className="flex gap-1">
      {bonusMaluses.map((bm, index) => (
        <div key={index} className="flex items-center">
          {bm.imageUrl && <></>}
          <span>{bm.count > 0 ? `+${bm.count}` : bm.count}</span>
        </div>
      ))}
    </div>
  );
}
